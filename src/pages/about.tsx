import { useRef } from 'react';
import {
  achievements,
  approachConfig,
  certifications,
  education,
  personalInfo,
  photos,
  portfolioStatements,
  skillCategories,
} from '../lib/content';
import { gsap, motionOk, SplitText, useGSAP } from '../lib/gsap';
import { Link } from '../lib/navigation';

export function AboutPage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section || !motionOk()) return;

      const split = new SplitText('.about-page-title', {
        type: 'chars',
        charsClass: 'char',
        mask: 'chars',
      });

      gsap.from(split.chars, {
        yPercent: 130,
        duration: 1.15,
        stagger: 0.025,
        ease: 'expo.out',
      });

      gsap.from('.about-reveal', {
        y: 45,
        opacity: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: 'expo.out',
        delay: 0.25,
      });

      return () => {
        split.revert();
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="mx-auto max-w-[1440px] px-5 pt-32 pb-28 sm:px-8 md:pt-40 lg:px-14"
    >
      {/* Hero Header */}
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {personalInfo.name} · {personalInfo.extendedTitle}
          </span>
          <h1 className="about-page-title font-display text-[clamp(2.8rem,7.8vw,6.8rem)] font-black leading-[0.88] tracking-[-0.05em] text-foreground">
            Engineered for scale.
          </h1>
          <p className="about-reveal max-w-2xl font-sans text-base sm:text-lg leading-relaxed text-muted-foreground">
            {personalInfo.professionalSummary}
          </p>

          <div className="about-reveal flex flex-wrap gap-2 pt-1">
            {approachConfig.highlightedAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1 font-mono text-xs font-semibold text-primary"
              >
                {area}
              </span>
            ))}
          </div>

          <div className="about-reveal flex flex-wrap gap-3 pt-3">
            <Link
              href="#resume"
              className="rounded-full bg-primary px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground"
            >
              View Full Resume →
            </Link>
            <Link
              href="#work"
              className="rounded-full border border-border bg-card px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-foreground"
            >
              All 5 Projects
            </Link>
          </div>
        </div>

        {/* Profile Summary Card / Optional Portrait */}
        <div className="about-reveal lg:col-span-5">
          {photos.aboutPortrait ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-border bg-card shadow-xl">
              <img
                src={photos.aboutPortrait}
                alt={personalInfo.name}
                className="size-full object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/65 px-3.5 py-1.5 font-mono text-[11px] text-white backdrop-blur-md">
                {personalInfo.location} · {personalInfo.employmentLocation}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between rounded-[28px] border border-border bg-card p-8 sm:p-10 shadow-xl space-y-8">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 font-mono text-xs font-semibold text-primary">
                  {personalInfo.role}
                </span>
                <h2 className="font-display text-3xl font-black tracking-[-0.035em] text-foreground">
                  {personalInfo.name}
                </h2>
                <p className="font-mono text-xs text-muted-foreground">
                  {personalInfo.location} · {personalInfo.employmentLocation} (TCS)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-border py-6">
                <div>
                  <div className="font-display text-2xl font-black text-primary">
                    2+ Years
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    Cloud &amp; SRE Experience
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl font-black text-primary">
                    99.9%
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    Uptime Target
                  </div>
                </div>
              </div>

              <div className="font-mono text-xs text-muted-foreground">
                Dual AWS-Certified · Solutions Architect &amp; CloudOps Engineer Associate
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Three Capability Columns */}
      <div className="mt-24 grid grid-cols-1 gap-8 border-t border-border pt-16 md:grid-cols-3">
        {approachConfig.capabilities.map((cap, idx) => (
          <article
            key={cap.title}
            className="about-reveal rounded-3xl border border-border bg-card/60 p-7 space-y-4"
          >
            <span className="font-mono text-xs text-primary">0{idx + 1}</span>
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-foreground">
              {cap.title}
            </h2>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              {cap.text}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {cap.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[11px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Overall Achievements */}
      <div className="mt-24 border-t border-border pt-16">
        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.035em] text-foreground mb-8">
          Key Achievements
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {achievements.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-border bg-card p-7 space-y-2"
            >
              <div className="font-display text-3xl font-black text-primary">
                {item.metric}
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                {item.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* All 11 Technical Skill Categories */}
      <div className="mt-24 border-t border-border pt-16">
        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.035em] text-foreground mb-8">
          Technical Skills ({skillCategories.length} Categories)
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((group) => (
            <div
              key={group.group}
              className="rounded-3xl border border-border bg-card/60 p-6 space-y-4"
            >
              <h3 className="font-display text-lg font-bold text-foreground">
                {group.group}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-foreground/85"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Certifications Summary */}
      <div className="mt-24 grid grid-cols-1 gap-8 border-t border-border pt-16 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-display text-3xl font-black tracking-[-0.035em] text-foreground">
            Education
          </h2>
          {education.map((edu) => (
            <div
              key={edu.degree}
              className="rounded-3xl border border-border bg-card p-7 space-y-2"
            >
              <div className="font-mono text-xs text-primary">{edu.dates}</div>
              <h3 className="font-display text-2xl font-extrabold text-foreground">
                {edu.degree}
              </h3>
              <p className="font-sans text-base font-semibold text-foreground/90">
                {edu.institution} · {edu.university}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {edu.location} · Percentage: {edu.percentage}
              </p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-display text-3xl font-black tracking-[-0.035em] text-foreground">
            Engineering Philosophy
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {portfolioStatements.pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-3xl border border-border bg-card/60 p-6 space-y-2"
              >
                <h3 className="font-display text-lg font-bold text-foreground">
                  {p.title}
                </h3>
                <p className="font-sans text-xs leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-muted-foreground pt-2">
            Active Certifications: {certifications.map((c) => c.code).join(' · ')}
          </p>
        </div>
      </div>
    </section>
  );
}
