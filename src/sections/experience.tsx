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

      // 2. Categorized skills cards entrance
      gsap.from('.skill-group-card', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.05,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });

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
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                05 / Technical Skills Matrix ({skillCategories.length} Categories)
              </span>
              <h3 className="font-display text-3xl sm:text-5xl font-black tracking-[-0.04em] text-foreground">
                Technical <span className="text-primary">skills.</span>
              </h3>
            </div>
            <p className="font-sans text-sm text-muted-foreground">
              Complete categorized breakdown across AWS, IaC, Containers,
              Observability, CI/CD, and SRE methodologies.
            </p>
          </div>

          <div className="skills-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category, idx) => (
              <div
                key={category.group}
                className="skill-group-card flex flex-col justify-between rounded-3xl border border-border bg-card/65 p-6 space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                    <span>{category.items.length} skills</span>
                  </div>
                  <h4 className="font-display text-xl font-extrabold tracking-[-0.025em] text-foreground">
                    {category.group}
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                  {category.items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-xs font-medium text-foreground/90"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
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
