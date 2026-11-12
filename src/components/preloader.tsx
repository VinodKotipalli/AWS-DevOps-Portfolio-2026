import { useCallback, useEffect, useRef, useState } from 'react';
import { photos } from '../lib/content';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import {
  markPreloaderSeen,
  triggerHeroEntranceFromPreloader,
} from '../lib/preloader';

type PreloaderProps = {
  onComplete: (restoreFocusToMain: boolean) => void;
};

const PRELOADER_NAME = 'SAI VINOD';
const PRELOADER_SUBTITLE = 'CLOUD & DEVOPS ENGINEER';
const MAX_TIMEOUT_MS = 4000;

function waitForEssentialHeroAssets(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  const tasks: Promise<unknown>[] = [];

  // 1. Wait for essential above-the-fold hero portrait ONLY if configured
  if (photos.heroPortrait) {
    const imagePromise = new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      const done = () => resolve();
      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(done).catch(done);
        } else {
          done();
        }
      };
      img.onerror = done;
      img.src = photos.heroPortrait!;
      if (img.complete) {
        done();
      }
    });
    tasks.push(imagePromise);
  }

  // 2. Wait briefly for document fonts (capped at 650ms so slow fonts never block)
  if (typeof document !== 'undefined' && 'fonts' in document) {
    const fontRace = Promise.race([
      document.fonts.ready.catch(() => undefined),
      new Promise<void>((resolve) => window.setTimeout(resolve, 650)),
    ]);
    tasks.push(fontRace);
  }

  if (tasks.length === 0) return Promise.resolve();
  return Promise.allSettled(tasks).then(() => undefined);
}

