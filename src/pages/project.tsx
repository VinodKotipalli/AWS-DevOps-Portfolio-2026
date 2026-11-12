import { ArchitectureStage } from '../components/architecture-stage';
import { personalInfo, projectById, projects } from '../lib/content';
import { Link } from '../lib/navigation';
import { projectHash, type ProjectId } from '../lib/routes';

type ProjectPageProps = {
  id: ProjectId;
};

export function ProjectPage({ id }: ProjectPageProps) {
  const project = projectById(id);
  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length] ?? projects[0];

  return (
    <article className="w-full pb-28">
      {/* Colored Hero Banner */}
      <header
        style={{ backgroundColor: project.color, color: project.ink }}
        className="w-full pt-32 pb-20 sm:pt-40 sm:pb-24 px-5 sm:px-8 lg:px-14"
      >
        <div className="mx-auto max-w-[1440px] space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-current/15 pb-6">
            <Link
              href="#work"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-current/25 px-5 py-2.5 font-mono text-xs uppercase tracking-wider hover:bg-black/15"
            >
              <span>← All 5 Projects</span>
            </Link>

            <span className="rounded-full border border-current/25 bg-black/15 px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider">
              Project {project.indexNumber} · {project.category}
            </span>
          </div>

          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-4">
              <div className="font-mono text-xs uppercase tracking-[0.16em] opacity-85">
                {project.category}
              </div>
              <h1 className="font-display text-[clamp(2.1rem,6vw,5.8rem)] font-black leading-[0.9] tracking-[-0.045em]">
                {project.name}
              </h1>
              <p className="max-w-2xl font-display text-lg sm:text-2xl font-semibold leading-snug opacity-95">
                {project.subtitle}
              </p>
              {project.sourceSubtitle && (
                <p className="font-mono text-xs opacity-75">
                  Source Subtitle: {project.sourceSubtitle}
                </p>
              )}
            </div>

            <div className="lg:col-span-4 space-y-4 border-t border-current/15 pt-4 lg:border-t-0 lg:pt-0 font-mono text-xs">
              <div>
                <div className="opacity-65 uppercase">Engineer</div>
                <div className="font-semibold mt-1">
                  {personalInfo.name} · {project.role}
                </div>
              </div>
              <div>
                <div className="opacity-65 uppercase">Architecture Scope</div>
                <div className="font-semibold mt-1">{project.scope}</div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.repositoryUrl ? (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center rounded-full border border-current/30 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-black/15"
                  >
                    Repository ↗
                  </a>
                ) : (
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center rounded-full border border-current/30 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-black/15"
                  >
                    GitHub Profile ↗
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center rounded-full border border-current/30 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-black/15"
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Illustrative Architecture Stage */}
          <div className="aspect-[16/9] max-h-[560px] w-full overflow-hidden rounded-[28px] border border-current/20 shadow-2xl">
            <ArchitectureStage projectId={project.id} />
          </div>
        </div>
      </header>

      {/* Case Study Content Body */}
      <div className="mx-auto max-w-[1140px] px-5 pt-20 sm:px-8 space-y-20">
        {/* Overview */}
        <section className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
              01 / Architecture Overview
            </span>
            <h2 className="font-display text-3xl font-black tracking-[-0.03em]">
              System Description
            </h2>
          </div>

          <div className="md:col-span-8 space-y-6">
            <p className="font-sans text-base sm:text-lg leading-relaxed text-foreground/90">
              {project.description}
            </p>

            {/* Technology Stack Pills */}
            <div className="space-y-2 pt-2">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Technologies Used
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs font-medium text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Details */}
        <section className="grid grid-cols-1 gap-10 border-t border-border pt-16 md:grid-cols-12">
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
              02 / Engineering Execution
            </span>
            <h2 className="font-display text-3xl font-black tracking-[-0.03em]">
              Implementation Details
            </h2>
          </div>

          <div className="md:col-span-8 space-y-4">
            <ol className="space-y-3.5">
              {project.implementationDetails.map((detail, idx) => (
                <li
                  key={detail}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 font-sans text-sm sm:text-base leading-relaxed text-foreground"
                >
                  <span className="font-mono text-xs font-bold text-primary mt-1 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Architecture Flow Sequence */}
        <section className="grid grid-cols-1 gap-10 border-t border-border pt-16 md:grid-cols-12">
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
              03 / System Flow
            </span>
            <h2 className="font-display text-3xl font-black tracking-[-0.03em]">
              Topology Sequence
            </h2>
          </div>

          <div className="md:col-span-8 space-y-6">
            {project.architectureFlows.map((flow) => (
              <div
                key={flow.label}
                className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4"
              >
                <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {flow.label}
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {flow.steps.map((step, idx) => (
                    <div key={step} className="flex items-center gap-2.5">
                      <span className="rounded-full border border-border bg-background px-4 py-2 font-mono text-xs font-semibold text-foreground">
                        {step}
                      </span>
                      {idx < flow.steps.length - 1 && (
                        <span className="text-primary font-mono font-bold">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Project Navigation */}
        <div className="border-t border-border pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Next Project ({nextProject.indexNumber} / 0{projects.length})
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-foreground mt-1">
              {nextProject.name}
            </h3>
          </div>

          <Link
            href={projectHash(nextProject.id)}
            className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 font-display text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <span>Next Case Study</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
