import { useRef, type CSSProperties } from 'react';
import { ArchitectureStage } from '../components/architecture-stage';
import { featuredProjects, personalInfo, projects } from '../lib/content';
import {
  cinematic,
  gsap,
  motionOk,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from '../lib/gsap';
import { Link } from '../lib/navigation';
import { projectHash } from '../lib/routes';
import { splitChange } from '../lib/utils';

export function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section || !motionOk()) return;

      const chapters = gsap.utils.toArray<HTMLElement>('.work-chapter', section);
      const splits: SplitText[] = [];

      chapters.forEach((chapter, index) => {
        const title = chapter.querySelector('.chapter-title');
        if (!title) return;
        const split = new SplitText(title, {
          type: 'words,chars',
          charsClass: 'char',
          mask: 'chars',
        });
        splits.push(split);

        if (index === 0 && cinematic()) return;
        const release = splitChange(split.chars);
        gsap.from(split.chars, {
          yPercent: 140,
          duration: 1,
          stagger: 0.02,
          ease: 'expo.out',
          onComplete: release,
          scrollTrigger: {
            trigger: chapter,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      if (cinematic()) {
        const intro = section.querySelector<HTMLElement>('.work-intro');
        const veil = section.querySelector<HTMLElement>('.work-veil');
        const dot = section.querySelector<HTMLElement>('.work-dot');

        // Circular Iris Reveal from the Raspberry Period
        if (intro && veil && dot) {
          const placeDot = () => {
            const rect = intro.getBoundingClientRect();
            const dotRect = dot.getBoundingClientRect();
            const cx = dotRect.left - rect.left + dotRect.width / 2;
            const cy = dotRect.top - rect.top + dotRect.height / 2;
            const maxR = Math.hypot(
              Math.max(cx, rect.width - cx),
              Math.max(cy, rect.height - cy)
            );
            veil.style.setProperty('--dot-x', `${cx}px`);
            veil.style.setProperty('--dot-y', `${cy}px`);
            return { maxR };
          };

          placeDot();
          const state = { r: 0 };

          const iris = gsap.timeline({
            scrollTrigger: {
              trigger: intro,
              start: 'top top',
              end: () => `+=${Math.round(window.innerHeight * 0.95)}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () => {
                placeDot();
                veil.style.setProperty('--iris-r', `${state.r}px`);
              },
            },
          });

          iris
            .to(
              state,
              {
                r: () => placeDot().maxR,
                ease: 'power2.in',
                onUpdate: () => {
                  veil.style.setProperty('--iris-r', `${state.r}px`);
                },
              },
              0
            )
            .to(
              '.work-intro-copy',
              {
                scale: 1.16,
                opacity: 0,
                ease: 'power2.in',
              },
              0
            );
        }

        // Three Full-Screen Stacking Project Panels
        chapters.forEach((chapter, index) => {
          const next = chapters[index + 1];
          const inner = chapter.querySelector<HTMLElement>('.chapter-surface');
          const shade = chapter.querySelector<HTMLElement>('.chapter-shade');
          const art = chapter.querySelector<HTMLElement>('.chapter-art');

          if (art && index > 0) {
            gsap.fromTo(
              art,
              { yPercent: 14, rotate: -3 },
              {
                yPercent: 0,
                rotate: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top bottom',
                  end: 'top top',
                  scrub: true,
                },
              }
            );
          }

          if (!next || !inner) return;

          const stack = gsap.timeline({
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          });

          stack.to(
            inner,
            {
              scale: 0.9,
              borderRadius: 28,
              ease: 'none',
            },
            0
          );

          if (shade) {
            stack.to(
              shade,
              {
                opacity: 0.45,
                ease: 'none',
              },
              0
            );
          }
        });
      }

      return () => {
        splits.forEach((s) => s.revert());
        ScrollTrigger.refresh();
      };
    },
    { scope: root }
  );

  const firstProject = featuredProjects[0];

  return (
    <section
      ref={root}
      id="selected-work"
      aria-label="Selected Projects"
      className="relative w-full"
    >
      {/* Anchor alias for #projects */}
      <div id="projects" className="absolute top-0" />

      {/* ====================================================================
          SECTION 4: "Selected work." TITLE & CIRCULAR IRIS REVEAL
         ==================================================================== */}
      <div className="work-intro relative flex h-svh min-h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-background px-5 text-center">
        <div className="work-intro-copy relative z-10 flex flex-col items-center">
          <span className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            02 / Cloud &amp; DevOps Architecture Projects
          </span>

          <h2 className="font-display text-[clamp(3.75rem,15.5vw,17rem)] font-black leading-[0.82] tracking-[-0.055em] text-foreground select-none">
            <span className="block">Selected</span>
            <span className="inline-flex items-baseline">
              <span>work</span>
              <span
                aria-hidden="true"
                className="work-dot ml-1.5 sm:ml-3 inline-block size-[0.16em] rounded-full bg-primary align-baseline"
              />
            </span>
          </h2>

          <p className="mt-8 max-w-lg font-sans text-sm sm:text-base leading-relaxed text-muted-foreground">
            Five hands-on AWS, Terraform, Amazon EKS, GitHub Actions CI/CD, and
            Prometheus &amp; Grafana engineering projects.
          </p>
        </div>

        {/* Circular Iris Veil revealing Panel 01 */}
        <div
          aria-hidden="true"
          style={
            {
              '--iris-r': '0px',
              backgroundColor: firstProject?.color ?? '#b52845',
              color: firstProject?.ink ?? '#f0e7e6',
            } as CSSProperties
          }
          className="work-veil pointer-events-none absolute inset-0 z-20 hidden md:flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-3 opacity-85 px-4 text-center">
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              Project 01 · {firstProject?.category}
            </span>
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              {firstProject?.name}
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 5: THREE FULL-SCREEN STACKING PROJECT PANELS (PROJECTS 1–3)
         ==================================================================== */}
      <div className="chapter-stack relative w-full">
        {featuredProjects.map((project, index) => (
          <article
            key={project.id}
            style={{ zIndex: index + 1 }}
            className="work-chapter md:sticky md:top-0 min-h-svh w-full"
          >
            <div
              style={{
                backgroundColor: project.color,
                color: project.ink,
              }}
              className="chapter-surface relative flex min-h-svh w-full flex-col justify-between overflow-hidden px-5 py-10 sm:px-8 sm:py-12 md:px-12 lg:px-16 transition-shadow"
            >
              {/* Outgoing Shade Overlay */}
              <div
                aria-hidden="true"
                className="chapter-shade pointer-events-none absolute inset-0 z-30 bg-black opacity-0"
              />

              {/* Top Metadata Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-current/15 pb-5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-widest">
                    {project.indexNumber} / 0{projects.length}
                  </span>
                  <span className="h-3.5 w-px bg-current/25" />
                  <span className="font-mono text-xs uppercase tracking-[0.14em] opacity-85">
                    {project.category}
                  </span>
                </div>

                <span className="rounded-full border border-current/25 px-3 py-1 font-mono text-[11px] uppercase tracking-wider opacity-90">
                  {project.scope}
                </span>
              </div>

              {/* Center Split Grid */}
              <div className="relative z-10 my-auto grid grid-cols-1 items-center gap-10 py-8 lg:grid-cols-12 lg:gap-12">
                {/* Left Column */}
                <div className="lg:col-span-6 space-y-5">
                  <h3 className="chapter-title font-display text-[clamp(2.1rem,4.4vw,4.4rem)] font-black leading-[0.94] tracking-[-0.04em]">
                    {project.name}
                  </h3>

                  <p className="font-display text-base sm:text-xl font-bold leading-snug opacity-95">
                    {project.subtitle}
                  </p>

                  <p className="max-w-xl font-sans text-sm sm:text-[15px] leading-relaxed opacity-85">
                    {project.description}
                  </p>

                  {/* Key Implementation Highlights */}
                  <ul className="space-y-2 pt-1 font-sans text-xs sm:text-sm opacity-90">
                    {project.implementationDetails.slice(0, 3).map((detail) => (
                      <li key={detail} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current"
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions: View Case Study + GitHub Profile (hide repositoryUrl/demoUrl when unset) */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href={projectHash(project.id)}
                      data-cursor="View Case Study"
                      style={{
                        backgroundColor: project.ink,
                        color: project.color,
                      }}
                      className="inline-flex items-center gap-3 rounded-full px-6 py-3 font-display text-sm font-bold tracking-[-0.01em] shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <span>View Case Study</span>
                      <span aria-hidden="true">→</span>
                    </Link>

                    {project.repositoryUrl ? (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-current/30 px-5 py-3 font-display text-xs font-bold uppercase tracking-wider hover:bg-black/10"
                      >
                        <span>Repository ↗</span>
                      </a>
                    ) : (
                      <a
                        href={personalInfo.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-current/30 px-5 py-3 font-display text-xs font-bold uppercase tracking-wider transition-colors hover:bg-black/15"
                      >
                        <span>GitHub Profile ↗</span>
                      </a>
                    )}

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-current/30 px-5 py-3 font-display text-xs font-bold uppercase tracking-wider hover:bg-black/10"
                      >
                        <span>Live Demo ↗</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column: Illustrative Architecture Visual Stage */}
                <div className="lg:col-span-6">
                  <Link
                    href={projectHash(project.id)}
                    data-cursor="View Case Study"
                    className="chapter-art block aspect-[16/11] w-full rounded-[24px] sm:rounded-[30px] p-1.5 sm:p-2 bg-black/20 border border-current/20 shadow-2xl transition-transform duration-500 hover:scale-[1.015]"
                  >
                    <ArchitectureStage projectId={project.id} />
                  </Link>
                </div>
              </div>

              {/* Bottom Technology Pills */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-current/15 pt-5">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-current/25 px-3 py-1 font-mono text-[11px] font-medium opacity-90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-xs opacity-75">
                  Project {project.indexNumber} of 0{projects.length}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