export function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const exitedRef = useRef(false);
  const [statusText, setStatusText] = useState<'Preparing your experience' | 'Ready'>(
    'Preparing your experience'
  );

  // Dismiss immediately (used by "Skip intro", Escape key, 4s timeout, or reduced motion)
  const dismissImmediately = useCallback(
    (restoreFocus: boolean) => {
      if (exitedRef.current) return;
      exitedRef.current = true;

      const overlay = overlayRef.current;
      if (overlay) {
        gsap.killTweensOf(overlay);
        gsap.killTweensOf(overlay.querySelectorAll('*'));
      }

      markPreloaderSeen();
      triggerHeroEntranceFromPreloader();
      onComplete(restoreFocus);
    },
    [onComplete]
  );

  const handleSkipClick = () => {
    dismissImmediately(true);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      dismissImmediately(false);
      return;
    }

    const reducedMotion = prefersReducedMotion();

    // Lock document scrolling while preloader overlay is active
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Escape key listener to skip immediately
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        const focusWasInside = overlay.contains(document.activeElement);
        dismissImmediately(focusWasInside || true);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    // Hard 4-second maximum timeout fail-safe
    const maxTimeoutId = window.setTimeout(() => {
      const focusWasInside = overlay.contains(document.activeElement);
      dismissImmediately(focusWasInside);
    }, MAX_TIMEOUT_MS);

    let shimmerTween: gsap.core.Tween | null = null;
    let entranceTl: gsap.core.Timeline | null = null;
    let completionTl: gsap.core.Timeline | null = null;
    let minEntranceTimerId: number | undefined;

    if (reducedMotion) {
      // Reduced motion: simple static loading state only while needed, then remove without motion
      let cancelled = false;
      waitForEssentialHeroAssets().then(() => {
        if (cancelled || exitedRef.current) return;
        setStatusText('Ready');
        minEntranceTimerId = window.setTimeout(() => {
          const focusWasInside = overlay.contains(document.activeElement);
          dismissImmediately(focusWasInside);
        }, 180);
      });

      return () => {
        cancelled = true;
        window.clearTimeout(maxTimeoutId);
        window.clearTimeout(minEntranceTimerId);
        window.removeEventListener('keydown', onKeyDown);
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
      };
    }

    // Query elements for the animated sequence
    const bgGlow = overlay.querySelector<HTMLElement>('.preloader-bg-glow');
    const chars = gsap.utils.toArray<HTMLElement>(
      '.preloader-char-inner',
      overlay
    );
    const subtitle = overlay.querySelector<HTMLElement>('.preloader-subtitle');
    const progressWrap = overlay.querySelector<HTMLElement>(
      '.preloader-progress-wrap'
    );
    const shimmerBar = overlay.querySelector<HTMLElement>(
      '.preloader-shimmer-bar'
    );
    const completeBar = overlay.querySelector<HTMLElement>(
      '.preloader-complete-bar'
    );
    const statusEl = overlay.querySelector<HTMLElement>('.preloader-status');

    // Set initial states (overlay itself is already opaque #06110D on frame 0)
    if (bgGlow) gsap.set(bgGlow, { opacity: 0 });
    if (chars.length) gsap.set(chars, { opacity: 0, y: 16 });
    if (subtitle) gsap.set(subtitle, { opacity: 0, y: 8 });
    if (progressWrap) gsap.set(progressWrap, { opacity: 0 });
    if (completeBar) {
      gsap.set(completeBar, { scaleX: 0, opacity: 0, transformOrigin: 'left center' });
    }
    if (statusEl) gsap.set(statusEl, { opacity: 0, y: 4 });

    // Indeterminate traveling golden highlight while assets are preparing
    if (shimmerBar) {
      shimmerTween = gsap.fromTo(
        shimmerBar,
        { xPercent: -120 },
        {
          xPercent: 250,
          duration: 0.95,
          ease: 'sine.inOut',
          repeat: -1,
        }
      );
    }

    // Coordinated entrance timeline (0ms -> ~950ms)
    entranceTl = gsap.timeline();

    // 1. Background entrance — 0–300ms
    if (bgGlow) {
      entranceTl.to(
        bgGlow,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        0
      );
    }

    // 2. Name reveal — 150–950ms ("SAI VINOD" letter by letter, 16px upward, ~60ms stagger, ease-out)
    if (chars.length) {
      entranceTl.to(
        chars,
        {
          opacity: 1,
          y: 0,
          duration: 0.38,
          stagger: 0.06,
          ease: 'power3.out',
        },
        0.15
      );
    }

    // 3. Subtitle entrance — 500–1,000ms (8px upward movement, status label shortly afterward)
    if (subtitle) {
      entranceTl.to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          ease: 'power2.out',
        },
        0.5
      );
    }

    if (progressWrap) {
      entranceTl.to(
        progressWrap,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.56
      );
    }

    if (statusEl) {
      entranceTl.to(
        statusEl,
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out',
        },
        0.62
      );
    }

    // Wait for both essential above-the-fold assets AND the brief 950ms entrance window
    const minEntrancePromise = new Promise<void>((resolve) => {
      minEntranceTimerId = window.setTimeout(resolve, 950);
    });

    let cancelled = false;

    Promise.all([waitForEssentialHeroAssets(), minEntrancePromise]).then(() => {
      if (cancelled || exitedRef.current) return;

      // 5. Completion: Change status to "Ready", resolve progress line into complete golden stroke + 200ms glow pulse
      setStatusText('Ready');
      shimmerTween?.kill();

      completionTl = gsap.timeline({
        onComplete: () => {
          if (exitedRef.current) return;
          exitedRef.current = true;
          const focusWasInside = overlay.contains(document.activeElement);
          markPreloaderSeen();
          onComplete(focusWasInside);
        },
      });

      if (shimmerBar) {
        completionTl.to(shimmerBar, { opacity: 0, duration: 0.1 }, 0);
      }

      if (completeBar) {
        completionTl
          .to(
            completeBar,
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.14,
              ease: 'power2.out',
            },
            0
          )
          .to(
            completeBar,
            {
              boxShadow: '0 0 18px 2px rgba(243, 181, 74, 0.9)',
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: 'sine.inOut',
            },
            0.04
          );
      }

      // 6. Transition into the portfolio — ~600ms upward curtain exit
      // Start the hero's entrance sequence during the latter half of the exit (~0.24s + 0.26s = 0.50s)
      completionTl.call(
        () => {
          triggerHeroEntranceFromPreloader();
        },
        [],
        0.48
      );

      completionTl.to(
        overlay,
        {
          yPercent: -100,
          duration: 0.6,
          ease: 'power3.inOut',
        },
        0.22
      );
    });

    return () => {
      cancelled = true;
      window.clearTimeout(maxTimeoutId);
      window.clearTimeout(minEntranceTimerId);
      window.removeEventListener('keydown', onKeyDown);
      shimmerTween?.kill();
      entranceTl?.kill();
      completionTl?.kill();
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [dismissImmediately, onComplete]);

  return (
    <div
      ref={overlayRef}
      role="region"
      aria-label="Portfolio loading intro"
      className="fixed inset-0 z-[110] flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#06110D] text-[#f5f2eb] px-4 select-none will-change-transform"
    >
      {/* ====================================================================
          DECORATIVE FOREST-GREEN RADIAL GLOW & DIAGONAL GOLDEN LIGHT STREAKS
         ==================================================================== */}
      <div
        aria-hidden="true"
        className="preloader-bg-glow pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Faint radial green glow behind central content (lighter on mobile) */}
        <div
          className="absolute inset-0 opacity-70 sm:opacity-100"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(22, 68, 44, 0.42) 0%, rgba(11, 34, 22, 0.22) 45%, rgba(6, 17, 13, 0) 74%)',
          }}
        />

        {/* Subtle warm golden core highlight */}
        <div
          className="absolute inset-0 opacity-55 sm:opacity-85"
          style={{
            background:
              'radial-gradient(circle 280px at 50% 48%, rgba(243, 181, 74, 0.09) 0%, transparent 75%)',
          }}
        />

        {/* Subtle diagonal golden light streaks inspired by the portfolio hero */}
        <div
          className="absolute -top-[20%] left-[18%] h-[140%] w-[16%] -rotate-[28deg] opacity-15 sm:opacity-25"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(243, 181, 74, 0.12) 50%, transparent 100%)',
          }}
        />
        <div
          className="hidden sm:block absolute -top-[22%] right-[20%] h-[140%] w-[18%] -rotate-[28deg] opacity-20"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(247, 201, 112, 0.11) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* ====================================================================
          CENTRAL COMPOSITION: "SAI VINOD" + SUBTITLE + PROGRESS LINE + STATUS
         ==================================================================== */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        {/* Accessible single-label heading for "SAI VINOD" with masked characters */}
        <div
          aria-label={PRELOADER_NAME}
          className="font-display text-[clamp(2.05rem,9vw,5.4rem)] font-black uppercase leading-none tracking-[0.12em] sm:tracking-[0.16em] text-[#f5f2eb] whitespace-nowrap"
        >
          <span aria-hidden="true" className="inline-flex items-baseline">
            {Array.from(PRELOADER_NAME).map((ch, idx) =>
              ch === ' ' ? (
                <span
                  key={`space-${idx}`}
                  className="inline-block w-[0.34em]"
                />
              ) : (
                <span
                  key={`${ch}-${idx}`}
                  className="inline-block overflow-hidden py-[0.06em]"
                >
                  <span className="preloader-char-inner inline-block will-change-transform">
                    {ch}
                  </span>
                </span>
              )
            )}
          </span>
        </div>

        {/* Subtitle: "CLOUD & DEVOPS ENGINEER" */}
        <p className="preloader-subtitle mt-3.5 sm:mt-4 font-mono text-[10px] sm:text-xs md:text-[13px] font-semibold uppercase tracking-[0.24em] sm:tracking-[0.32em] text-[#f3b54a]/90">
          {PRELOADER_SUBTITLE}
        </p>

        {/* Thin Golden Progress Line (~220px on desktop, scaled on phones) */}
        <div
          aria-hidden="true"
          className="preloader-progress-wrap relative mt-6 sm:mt-7 h-[2px] w-[min(220px,68vw)] overflow-hidden rounded-full bg-[#f5f2eb]/14"
        >
          {/* Indeterminate traveling golden highlight */}
          <div className="preloader-shimmer-bar absolute inset-y-0 left-0 w-2/5 rounded-full bg-gradient-to-r from-transparent via-[#f3b54a] to-transparent" />

          {/* Complete golden stroke resolved on "Ready" */}
          <div className="preloader-complete-bar absolute inset-0 rounded-full bg-gradient-to-r from-[#d99b32] via-[#ffe29a] to-[#d99b32]" />
        </div>

        {/* Concise Polite Status Region: "Preparing your experience" -> "Ready" */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="preloader-status mt-3.5 font-mono text-[11px] sm:text-xs tracking-[0.08em] text-[#f5f2eb]/70"
        >
          {statusText}
        </div>
      </div>

      {/* ====================================================================
          "SKIP INTRO" BUTTON (Present from 0ms, >= 48x48 CSS px touch target)
         ==================================================================== */}
      <button
        ref={skipBtnRef}
        type="button"
        onClick={handleSkipClick}
        aria-label="Skip intro animation"
        style={{
          bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
          right: 'max(1.25rem, env(safe-area-inset-right))',
        }}
        className="fixed z-20 inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-[#f3b54a]/35 bg-[#091a13]/85 px-5 py-2.5 font-mono text-xs font-medium tracking-[0.1em] text-[#f5f2eb]/85 backdrop-blur-md transition-colors hover:border-[#ffd984] hover:bg-[#f3b54a]/15 hover:text-[#ffe29a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd984] cursor-pointer"
      >
        <span>Skip intro</span>
        <span aria-hidden="true" className="text-[#f3b54a]">
          →
        </span>
      </button>
    </div>
  );
}
