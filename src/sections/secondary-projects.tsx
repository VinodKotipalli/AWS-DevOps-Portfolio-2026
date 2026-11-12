import { useRef, useState } from 'react';
import { ArchitectureStage } from '../components/architecture-stage';
import { ProjectDialog } from '../components/project-dialog';
import {
  personalInfo,
  toolProjects,
  type ProjectConfig,
} from '../lib/content';
import { gsap, motionOk, ScrollTrigger, useGSAP } from '../lib/gsap';
import { Link } from '../lib/navigation';
import { projectHash } from '../lib/routes';

export function SecondaryProjects() {
  const root = useRef<HTMLElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectConfig | null>(
    null
  );
  const [dialogTrigger, setDialogTrigger] = useState<HTMLElement | null>(null);

  const activeTool = toolProjects[activeIndex] ?? toolProjects[0];

  useGSAP(
    () => {
      const section = root.current;
      if (!section || !motionOk()) return;

      gsap.from('.tool-row', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.tool-list',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.tool-preview-frame', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.tool-preview-frame',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });

      return () => {
        ScrollTrigger.refresh();
      };
    },
    { scope: root }
  );

  const activateItem = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    if (motionOk() && previewCardRef.current) {
      gsap.fromTo(
        previewCardRef.current,
        { scale: 1.03, opacity: 0.6 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: true,
        }
      );
    }
  };

  return (
    <section
      ref={root}
      id="secondary-projects"
      aria-labelledby="secondary-projects-heading"
      className="relative mx-auto max-w-[1440px] px-4 py-24 sm:px-8 md:py-36 lg:px-14 border-t border-border"
    >
      {/* Section Header */}
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            03 / Projects 04 &amp; 05 · IaC State Governance &amp; Observability
          </span>
          <h2
            id="secondary-projects-heading"
            className="font-display text-[clamp(2.2rem,5.8vw,5.2rem)] font-black leading-[0.9] tracking-[-0.045em] text-foreground"
          >
            State &amp; <span className="text-primary">telemetry.</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <p className="max-w-md font-sans text-sm sm:text-base text-muted-foreground">
            Centralized Terraform remote-state locking and full-stack AWS
            observability with Prometheus, Grafana, and Alertmanager.
          </p>
          <Link
            href="#work"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <span>All 5 Projects</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Two-Column Interactive List + Sticky Preview Frame */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Interactive Project Rows (Projects 4 & 5) */}
        <div className="tool-list lg:col-span-7 divide-y divide-border border-y border-border">
          {toolProjects.map((tool, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={tool.id}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') activateItem(index);
                }}
                onFocus={() => activateItem(index)}
                className={`tool-row group relative transition-colors duration-300 ${
                  isActive ? 'bg-card/85' : 'hover:bg-card/45'
                }`}
              >
                <div className="flex flex-col gap-4 px-4 py-7 sm:px-6 sm:py-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-primary">
                        {tool.indexNumber}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {tool.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => activateItem(index)}
                        aria-pressed={isActive}
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-background px-4 py-2 font-mono text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
                      >
                        {isActive ? 'Selected' : 'Select Preview'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          setDialogTrigger(e.currentTarget);
                          setSelectedProject(tool);
                        }}
                        aria-haspopup="dialog"
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-background px-4 py-2 font-mono text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
                      >
                        Quick View
                      </button>

                      <Link
                        href={projectHash(tool.id)}
                        aria-label={`View ${tool.name} case study`}
                        className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Link
                      href={projectHash(tool.id)}
                      className="block font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-foreground group-hover:text-primary transition-colors"
                    >
                      {tool.name}
                    </Link>
                    <p className="font-display text-sm sm:text-base font-semibold text-foreground/85">
                      {tool.subtitle}
                    </p>
                  </div>

                  <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>

                  {/* Implementation Highlights */}
                  <ul className="space-y-1.5 pt-1 font-sans text-xs sm:text-sm text-muted-foreground">
                    {tool.implementationDetails.slice(0, 3).map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tool.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border/80 bg-background/60 px-2.5 py-0.5 font-mono text-[11px] text-foreground/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Sticky Preview Frame */}
        <div className="tool-preview-frame lg:col-span-5 lg:sticky lg:top-24">
          {activeTool && (
            <div
              ref={previewCardRef}
              style={{
                backgroundColor: activeTool.color,
                color: activeTool.ink,
              }}
              className="overflow-hidden rounded-[28px] border border-border p-5 sm:p-7 shadow-xl transition-colors duration-500 space-y-6"
            >
              <div className="flex items-center justify-between gap-2 border-b border-current/15 pb-4">
                <span className="font-mono text-xs uppercase tracking-[0.14em] opacity-85">
                  Project {activeTool.indexNumber} · {activeTool.category}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl sm:text-3xl font-black tracking-[-0.035em]">
                  {activeTool.name}
                </h3>
                <p className="font-sans text-sm opacity-90 leading-relaxed">
                  {activeTool.subtitle}
                </p>
              </div>

              <div className="sm:aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <ArchitectureStage projectId={activeTool.id} compact />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  href={projectHash(activeTool.id)}
                  style={{
                    backgroundColor: activeTool.ink,
                    color: activeTool.color,
                  }}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 font-display text-xs font-bold uppercase tracking-wider shadow-md transition-transform hover:-translate-y-0.5"
                >
                  <span>View Case Study</span>
                  <span aria-hidden="true">→</span>
                </Link>

                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center gap-1.5 rounded-full border border-current/30 px-4 py-2.5 font-mono text-xs font-semibold hover:bg-black/15"
                >
                  <span>GitHub Profile ↗</span>
                </a>
              </div>
            </div>
          )}
        </div>
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
