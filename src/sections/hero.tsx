import { useRef, type MouseEvent } from 'react';
import { heroConfig, personalInfo, photos } from '../lib/content';
import {
  cinematic,
  gsap,
  motionOk,
  prefersReducedMotion,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from '../lib/gsap';

export function Hero() {
  const root = useRef<HTMLElement>(null);

  // Smoothly scroll to the existing projects section, accounting for sticky header
  const handleViewWorkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target =
      document.getElementById('projects') ??
      document.getElementById('selected-work');
    if (!target) return;

    const headerOffset = 76;
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;

    if (prefersReducedMotion()) {
      window.scrollTo({ top, behavior: 'auto' });
    } else {
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const bgLayer = section.querySelector<HTMLElement>('.hero-bg-layer');
      const stageGlow = section.querySelector<HTMLElement>('.hero-stage-glow');
      const headingWords = gsap.utils.toArray<HTMLElement>(
        '.hero-heading-word-inner',
        section
      );
      const roleTitleEl = section.querySelector<HTMLElement>(
        '.hero-role-headline'
      );
      const roleAccentLine = section.querySelector<HTMLElement>(
        '.hero-role-line'
      );
      const roleGlowSweep = section.querySelector<HTMLElement>(
        '.hero-role-sweep'
      );
      const specialtyPills = gsap.utils.toArray<HTMLElement>(
        '.hero-specialty-pill',
        section
      );
      const introItems = gsap.utils.toArray<HTMLElement>(
        '.hero-intro-item',
        section
      );
      const streaks = gsap.utils.toArray<HTMLElement>(
        '.hero-light-streak',
        section
      );

      // Honor prefers-reduced-motion: show all content immediately and disable continuous motion & parallax
      if (!motionOk()) {
        return;
      }

      // Split "AWS DevOps Engineer" into characters for a crisp staggered character reveal + wave animation
      const roleSplit = roleTitleEl
        ? new SplitText(roleTitleEl, {
            type: 'words,chars',
            charsClass: 'role-char inline-block',
            mask: 'chars',
          })
        : null;

      // Initial states for the coordinated entrance sequence
      if (bgLayer) gsap.set(bgLayer, { opacity: 0 });
      if (headingWords.length) gsap.set(headingWords, { yPercent: 115 });
      if (roleSplit?.chars.length) {
        gsap.set(roleSplit.chars, { yPercent: 130, rotateZ: 4, opacity: 0 });
      }
      if (roleAccentLine) {
        gsap.set(roleAccentLine, { scaleX: 0, transformOrigin: 'left center' });
      }
      if (specialtyPills.length) {
        gsap.set(specialtyPills, { opacity: 0, y: 14, scale: 0.94 });
      }
      if (stageGlow) gsap.set(stageGlow, { opacity: 0, y: 20, scale: 1.025 });
      if (introItems.length) gsap.set(introItems, { opacity: 0, y: 18 });

      const entranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // 1. Fade in the forest-green & near-black background over 700ms
      if (bgLayer) {
        entranceTl.to(
          bgLayer,
          {
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
          },
          0
        );
      }

      // 2. Reveal "SAIVINOD KOTIPALLI" upward through a clipping mask over 900ms with word stagger
      if (headingWords.length) {
        entranceTl.to(
          headingWords,
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.14,
            ease: 'power3.out',
          },
          0.14
        );
      }

      // 3. Fade in the central stage lighting/portrait layer over 1,000ms
      if (stageGlow) {
        entranceTl.to(
          stageGlow,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: 'power3.out',
          },
          0.28
        );
      }

      // 4. Reveal "AWS DevOps Engineer" characters with staggered spring/expo lift + golden rule draw
      if (roleAccentLine) {
        entranceTl.to(
          roleAccentLine,
          {
            scaleX: 1,
            duration: 0.85,
            ease: 'expo.out',
          },
          0.42
        );
      }

      if (roleSplit?.chars.length) {
        entranceTl.to(
          roleSplit.chars,
          {
            yPercent: 0,
            rotateZ: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.028,
            ease: 'expo.out',
          },
          0.46
        );
      }

      if (specialtyPills.length) {
        entranceTl.to(
          specialtyPills,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.06,
            ease: 'back.out(1.6)',
          },
          0.82
        );
      }

      // 5. Reveal the lower-left description and "View My Work" CTA with 100ms staggered delays
      if (introItems.length) {
        entranceTl.to(
          introItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out',
          },
          0.78
        );
      }

      // Continuous subtle golden shimmer & character wave on "AWS DevOps Engineer"
      if (roleGlowSweep) {
        gsap.fromTo(
          roleGlowSweep,
          { xPercent: -120 },
          {
            xPercent: 220,
            duration: 3.8,
            ease: 'power2.inOut',
            repeat: -1,
            repeatDelay: 2.2,
            delay: 1.8,
          }
        );
      }

      if (roleSplit?.chars.length) {
        gsap.to(roleSplit.chars, {
          color: '#ffe29a',
          textShadow: '0 0 18px rgba(243, 181, 74, 0.55)',
          duration: 0.45,
          stagger: {
            each: 0.04,
            repeat: -1,
            yoyo: true,
            repeatDelay: 4.2,
          },
          ease: 'sine.inOut',
          delay: 2.1,
        });
      }

      // Ambient Effect: Faint diagonal golden light streaks moving very slowly in the background
      streaks.forEach((streak, idx) => {
        gsap.to(streak, {
          xPercent: idx % 2 === 0 ? 7 : -7,
          yPercent: idx % 2 === 0 ? 5 : -5,
          opacity: idx % 2 === 0 ? 0.36 : 0.22,
          duration: 12 + idx * 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      // Native Scroll Shift: subtle background shift as the visitor scrolls past the hero
      if (bgLayer) {
        gsap.to(bgLayer, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Desktop Pointer Parallax: background movement up to 6px and heading movement up to 10px
      let cleanupParallax: (() => void) | undefined;
      const hasFinePointer =
        typeof window !== 'undefined' &&
        window.matchMedia('(pointer: fine)').matches;

      if (cinematic() && hasFinePointer) {
        const bgParallaxEl = section.querySelector<HTMLElement>(
          '.hero-bg-parallax'
        );
        const headingParallaxEl = section.querySelector<HTMLElement>(
          '.hero-heading-parallax'
        );
        const roleParallaxEl = section.querySelector<HTMLElement>(
          '.hero-role-parallax'
        );

        if (bgParallaxEl && headingParallaxEl) {
          const moveBgX = gsap.quickTo(bgParallaxEl, 'x', {
            duration: 1.15,
            ease: 'power3.out',
          });
          const moveBgY = gsap.quickTo(bgParallaxEl, 'y', {
            duration: 1.15,
            ease: 'power3.out',
          });
          const moveHeadingX = gsap.quickTo(headingParallaxEl, 'x', {
            duration: 1.15,
            ease: 'power3.out',
          });
          const moveHeadingY = gsap.quickTo(headingParallaxEl, 'y', {
            duration: 1.15,
            ease: 'power3.out',
          });
          const moveRoleX = roleParallaxEl
            ? gsap.quickTo(roleParallaxEl, 'x', {
                duration: 1.25,
                ease: 'power3.out',
              })
            : null;
          const moveRoleY = roleParallaxEl
            ? gsap.quickTo(roleParallaxEl, 'y', {
                duration: 1.25,
                ease: 'power3.out',
              })
            : null;

          const onPointerMove = (e: PointerEvent) => {
            if (e.pointerType === 'touch') return;
            const nx = (e.clientX / window.innerWidth - 0.5) * 2;
            const ny = (e.clientY / window.innerHeight - 0.5) * 2;
            moveBgX(nx * 6);
            moveBgY(ny * 6);
            moveHeadingX(-nx * 10);
            moveHeadingY(-ny * 10);
            moveRoleX?.(-nx * 6);
            moveRoleY?.(-ny * 5);
          };

          const onPointerLeave = () => {
            moveBgX(0);
            moveBgY(0);
            moveHeadingX(0);
            moveHeadingY(0);
            moveRoleX?.(0);
            moveRoleY?.(0);
          };

          section.addEventListener('pointermove', onPointerMove);
          section.addEventListener('pointerleave', onPointerLeave);

          cleanupParallax = () => {
            section.removeEventListener('pointermove', onPointerMove);
            section.removeEventListener('pointerleave', onPointerLeave);
          };
        }
      }

      return () => {
        cleanupParallax?.();
        roleSplit?.revert();
        ScrollTrigger.refresh();
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="my-story"
      aria-label="Hero Introduction"
      className="relative min-h-svh w-full overflow-hidden bg-[#030906] text-[#f5f2eb] flex flex-col justify-between"
    >
      {/* ====================================================================
          LAYER 1: DARK FOREST-GREEN & NEAR-BLACK ATMOSPHERE + DIAGONAL GOLDEN LIGHT STREAKS
         ==================================================================== */}
      <div
        aria-hidden="true"
        className="hero-bg-layer pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="hero-bg-parallax absolute -inset-4">
          <div
            className="size-full"
            style={{
              background:
                'radial-gradient(ellipse 74% 66% at 54% 44%, rgba(16, 48, 30, 0.94) 0%, rgba(7, 22, 14, 0.97) 54%, rgba(3, 8, 5, 1) 100%)',
            }}
          />

          <div
            className="hero-stage-glow absolute inset-0 will-change-transform"
            style={{
              background:
                'radial-gradient(circle 480px at 56% 42%, rgba(243, 181, 74, 0.15) 0%, rgba(20, 62, 38, 0.1) 52%, transparent 80%)',
            }}
          />

          <div
            className="hero-light-streak absolute -top-[20%] left-[10%] h-[140%] w-[18%] -rotate-[28deg] opacity-25"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(243, 181, 74, 0.14) 50%, transparent 100%)',
            }}
          />
          <div
            className="hero-light-streak absolute -top-[22%] left-[44%] h-[145%] w-[24%] -rotate-[28deg] opacity-30"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(247, 201, 112, 0.16) 50%, transparent 100%)',
            }}
          />
          <div
            className="hero-light-streak absolute -top-[18%] right-[8%] h-[135%] w-[16%] -rotate-[28deg] opacity-20"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(243, 181, 74, 0.12) 50%, transparent 100%)',
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(245, 242, 235, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(245, 242, 235, 0.35) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, transparent 50%, rgba(2, 6, 4, 0.82) 100%)',
            }}
          />
        </div>
      </div>

      {/* ====================================================================
          MAIN HERO CONTENT STAGE
         ==================================================================== */}
      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1440px] flex-col justify-between px-5 pt-24 pb-10 sm:px-8 sm:pt-28 sm:pb-14 lg:px-14 lg:pt-28 lg:pb-16">
        {/* TOP: OVERSIZED "SAIVINOD KOTIPALLI" HEADING + ANIMATED "AWS DEVOPS ENGINEER" LOCKUP */}
        <div className="space-y-5 sm:space-y-6">
          <div className="hero-heading-parallax relative z-10 select-none">
            <h1
              aria-label={heroConfig.headingFull}
              className="font-display font-black uppercase tracking-[-0.045em] text-[#f5f2eb] leading-[0.88] text-[clamp(2.6rem,7.5vw,7.8rem)] flex flex-wrap items-baseline justify-start gap-x-[0.26em] gap-y-1"
            >
              {heroConfig.headingWords.map((word) => (
                <span
                  key={word}
                  className="inline-block overflow-hidden py-[0.04em]"
                >
                  <span className="hero-heading-word-inner inline-block will-change-transform">
                    {word}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          {/* PROMINENT ANIMATED "AWS DEVOPS ENGINEER" TITLE STAGE DIRECTLY BELOW NAME */}
          <div className="hero-role-parallax relative z-20 space-y-4">
            <div className="relative inline-flex flex-col">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Pulsing Golden Status Beacon */}
                <span
                  aria-hidden="true"
                  className="relative flex size-3.5 items-center justify-center"
                >
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#f3b54a] opacity-65" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-[#f3b54a] shadow-[0_0_12px_#f3b54a]" />
                </span>

                {/* Character-Animated "AWS DevOps Engineer" Display Subtitle */}
                <p className="hero-role-headline font-display text-[clamp(1.6rem,4.2vw,3.9rem)] font-extrabold tracking-[-0.03em] text-[#f3b54a] leading-[1.05]">
                  {heroConfig.role}
                </p>
              </div>

              {/* Animated Golden Accent Line with Traveling Light Sweep */}
              <div
                aria-hidden="true"
                className="hero-role-line relative mt-2.5 h-[2px] w-full overflow-hidden rounded-full bg-gradient-to-r from-[#f3b54a] via-[#f3b54a]/55 to-transparent"
              >
                <div className="hero-role-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#fff5d6] to-transparent" />
              </div>
            </div>

            {/* Animated Specialty Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {heroConfig.specialties.map((spec) => (
                <span
                  key={spec}
                  className="hero-specialty-pill inline-flex items-center gap-1.5 rounded-full border border-[#f3b54a]/30 bg-[#091c12]/80 px-3.5 py-1.5 font-mono text-[11px] sm:text-xs font-medium tracking-wider text-[#f5f2eb]/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f3b54a] hover:bg-[#f3b54a]/15 hover:text-[#ffe29a]"
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-[#f3b54a]"
                  />
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* OPTIONAL USER PORTRAIT SLOT (Only rendered if photos.heroPortrait is set in src/lib/content.ts) */}
        {photos.heroPortrait && (
          <div className="hero-stage-glow relative z-20 my-6 md:my-0 md:absolute md:bottom-0 md:left-[56%] md:-translate-x-1/2 w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[540px] mx-auto pointer-events-none">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <img
                src={photos.heroPortrait}
                alt={`${personalInfo.name} — ${heroConfig.role}`}
                width={896}
                height={1152}
                fetchPriority="high"
                decoding="async"
                className="size-full object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#030906] via-[#030906]/50 to-transparent"
              />
            </div>
          </div>
        )}

        {/* BOTTOM ROW: LOWER-LEFT DESCRIPTION & "VIEW MY WORK" CTA + RIGHT METADATA */}
        <div className="relative z-30 mt-auto flex flex-col justify-between gap-8 pt-10 md:flex-row md:items-end">
          {/* Lower-Left Introduction Cluster */}
          <div className="max-w-lg space-y-6">
            <div className="space-y-2.5">
              <p className="hero-intro-item font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#f3b54a]/90">
                {heroConfig.subRole}
              </p>

              <p className="hero-intro-item font-display text-[clamp(1.75rem,3.4vw,2.65rem)] font-bold leading-[1.12] tracking-[-0.025em] text-[#f5f2eb]">
                {heroConfig.descriptionLines.map((line, idx) => (
                  <span key={line} className="block">
                    {line}
                    {idx < heroConfig.descriptionLines.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </p>
            </div>

            {/* CTA: "View My Work" — Rounded Outlined Button with Small Circular Diagonal Arrow Icon */}
            <div className="hero-intro-item pt-1">
              <a
                href={heroConfig.ctaTarget}
                onClick={handleViewWorkClick}
                className="group inline-flex items-center gap-3.5 rounded-full border border-[#f3b54a]/65 bg-[#091810]/80 px-6 py-3.5 font-display text-sm sm:text-base font-semibold tracking-[-0.01em] text-[#f5f2eb] backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-[3px] hover:border-[#ffd984] hover:bg-[#f3b54a]/15 hover:shadow-[0_10px_28px_-6px_rgba(243,181,74,0.38)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd984]"
              >
                <span>{heroConfig.ctaLabel}</span>
                <span
                  aria-hidden="true"
                  className="inline-flex size-7 items-center justify-center rounded-full border border-[#f3b54a]/55 bg-[#f3b54a]/15 text-[#ffd984] transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:bg-[#f3b54a] group-hover:text-[#030906]"
                >
                  <svg
                    className="size-3.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12L12 4" />
                    <path d="M5.5 4H12V10.5" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* Lower-Right Subtle Highlights Strip */}
          <div className="hero-intro-item flex flex-wrap items-center gap-2.5 md:justify-end">
            {personalInfo.heroBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-[#f3b54a]/25 bg-[#08160e]/80 px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#f5f2eb]/90 backdrop-blur-md"
              >
                <span className="size-1.5 rounded-full bg-[#f3b54a]" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
