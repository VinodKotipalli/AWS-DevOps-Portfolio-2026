import { useRef, useState } from 'react';
import {
  education,
  experience,
  skillCategories,
  toolkit,
} from '../lib/content';
import { gsap, motionOk, ScrollTrigger, useGSAP } from '../lib/gsap';
import { Link } from '../lib/navigation';
import { downloadResumePdf, hasResumePdf } from '../lib/resume-pdf';

export function Experience() {
  const root = useRef<HTMLElement>(null);
  const [showAllBullets, setShowAllBullets] = useState(true);
  const [activeSkillCard, setActiveSkillCard] = useState<number | null>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section || !motionOk()) return;

      // Smooth fade-in and upward slide (y: 60, opacity: 0) as the Experience section enters the viewport
      gsap.from(section, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      // 1. Experience row animation: yPercent: 40 -> 0, opacity: 0 -> 1, duration: 1s, stagger: 0.1s, ease: expo.out, start: top 82%
      gsap.from('.job', {
        yPercent: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.jobs',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });

      // 2. Technical Skills Matrix Header + 3D Card Wave + Divider Line Draw + Cascading Skill Pills
      gsap.from('.skills-header-reveal', {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 84%',
          toggleActions: 'play none none reverse',
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll('.skill-group-card')
      );

      if (cards.length > 0) {
        gsap.set('.skills-grid', { perspective: 1100 });

        gsap.fromTo(
          cards,
          {
            y: 56,
            opacity: 0,
            scale: 0.94,
            rotateX: -10,
            transformOrigin: 'center top',
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 0.9,
            stagger: {
              each: 0.065,
              from: 'start',
            },
            ease: 'expo.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: '.skills-grid',
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        cards.forEach((card, cardIdx) => {
          const divider = card.querySelector<HTMLElement>('.skill-divider-fill');
          const chips = card.querySelectorAll<HTMLElement>('.skill-chip');

          if (divider) {
            gsap.fromTo(
              divider,
              { scaleX: 0, transformOrigin: 'left center' },
              {
                scaleX: 1,
                duration: 0.85,
                delay: (cardIdx % 3) * 0.08,
                ease: 'expo.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 88%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }

          if (chips.length > 0) {
            gsap.fromTo(
              chips,
              {
                y: 14,
                opacity: 0,
                scale: 0.86,
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.55,
                stagger: 0.028,
                delay: 0.12 + (cardIdx % 3) * 0.06,
                ease: 'back.out(1.6)',
                clearProps: 'transform',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 88%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }
        });
      }

      // 3. Toolkit Marquee: 42s seamless -50% loop + scroll direction reversal + velocity boost
      const track = section.querySelector<HTMLElement>('.marquee-track');
      if (track) {
        const loop = gsap.to(track, {
          xPercent: -50,
          duration: 42,
          ease: 'none',
          repeat: -1,
        });

        let direction = 1;
        ScrollTrigger.create({
          onUpdate: (self) => {
            const v = self.getVelocity();
            if (self.direction !== 0) {
              direction = self.direction === -1 ? -1 : 1;
            }
            const boost = 1 + Math.min(Math.abs(v) / 300, 4);
            gsap.to(loop, {
              timeScale: direction * boost,
              duration: 0.25,
              ease: 'power2.out',
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, {
                  timeScale: direction,
                  duration: 0.9,
                  ease: 'power2.out',
                });
              },
            });
          },
        });
      }

      return () => {
        ScrollTrigger.refresh();
      };
    },
    { scope: root }
  );

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !motionOk()) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--spot-x', `${x}px`);
    card.style.setProperty('--spot-y', `${y}px`);

    const rotateY = ((x / rect.width - 0.5) * 7).toFixed(2);
    const rotateX = ((0.5 - y / rect.height) * 7).toFixed(2);
    gsap.to(card, {
      rotateX: Number(rotateX),
      rotateY: Number(rotateY),
      y: -5,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleCardPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !motionOk()) return;
    const chips = e.currentTarget.querySelectorAll<HTMLElement>('.skill-chip');
    if (chips.length > 0) {
      gsap.fromTo(
        chips,
        { y: 0 },
        {
          y: -3,
          duration: 0.22,
          stagger: 0.018,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
          overwrite: 'auto',
        }
      );
    }
  };

  const handleCardPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !motionOk()) return;
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 0.55,
      ease: 'expo.out',
      overwrite: 'auto',
    });
  };

  const handleCardClick = (
    idx: number,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    setActiveSkillCard((prev) => (prev === idx ? null : idx));
    if (!motionOk()) return;
    const chips = e.currentTarget.querySelectorAll<HTMLElement>('.skill-chip');
    if (chips.length > 0) {
      gsap.fromTo(
        chips,
        { scale: 0.94 },
        {
          scale: 1,
          duration: 0.35,
          stagger: 0.02,
          ease: 'back.out(2)',
          overwrite: 'auto',
        }
      );
    }
  };

  const marqueeItems = [...toolkit, ...toolkit];
  const pdfAvailable = hasResumePdf();

  return (
    <section
      ref={root}
      id="experience"
      aria-labelledby="experience-heading"
      className="relative w-full py-28 md:py-40 border-t border-border overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        {/* ==================================================================
            PROFESSIONAL EXPERIENCE (Tata Consultancy Services)
           ================================================================== */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              04 / Professional Experience &amp; Education
            </span>
            <h2
              id="experience-heading"
              className="font-display text-[clamp(2.5rem,6.2vw,5.6rem)] font-black leading-[0.9] tracking-[-0.045em] text-foreground"
            >
              Experience.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#resume"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <span>Full Resume View</span>
              <span aria-hidden="true">→</span>
            </Link>
            {pdfAvailable && (
              <button
                type="button"
                onClick={downloadResumePdf}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
              >
                <span>Download PDF</span>
                <span aria-hidden="true">↓</span>
              </button>
            )}
          </div>
        </div>

        {/* TCS Experience Entry (All 10 Responsibilities & Deliverables Preserved) */}
        <div className="jobs divide-y divide-border border-y border-border">
          {experience.map((job) => {
            const displayedHighlights = showAllBullets
              ? job.highlights
              : job.highlights.slice(0, 5);

            return (
              <article
                key={`${job.company}-${job.role}`}
                className="job grid grid-cols-1 gap-8 py-12 lg:grid-cols-12"
              >
                {/* Role & Company */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {job.employmentType}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-foreground">
                    {job.role}
                  </h3>
                  <p className="font-display text-lg font-bold text-primary">
                    {job.company}
                  </p>
                  <div className="pt-2 font-mono text-xs sm:text-sm text-muted-foreground space-y-1">
                    <div className="font-semibold text-foreground/90">
                      {job.dates}
                    </div>
                    <div>{job.location}</div>
                  </div>
                </div>

                {/* All 10 Responsibilities and Deliverables */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Responsibilities &amp; Deliverables ({job.highlights.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAllBullets((v) => !v)}
                      aria-expanded={showAllBullets}
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-card px-4 py-2 font-mono text-xs font-semibold text-primary transition-colors hover:border-primary cursor-pointer"
                    >
                      {showAllBullets
                        ? 'Compact View (Top 5)'
                        : `Show All ${job.highlights.length} Points`}
                    </button>
                  </div>

                  <ol className="space-y-3.5 font-sans text-sm sm:text-[15px] leading-relaxed text-foreground/90">
                    {displayedHighlights.map((bullet, idx) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-card/45 p-4"
                      >
                        <span className="font-mono text-xs font-bold text-primary shrink-0 mt-0.5">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            );
          })}

          {/* Education Row */}
          {education.map((edu) => (
            <article
              key={edu.degree}
              className="job grid grid-cols-1 gap-8 py-10 lg:grid-cols-12 items-start"
            >
              <div className="lg:col-span-4 space-y-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Academic Background
                </span>
                <h3 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-foreground">
                  {edu.degree}
                </h3>
                <p className="font-sans text-base font-semibold text-primary">
                  {edu.institution}
                </p>
                <p className="font-sans text-sm text-muted-foreground">
                  {edu.university}
                </p>
              </div>

              <div className="lg:col-span-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card/50 p-6">
                <div className="space-y-1">
                  <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Duration &amp; Location
                  </div>
                  <div className="font-display text-lg font-bold text-foreground">
                    {edu.dates} · {edu.location}
                  </div>
                </div>

                <div className="rounded-2xl border border-primary/25 bg-primary/10 px-5 py-3 text-left sm:text-right">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-primary">
                    Percentage
                  </div>
                  <div className="font-display text-2xl font-black text-primary">
                    {edu.percentage}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ==================================================================
            ALL 11 TECHNICAL SKILL CATEGORIES
           ================================================================== */}
        <div id="skills" className="mt-24 pt-12">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="skills-header-reveal space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                05 / Technical Skills Matrix ({skillCategories.length} Categories)
              </span>
              <h3 className="font-display text-3xl sm:text-5xl font-black tracking-[-0.04em] text-foreground">
                Technical <span className="text-primary">skills.</span>
              </h3>
            </div>
            <p className="skills-header-reveal font-sans text-sm text-muted-foreground">
              Complete categorized breakdown across AWS, IaC, Containers,
              Observability, CI/CD, and SRE methodologies.
            </p>
          </div>

          <div className="skills-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category, idx) => {
              const isCardActive = activeSkillCard === idx;
              return (
                <div
                  key={category.group}
                  onPointerMove={handleCardPointerMove}
                  onPointerEnter={handleCardPointerEnter}
                  onPointerLeave={handleCardPointerLeave}
                  onClick={(e) => handleCardClick(idx, e)}
                  className={`skill-group-card group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 space-y-4 transition-colors duration-300 will-change-transform ${
                    isCardActive
                      ? 'border-primary/65 bg-card/90 shadow-[0_0_32px_-8px_rgba(240,88,122,0.3)]'
                      : 'border-border bg-card/65 hover:border-primary/50 hover:bg-card/85 hover:shadow-[0_18px_40px_-15px_rgba(240,88,122,0.22)]'
                  }`}
                >
                  {/* Cursor-Tracking Radial Spotlight & Top Shimmer Accent */}
                  <div
                    aria-hidden="true"
                    style={{
                      background:
                        'radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgba(240, 88, 122, 0.14), transparent 70%)',
                    }}
                    className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ${
                      isCardActive
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-8 top-0 z-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent transition-opacity duration-300 ${
                      isCardActive
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />

                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={`size-1.5 rounded-full transition-all duration-300 ${
                            isCardActive
                              ? 'bg-primary scale-125 shadow-[0_0_8px_var(--primary)]'
                              : 'bg-muted-foreground/50 group-hover:bg-primary group-hover:scale-125 group-hover:shadow-[0_0_8px_var(--primary)]'
                          }`}
                        />
                        <span
                          className={`transition-colors duration-300 ${
                            isCardActive
                              ? 'text-primary font-bold'
                              : 'group-hover:text-primary'
                          }`}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </span>
                      <span className="transition-colors duration-300 group-hover:text-foreground/85">
                        {category.items.length} skills
                      </span>
                    </div>
                    <h4 className="font-display text-xl font-extrabold tracking-[-0.025em] text-foreground transition-colors duration-300 group-hover:text-primary">
                      {category.group}
                    </h4>
                  </div>

                  <div className="relative z-10 space-y-3 pt-1">
                    {/* Animated Horizontal Divider Sweep */}
                    <div
                      aria-hidden="true"
                      className="relative h-px w-full overflow-hidden bg-border/45"
                    >
                      <div className="skill-divider-fill h-full w-full bg-gradient-to-r from-primary/70 via-border to-border/60" />
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {category.items.map((skill) => (
                        <span
                          key={skill}
                          className={`skill-chip inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/12 hover:text-primary ${
                            isCardActive
                              ? 'border-primary/40 bg-primary/10 text-foreground'
                              : 'border-border bg-background/80 text-foreground/90 group-hover:border-border/90'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Continuous Horizontal Velocity-Sensitive Toolkit Marquee */}
      <div className="mt-20 border-y border-border bg-card/50 py-6 overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-8 sm:gap-12 px-4 select-none">
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center gap-8 sm:gap-12"
            >
              <span className="font-display text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-foreground/90 whitespace-nowrap">
                {item}
              </span>
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full bg-primary shrink-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
