import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  certifications,
  portfolioStatements,
} from '../lib/content';
import {
  gsap,
  motionOk,
  prefersReducedMotion,
  ScrollTrigger,
  useGSAP,
} from '../lib/gsap';

export function Beyond() {
  const root = useRef<HTMLElement>(null);
  const certsGridRef = useRef<HTMLDivElement>(null);
  const refreshTimerRef = useRef<number | undefined>(undefined);

  const [expandedCodes, setExpandedCodes] = useState<Record<string, boolean>>({
    'SOA-C02': true,
  });
  const [revealMode, setRevealMode] = useState<'animate' | 'instant'>(() => {
    if (
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined' ||
      prefersReducedMotion()
    ) {
      return 'instant';
    }
    return 'animate';
  });
  const [revealedDelays, setRevealedDelays] = useState<Record<string, number>>(
    {}
  );

  // Sync with live changes to prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      if (mq.matches) {
        setRevealMode('instant');
      }
    };
    mq.addEventListener?.('change', onChange);
    return () => {
      mq.removeEventListener?.('change', onChange);
      window.clearTimeout(refreshTimerRef.current);
    };
  }, []);

  // Scroll reveal for certifications using IntersectionObserver (~15% visibility, play once)
  useEffect(() => {
    if (revealMode !== 'animate') return;
    const grid = certsGridRef.current;
    if (!grid || typeof IntersectionObserver === 'undefined') {
      setRevealMode('instant');
      return;
    }

    const slots = Array.from(
      grid.querySelectorAll<HTMLElement>('.cert-reveal-slot')
    );
    if (slots.length === 0) return;

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          const newlyVisible = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) =>
                Number((a.target as HTMLElement).dataset.certIndex ?? 0) -
                Number((b.target as HTMLElement).dataset.certIndex ?? 0)
            );

          if (newlyVisible.length === 0) return;

          setRevealedDelays((prev) => {
            let changed = false;
            const next = { ...prev };
            newlyVisible.forEach((entry, batchIdx) => {
              const code = (entry.target as HTMLElement).dataset.certCode;
              if (code && !(code in next)) {
                next[code] = Math.min(batchIdx * 65, 300);
                changed = true;
              }
              observer.unobserve(entry.target);
            });
            return changed ? next : prev;
          });
        },
        { threshold: 0.15 }
      );

      slots.forEach((slot) => observer.observe(slot));

      return () => {
        observer.disconnect();
      };
    } catch {
      setRevealMode('instant');
    }
  }, [revealMode]);

  useGSAP(
    () => {
      const section = root.current;
      if (!section || !motionOk()) return;

      // Portfolio vision statements entrance
      gsap.from('.interest', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.interests',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      return () => {
        ScrollTrigger.refresh();
      };
    },
    { scope: root }
  );

  const handleToggleDetails = (code: string) => {
    setExpandedCodes((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));

    window.clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 320);
  };

  return (
    <section
      ref={root}
      id="certifications"
      aria-labelledby="certifications-heading"
      className="relative mx-auto max-w-[1440px] px-5 py-28 sm:px-8 md:py-40 lg:px-14 border-t border-border"
    >
      {/* ====================================================================
          ALL NINE SUPPLIED CERTIFICATIONS (Expandable Descriptions & Skill Tags)
         ==================================================================== */}
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            06 / Verified Cloud, DevOps &amp; AI Credentials ({certifications.length})
          </span>
          <h2
            id="certifications-heading"
            className="font-display text-[clamp(2.5rem,6.2vw,5.6rem)] font-black leading-[0.9] tracking-[-0.045em] text-foreground"
          >
            Certifications.
          </h2>
        </div>

        <p className="max-w-md font-sans text-sm sm:text-base text-muted-foreground">
          Nine credentials across Amazon Web Services, Microsoft Azure, GitHub,
          and Anthropic Claude. Click any credential to inspect skills and
          coverage.
        </p>
      </div>

      <div
        ref={certsGridRef}
        data-reveal-mode={revealMode}
        className="certs-grid grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {certifications.map((cert, index) => {
          const isExpanded = Boolean(expandedCodes[cert.code]);
          const isRevealed =
            revealMode === 'instant' || cert.code in revealedDelays;
          const delayMs =
            revealMode === 'instant' ? 0 : (revealedDelays[cert.code] ?? 0);
          const panelId = `cert-details-${cert.code
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')}`;

          return (
            <div
              key={cert.code}
              data-cert-code={cert.code}
              data-cert-index={index}
              data-revealed={isRevealed ? 'true' : 'false'}
              style={{ '--cert-delay': `${delayMs}ms` } as CSSProperties}
              className="cert-reveal-slot"
            >
              <article
                data-expanded={isExpanded ? 'true' : 'false'}
                className={`cert-card flex flex-col justify-between rounded-3xl border p-6 ${
                  isExpanded
                    ? 'border-primary/50 bg-card shadow-md'
                    : 'border-border bg-card/55'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
                      {cert.code}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {cert.issuer}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-extrabold leading-snug tracking-[-0.025em] text-foreground">
                    {cert.name}
                  </h3>

                  <div className="font-mono text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>Issued: {cert.issued}</span>
                    {cert.expires && (
                      <>
                        <span>·</span>
                        <span>Expires: {cert.expires}</span>
                      </>
                    )}
                  </div>

                  <div className="cert-skills-list flex flex-wrap gap-1.5 pt-1">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-background/80 px-2.5 py-0.5 font-mono text-[11px] text-foreground/85"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  id={panelId}
                  data-expanded={isExpanded ? 'true' : 'false'}
                  aria-hidden={!isExpanded}
                  inert={!isExpanded}
                  className="cert-details"
                >
                  <div className="cert-details-inner">
                    <div className="pt-4">
                      <p className="pt-3 border-t border-border/70 font-sans text-sm leading-relaxed text-muted-foreground">
                        {cert.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Credential {cert.index}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleDetails(cert.code)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    className="cert-toggle-btn inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-background px-4 py-2 font-mono text-xs font-semibold text-primary cursor-pointer"
                  >
                    {isExpanded ? 'Hide details −' : 'View details +'}
                  </button>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {/* ====================================================================
          07 / ENGINEERING PHILOSOPHY — FULL-WIDTH 4-COLUMN VISION GRID
         ==================================================================== */}
      <div id="beyond-work" className="mt-28 pt-20 border-t border-border">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              07 / Engineering Philosophy
            </span>
            <h3 className="font-display text-[clamp(2.2rem,5.2vw,4.8rem)] font-black leading-[0.9] tracking-[-0.045em] text-foreground">
              Architecting the <span className="text-primary">cloud of tomorrow.</span>
            </h3>
          </div>

          <div className="space-y-2 md:text-right">
            <p className="max-w-md font-sans text-sm sm:text-base text-muted-foreground">
              {portfolioStatements.closingLine}
            </p>
            <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-border bg-card/80 px-4 py-2 font-mono text-[11px] text-muted-foreground">
              <span>Engineered for scale · Built for the future</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-primary">
                99.9% Uptime Target
              </span>
            </div>
          </div>
        </div>

        {/* Full-Width Balanced 4-Card Grid (1 col phone -> 2 col tablet -> 4 col desktop) */}
        <div className="interests grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {portfolioStatements.pillars.map((pillar, idx) => (
            <article
              key={pillar.title}
              className="interest flex flex-col justify-between rounded-3xl border border-border bg-card/60 p-6 sm:p-7 space-y-4 transition-colors hover:border-primary/40"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                  <span>0{idx + 1}</span>
                  <span className="text-primary">Principle</span>
                </div>
                <h4 className="font-display text-xl sm:text-2xl font-extrabold tracking-[-0.025em] text-foreground">
                  {pillar.title}
                </h4>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  {pillar.text}
                </p>
              </div>
            </article>
          ))}

          <article className="interest flex flex-col justify-between rounded-3xl border border-primary/30 bg-primary/8 p-6 sm:p-7 space-y-4 transition-colors hover:border-primary/60">
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-xs text-primary">
                <span>04</span>
                <span>Mission</span>
              </div>
              <h4 className="font-display text-xl sm:text-2xl font-extrabold tracking-[-0.025em] text-foreground">
                Resilient Automation
              </h4>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                Turning bold visions into resilient, automated systems.{' '}
                {portfolioStatements.closingLine}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
