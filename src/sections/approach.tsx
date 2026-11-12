import { useRef } from 'react';
import { achievements, approachConfig } from '../lib/content';
import {
  gsap,
  motionOk,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from '../lib/gsap';

export function Approach() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section || !motionOk()) return;

      // 0. Reveal next section with a short fade and upward movement as visitor scrolls past the hero
      gsap.from(section, {
        y: 32,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });

      // 1. Word-by-word scroll reveal: start each word at opacity: 0.14 -> 1
      const split = new SplitText(section.querySelectorAll('.approach-word-span'), {
        type: 'words',
        wordsClass: 'word',
      });

      gsap.set(split.words, { opacity: 0.14 });
      gsap.to(split.words, {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.approach-statement',
          start: 'top 82%',
          end: 'bottom 58%',
          scrub: 0.6,
        },
      });

      // 2. Three capability columns: y: 60 -> 0, opacity: 0 -> 1, duration: 1, stagger: 0.12, ease: expo.out, start: top 80%
      gsap.from('.approach-pillar', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.approach-pillars',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // 4. Overall professional achievements cards
      gsap.from('.achievement-card', {
        y: 45,
        opacity: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.achievements-grid',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });

      return () => {
        split.revert();
        ScrollTrigger.refresh();
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="my-approach"
      aria-labelledby="approach-heading"
      className="relative mx-auto max-w-[1440px] px-5 py-28 sm:px-8 md:py-40 lg:px-14"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <span
          id="approach-heading"
          className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          01 / Professional Summary &amp; Core Focus
        </span>
        <span className="rounded-full border border-border px-3.5 py-1 font-mono text-[11px] text-muted-foreground">
          Srikakulam, AP · Hyderabad (TCS)
        </span>
      </div>

      {/* Large Multiline Professional Summary Statement */}
      <p className="approach-statement font-display text-[clamp(1.75rem,3.8vw,3.85rem)] font-extrabold leading-[1.1] tracking-[-0.035em] text-foreground">
        <span className="approach-word-span">
          {approachConfig.statementBeforeChip} {approachConfig.statementAfterChip}
        </span>
      </p>

      {/* Highlighted Focus Areas */}
      <div className="mt-10 flex flex-wrap items-center gap-2.5">
        {approachConfig.highlightedAreas.map((area) => (
          <span
            key={area}
            className="rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 font-mono text-xs font-semibold text-primary"
          >
            {area}
          </span>
        ))}
      </div>

      {/* Three Capability Columns: Infrastructure & Automation | Delivery & Orchestration | Observability & Reliability */}
      <div className="approach-pillars mt-20 md:mt-24 grid grid-cols-1 gap-8 border-t border-border pt-12 md:grid-cols-3 md:gap-10">
        {approachConfig.capabilities.map((cap, idx) => (
          <article
            key={cap.title}
            className="approach-pillar flex flex-col justify-between space-y-6 rounded-3xl border border-border/80 bg-card/50 p-7 sm:p-8"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span>0{idx + 1}</span>
                <span className="text-primary">Capability Pillar</span>
              </div>
              <h3 className="font-display text-2xl sm:text-[1.7rem] font-extrabold tracking-[-0.03em] text-foreground">
                {cap.title}
              </h3>
              <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
                {cap.text}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60">
              {cap.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-border bg-background/70 px-3 py-1 font-mono text-[11px] font-medium text-foreground/85"
                >
                  {tool}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Overall Professional Achievements (Kept distinct from individual personal projects) */}
      <div className="mt-16 pt-12 border-t border-border">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Key Professional Achievements
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            Overall Engineering Impact
          </span>
        </div>

        <div className="achievements-grid grid grid-cols-1 gap-6 md:grid-cols-3">
          {achievements.map((item) => (
            <div
              key={item.title}
              className="achievement-card rounded-3xl border border-border bg-card p-7 space-y-3 shadow-xs"
            >
              <div className="font-display text-3xl sm:text-4xl font-black tracking-[-0.04em] text-primary">
                {item.metric}
              </div>
              <h4 className="font-display text-lg font-extrabold text-foreground">
                {item.title}
              </h4>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
