import { useEffect, useRef, useState, type FormEvent } from 'react';
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

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [mailtoOpened, setMailtoOpened] = useState(false);

  const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setMailtoOpened(false);

    const trimmedName = senderName.trim();
    const trimmedEmail = senderEmail.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setFormError('Please enter your name.');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!trimmedMessage) {
      setFormError('Please enter a short message.');
      return;
    }

    const finalSubject =
      subject.trim() || `Portfolio Inquiry from ${trimmedName}`;
    const bodyLines = [
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      '',
      trimmedMessage,
    ];
    const mailtoHref = `mailto:${personalInfo.email.address}?subject=${encodeURIComponent(
      finalSubject
    )}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    window.location.href = mailtoHref;
    setMailtoOpened(true);
  };

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
            'radial-gradient(circle at 50% 50%, var(--background) 24%, transparent 78%)',
        }}
        className="pointer-events-none absolute inset-0 z-[1]"
      />

      {/* Top Metadata Strip */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 pt-10 sm:px-8 sm:pt-12 lg:px-14">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          08 / Contact &amp; Availability · {personalInfo.location}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/85 px-3.5 py-1.5 font-mono text-xs text-foreground backdrop-blur-md">
          <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
          <span>{portfolioStatements.supportingMessage}</span>
        </span>
      </div>

      {/* Main Contact Stage + Accessible Mobile/Desktop Contact Form */}
      <div className="relative z-10 my-auto mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-8 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Headline + Direct Contact CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block font-mono text-xs uppercase tracking-[0.18em] text-primary">
              {personalInfo.extendedTitle}
            </span>

            <h2
              id="footer-heading"
              className="font-display text-[clamp(2.2rem,6vw,5.6rem)] font-black leading-[0.9] tracking-[-0.05em] text-foreground"
            >
              Let’s build reliable{' '}
              <span className="text-primary">cloud infrastructure.</span>
            </h2>

            <p className="max-w-xl font-sans text-base sm:text-lg font-medium text-muted-foreground">
              {portfolioStatements.supportingMessage} Reach out directly by
              email, phone, WhatsApp, or compose a message using the form.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.25}>
                <a
                  href={personalInfo.email.href}
                  className="group relative inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-7 py-4 text-primary-foreground shadow-xl transition-transform duration-300 hover:scale-[1.03]"
                >
                  <span className="font-display text-sm sm:text-base font-extrabold tracking-tight">
                    Email {personalInfo.email.address}
                  </span>
                  <span aria-hidden="true" className="font-mono text-xs">
                    ↗
                  </span>
                </a>
              </Magnetic>

              <a
                href={personalInfo.phone.href}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 font-mono text-xs sm:text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <span>Call {personalInfo.phone.display}</span>
              </a>
            </div>

            <p className="pt-2 font-mono text-xs text-muted-foreground">
              {portfolioStatements.closingLine}
            </p>
          </div>

          {/* Right Column: Keyboard- & Mobile-Friendly Contact Form (Honest mailto: composer) */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleContactSubmit}
              noValidate
              aria-label="Compose an email to Saivinod Kotipalli"
              className="rounded-3xl border border-border bg-card/90 p-5 sm:p-7 shadow-xl backdrop-blur-md space-y-4"
            >
              <div className="space-y-1">
                <h3 className="font-display text-xl font-extrabold tracking-[-0.025em] text-foreground">
                  Quick message composer
                </h3>
                <p className="font-sans text-xs text-muted-foreground">
                  Opens your default email client addressed to{' '}
                  <span className="font-mono text-foreground">
                    {personalInfo.email.address}
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="block font-mono text-xs font-semibold text-foreground"
                >
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  enterKeyHint="next"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g., Priya Sharma"
                  className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:border-primary scroll-mb-28"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-email"
                  className="block font-mono text-xs font-semibold text-foreground"
                >
                  Your Email *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  enterKeyHint="next"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:border-primary scroll-mb-28"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-subject"
                  className="block font-mono text-xs font-semibold text-foreground"
                >
                  Subject (Optional)
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  enterKeyHint="next"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="AWS / DevOps / SRE Opportunity"
                  className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:border-primary scroll-mb-28"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-xs font-semibold text-foreground"
                >
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={3}
                  enterKeyHint="send"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share role details, project requirements, or questions..."
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:border-primary scroll-mb-28"
                />
              </div>

              {formError && (
                <p
                  role="alert"
                  className="rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2 font-mono text-xs text-destructive"
                >
                  {formError}
                </p>
              )}

              {mailtoOpened && !formError && (
                <p
                  role="status"
                  className="rounded-xl border border-primary/35 bg-primary/10 px-3.5 py-2 font-mono text-xs text-foreground"
                >
                  Opening your email client with your pre-filled message to{' '}
                  {personalInfo.email.address}.
                </p>
              )}

              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-sm font-bold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Compose Email in Mail App</span>
                <span aria-hidden="true">↗</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Contact Links & Copyright Bar (All Touch Targets >= 48x48px) */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] border-t border-border/80 bg-background/85 px-4 py-6 backdrop-blur-md sm:px-8 lg:px-14">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {contactLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-4 py-2.5 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {item.label}: {item.value} {item.external ? '↗' : ''}
              </a>
            ))}

            <Link
              href="#resume"
              className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-4 py-2.5 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Resume
            </Link>

            {pdfAvailable && (
              <button
                type="button"
                onClick={downloadResumePdf}
                className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-4 py-2.5 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
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
