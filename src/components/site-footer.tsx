import { useEffect, useRef } from 'react';
import {
  contactLinks,
  personalInfo,
  portfolioStatements,
} from '../lib/content';
import { gsap, motionOk } from '../lib/gsap';
import { Link } from '../lib/navigation';
import { downloadResumePdf, hasResumePdf } from '../lib/resume-pdf';
import { Magnetic } from './magnetic';

const VORTEX_PHRASE = portfolioStatements.vortexPhrase;

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const canvas = canvasRef.current;
    if (!footer || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let inView = false;
    let initialized = false;
    let staticFallback = !motionOk();
    let settleTimer: number | undefined;
    let width = 0;
    let height = 0;

    let slowFrames = 0;
    let lastTime = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const renderVortex = (angleOffset: number) => {
      if (!width || !height) resize();
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const inkRgb = isDark ? '238, 238, 236' : '17, 19, 21';

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.hypot(cx, cy) * 1.05;
      const minRadius = Math.min(width, height) * 0.2;
      const ringStep = Math.max(46, Math.min(width, height) * 0.075);

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let ringIndex = 0;
      for (let radius = minRadius; radius <= maxRadius; radius += ringStep) {
        const dir = ringIndex % 2 === 0 ? 1 : -1;
        const fontSize = Math.max(11, Math.min(18, radius * 0.048));
        ctx.font = `700 ${fontSize}px "Bricolage Grotesque Variable", sans-serif`;

        const circumference = 2 * Math.PI * radius;
        const charAdvance = fontSize * 0.68;
        const totalSlots = Math.max(12, Math.floor(circumference / charAdvance));
        const stepAngle = (Math.PI * 2) / totalSlots;
        const ringAlpha = Math.min(0.16, 0.05 + (radius / maxRadius) * 0.11);
        ctx.fillStyle = `rgba(${inkRgb}, ${ringAlpha.toFixed(3)})`;

        const baseRotation = angleOffset * dir * (0.35 + ringIndex * 0.04);

        for (let i = 0; i < totalSlots; i++) {
          const ch = VORTEX_PHRASE[i % VORTEX_PHRASE.length];
          if (ch === ' ') continue;
          const theta = i * stepAngle + baseRotation;
          const x = cx + Math.cos(theta) * radius;
          const y = cy + Math.sin(theta) * radius;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(theta + Math.PI / 2);
          ctx.fillText(ch, 0, 0);
          ctx.restore();
        }
        ringIndex++;
      }

      ctx.restore();
    };

    const loop = (now: number) => {
      if (!inView || document.hidden) return;

      if (lastTime > 0) {
        const dt = now - lastTime;
        if (dt > 20) {
          slowFrames++;
        } else {
          slowFrames = Math.max(0, slowFrames - 1);
        }
        if (slowFrames > 28) {
          staticFallback = true;
          renderVortex(now * 0.00018);
          return;
        }
      }
      lastTime = now;

      renderVortex(now * 0.00018);
      if (!staticFallback) {
        raf = requestAnimationFrame(loop);
      }
    };

    const startVortexWhenSettled = () => {
      if (!inView) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (!inView) return;
        if (!initialized) {
          initialized = true;
          resize();
          renderVortex(0);
          gsap.fromTo(
            canvas,
            { opacity: 0 },
            { opacity: 1, duration: 1.2, ease: 'power2.out' }
          );
        }
        if (!staticFallback && motionOk()) {
          cancelAnimationFrame(raf);
          lastTime = 0;
          raf = requestAnimationFrame(loop);
        }
      }, 250);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        inView = Boolean(entry?.isIntersecting);
        if (inView) {
          startVortexWhenSettled();
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(footer);

    const onScroll = () => {
      if (inView && !initialized) {
        startVortexWhenSettled();
      }
    };

    const onResize = () => {
      resize();
      if (initialized) renderVortex(0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(settleTimer);
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const pdfAvailable = hasResumePdf();

  return (
    <footer
      ref={footerRef}
      id="contact"
      aria-labelledby="footer-heading"
      className="relative min-h-svh w-full overflow-hidden border-t border-border bg-background text-foreground flex flex-col justify-between"
    >
      {/* Background Rotating Concentric Text Vortex Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 size-full opacity-0"
      />

      {/* Radial Fade Overlay keeping the center crisp and readable */}
      <div
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--background) 22%, transparent 76%)',
        }}
        className="pointer-events-none absolute inset-0 z-[1]"
      />

      {/* Top Metadata Strip */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 pt-12 sm:px-8 lg:px-14">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          08 / Contact &amp; Availability · {personalInfo.location}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/85 px-3.5 py-1.5 font-mono text-xs text-foreground backdrop-blur-md">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span>{portfolioStatements.supportingMessage}</span>
        </span>
      </div>

      {/* Center Contact Stage + Circular Magnetic Raspberry Button */}
      <div className="relative z-10 my-auto mx-auto flex max-w-4xl flex-col items-center px-5 py-16 text-center">
        <span className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-primary">
          {personalInfo.extendedTitle}
        </span>

        <h2
          id="footer-heading"
          className="font-display text-[clamp(2.5rem,7.2vw,6.4rem)] font-black leading-[0.9] tracking-[-0.05em] text-foreground"
        >
          Let’s build reliable{' '}
          <span className="text-primary">cloud infrastructure.</span>
        </h2>

        <p className="mt-5 max-w-lg font-sans text-base sm:text-lg font-medium text-muted-foreground">
          {portfolioStatements.supportingMessage}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Magnetic strength={0.3}>
            <a
              href={personalInfo.email.href}
              className="group relative flex size-36 sm:size-44 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <span className="font-display text-base sm:text-lg font-extrabold tracking-tight">
                Email Me
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-widest opacity-85">
                Direct Mail ↗
              </span>
            </a>
          </Magnetic>
        </div>

        <p className="mt-8 font-mono text-xs text-muted-foreground">
          {portfolioStatements.closingLine}
        </p>
      </div>

      {/* Bottom Contact Links & Copyright Bar */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] border-t border-border/80 bg-background/80 px-5 py-7 backdrop-blur-md sm:px-8 lg:px-14">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {contactLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                className="rounded-full border border-border bg-card px-4 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {item.label}: {item.value} {item.external ? '↗' : ''}
              </a>
            ))}

            <Link
              href="#resume"
              className="rounded-full border border-border bg-card px-4 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Resume
            </Link>

            {pdfAvailable && (
              <button
                type="button"
                onClick={downloadResumePdf}
                className="rounded-full border border-border bg-card px-4 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
              >
                Download PDF ↓
              </button>
            )}
          </div>

          <div className="font-mono text-xs text-muted-foreground shrink-0">
            © {new Date().getFullYear()} Saivinod Kotipalli | AWS DevOps Engineer
          </div>
        </div>
      </div>
    </footer>
  );
}
