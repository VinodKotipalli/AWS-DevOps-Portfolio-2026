import { useRef, useState } from 'react';
import { ArchitectureStage } from '../components/architecture-stage';
import { ProjectDialog } from '../components/project-dialog';
import {
  featuredProjects,
  personalInfo,
  projects,
  type ProjectConfig,
} from '../lib/content';
import {
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
  const [selectedProject, setSelectedProject] = useState<ProjectConfig | null>(
    null
  );
  const [dialogTrigger, setDialogTrigger] = useState<HTMLElement | null>(null);

  const openQuickView = (project: ProjectConfig, el: HTMLElement | null) => {
    setDialogTrigger(el);
    setSelectedProject(project);
  };

  useGSAP(
    () => {
      const section = root.current;
      if (!section || !motionOk()) return;

      // Smooth fade-in and upward slide (y: 60, opacity: 0) as the Projects section enters the viewport
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

      const isDesktopAperture =
        typeof window !== 'undefined' &&
        window.matchMedia(
          '(min-width: 768px) and (min-height: 540px) and (prefers-reduced-motion: no-preference)'
        ).matches;

      section.dataset.cinematic = isDesktopAperture ? 'true' : 'false';

      const splits: SplitText[] = [];

      // ======================================================================
      // 1. "Selected work." Entrance Animation (Before entering projects)
      // ======================================================================
      const introVeil = section.querySelector<HTMLElement>('.work-veil');
      const introEyebrow = section.querySelector<HTMLElement>(
        '.work-intro-eyebrow'
      );
      const introWords = section.querySelectorAll<HTMLElement>(
        '.work-heading-word'
      );
      const introDot = section.querySelector<HTMLElement>('.work-dot');
      const introDotRing = section.querySelector<HTMLElement>('.work-dot-ring');
      const introDesc = section.querySelector<HTMLElement>('.work-intro-desc');

      if (introVeil && introWords.length) {
        const headingSplit = new SplitText(introWords, {
          type: 'chars',
          charsClass: 'work-char inline-block',
          mask: 'chars',
        });
        splits.push(headingSplit);

        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: introVeil,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        });

        if (introEyebrow) {
          introTl.fromTo(
            introEyebrow,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' },
            0
          );
        }

        if (headingSplit.chars.length) {
          introTl.fromTo(
            headingSplit.chars,
            { yPercent: 125, rotateZ: 4, opacity: 0 },
            {
              yPercent: 0,
              rotateZ: 0,
              opacity: 1,
              duration: 0.95,
              stagger: 0.028,
              ease: 'expo.out',
            },
            0.08
          );
        }

        if (introDot) {
          introTl.fromTo(
            introDot,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.7,
              ease: 'back.out(2.4)',
            },
            0.42
          );
        }

        if (introDesc) {
          introTl.fromTo(
            introDesc,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
            0.36
          );
        }

        // Continuous subtle pulse on the raspberry period dot
        if (introDotRing) {
          gsap.fromTo(
            introDotRing,
            { scale: 0.9, opacity: 0.75 },
            {
              scale: 2.15,
              opacity: 0,
              duration: 1.9,
              ease: 'power2.out',
              repeat: -1,
            }
          );
        }
      }

      // ======================================================================
      // 2. Zero-Gap Circular Aperture Reveal from the Raspberry Dot into Project 01
      // ======================================================================
      const chapters = gsap.utils.toArray<HTMLElement>('.work-chapter', section);
      const firstChapter = chapters[0];

      if (isDesktopAperture && introVeil && introDot && firstChapter) {
        const placeIrisOrigin = () => {
          const rect = introVeil.getBoundingClientRect();
          const dotRect = introDot.getBoundingClientRect();
          const cx = dotRect.left - rect.left + dotRect.width / 2;
          const cy = dotRect.top - rect.top + dotRect.height / 2;
          const maxR = Math.hypot(
            Math.max(cx, rect.width - cx),
            Math.max(cy, rect.height - cy)
          );
          introVeil.style.setProperty('--iris-x', `${cx}px`);
          introVeil.style.setProperty('--iris-y', `${cy}px`);
          return { maxR };
        };

        placeIrisOrigin();
        const state = { r: 0 };

        const irisTl = gsap.timeline({
          scrollTrigger: {
            trigger: firstChapter,
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * 0.85)}`,
            scrub: 0.5,
            invalidateOnRefresh: true,
            onRefresh: () => {
              placeIrisOrigin();
              introVeil.style.setProperty('--iris-r', `${state.r}px`);
            },
          },
        });

        irisTl
          .to(
            state,
            {
              r: () => placeIrisOrigin().maxR,
              ease: 'power2.inOut',
              onUpdate: () => {
                introVeil.style.setProperty('--iris-r', `${state.r}px`);
              },
            },
            0
          )
          .fromTo(
            '.work-intro-copy',
            { scale: 1 },
            {
              scale: 1.12,
              ease: 'power2.inOut',
            },
            0
          );
      }

      // ======================================================================
      // 3. Project Chapter Titles & Full-Screen Stacking Cards
      // ======================================================================
      chapters.forEach((chapter, index) => {
        const title = chapter.querySelector('.chapter-title');
        if (!title) return;
        const split = new SplitText(title, {
          type: 'words,chars',
          charsClass: 'char',
          mask: 'chars',
        });
        splits.push(split);

        if (index === 0 && isDesktopAperture) return;
        const release = splitChange(split.chars);
        gsap.from(split.chars, {
          yPercent: 140,
          duration: 1,
          stagger: 0.02,
          ease: 'expo.out',
          onComplete: release,
          scrollTrigger: {
            trigger: chapter,
            start: 'top 68%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      if (isDesktopAperture) {
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
        delete section.dataset.cinematic;
        splits.forEach((s) => s.revert());
        ScrollTrigger.refresh();
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="selected-work"
      aria-label="Selected Projects"
      className="work-sequence relative w-full"
    >
      {/* Anchor alias for #projects */}
      <div id="projects" className="absolute top-0" />

      {/* ====================================================================
          SECTION 4: "Selected work." VEIL STAGE
          - Animates characters + glowing raspberry dot on scroll-in
          - Sits directly over Project 01 (margin-bottom: -100svh on desktop)
            and opens a circular iris aperture from the raspberry dot into Project 01 with ZERO gap
         ==================================================================== */}
      <div className="work-veil relative flex min-h-[58svh] md:h-svh w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-12 text-center sm:px-8">
        <div className="work-intro-copy relative z-10 flex flex-col items-center will-change-transform">
          <span className="work-intro-eyebrow mb-5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            02 / Cloud &amp; DevOps Architecture Projects
          </span>

          <h2
            aria-label="Selected work."
            className="font-display text-[clamp(3.5rem,15.5vw,16.8rem)] font-black leading-[0.82] tracking-[-0.055em] text-foreground select-none"
          >
            <span className="work-heading-word block">Selected</span>
            <span className="inline-flex items-baseline">
              <span className="work-heading-word">work</span>
              <span
                aria-hidden="true"
                className="work-dot relative ml-1.5 sm:ml-3 inline-flex size-[0.16em] items-center justify-center rounded-full bg-primary align-baseline shadow-[0_0_24px_rgba(240,88,122,0.65)]"
              >
                <span className="work-dot-ring pointer-events-none absolute inset-0 rounded-full border-2 border-primary" />
              </span>
            </span>
          </h2>

          <p className="work-intro-desc mt-6 sm:mt-8 max-w-lg font-sans text-sm sm:text-base leading-relaxed text-muted-foreground">
            Five hands-on AWS, Terraform, Amazon EKS, GitHub Actions CI/CD, and
            Prometheus &amp; Grafana engineering projects.
          </p>
        </div>
      </div>

      {/* ====================================================================
          SECTION 5: THREE FULL-SCREEN STACKING PROJECT PANELS (PROJECTS 1–3)
         ==================================================================== */}
      <div className="chapter-stack relative w-full">
        {featuredProjects.map((project, index) => (
          <article
            key={project.id}
            data-index={index}
            style={{ zIndex: index + 1 }}
            className={`work-chapter md:sticky md:top-0 min-h-svh w-full ${
              index === 0 ? 'md:pb-[85svh]' : ''
            }`}
          >
            <div
              style={{
                backgroundColor: project.color,
                color: project.ink,
              }}
              className="chapter-surface relative flex min-h-svh w-full flex-col justify-between overflow-hidden px-4 py-10 sm:px-8 sm:py-12 md:px-12 lg:px-16 transition-shadow"
            >
              {/* Outgoing Shade Overlay */}
              <div
                aria-hidden="true"
                className="chapter-shade pointer-events-none absolute inset-0 z-30 bg-black opacity-0"
              />

              {/* Top Metadata Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-current/15 pb-5">
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
              <div className="relative z-10 my-auto grid grid-cols-1 items-center gap-8 py-8 lg:grid-cols-12 lg:gap-12">
                {/* Left Column */}
                <div className="lg:col-span-6 space-y-5">
                  <h3 className="chapter-title font-display text-[clamp(1.9rem,4.4vw,4.4rem)] font-black leading-[0.94] tracking-[-0.04em]">
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

                  {/* Actions with 48x48px Minimum Touch Targets */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href={projectHash(project.id)}
                      data-cursor="View Case Study"
                      style={{
                        backgroundColor: project.ink,
                        color: project.color,
                      }}
                      className="inline-flex min-h-12 items-center gap-3 rounded-full px-6 py-3 font-display text-sm font-bold tracking-[-0.01em] shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <span>View Case Study</span>
                      <span aria-hidden="true">→</span>
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => openQuickView(project, e.currentTarget)}
                      aria-haspopup="dialog"
                      className="inline-flex min-h-12 items-center gap-2 rounded-full border border-current/35 px-5 py-3 font-display text-xs font-bold uppercase tracking-wider transition-colors hover:bg-black/15 cursor-pointer"
                    >
                      <span>Quick View</span>
                    </button>

                    {project.repositoryUrl ? (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-current/30 px-5 py-3 font-display text-xs font-bold uppercase tracking-wider hover:bg-black/10"
                      >
                        <span>Repository ↗</span>
                      </a>
                    ) : (
                      <a
                        href={personalInfo.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-current/30 px-5 py-3 font-display text-xs font-bold uppercase tracking-wider transition-colors hover:bg-black/15"
                      >
                        <span>GitHub Profile ↗</span>
                      </a>
                    )}

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-current/30 px-5 py-3 font-display text-xs font-bold uppercase tracking-wider hover:bg-black/10"
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

      {/* Keyboard-Accessible Quick View Modal */}
      <ProjectDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        triggerRef={dialogTrigger}
      />
    </section>
  );
}
