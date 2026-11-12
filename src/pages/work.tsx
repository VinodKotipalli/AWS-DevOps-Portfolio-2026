import { useRef } from 'react';
import { ArchitectureStage } from '../components/architecture-stage';
import { personalInfo, projects } from '../lib/content';
import { gsap, motionOk, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap';
import { Link } from '../lib/navigation';
import { projectHash } from '../lib/routes';

export function WorkPage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section || !motionOk()) return;

      const split = new SplitText('.work-page-title', {
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

      gsap.from('.work-page-card', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
        delay: 0.2,
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
      className="mx-auto max-w-[1440px] px-5 pt-32 pb-28 sm:px-8 md:pt-40 lg:px-14"
    >
      <div className="mb-16 space-y-4">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          All 5 Cloud &amp; DevOps Engineering Projects
        </span>
        <h1 className="work-page-title font-display text-[clamp(3.2rem,9.5vw,8.5rem)] font-black leading-[0.86] tracking-[-0.05em] text-foreground">
          Selected work.
        </h1>
        <p className="max-w-2xl font-sans text-base sm:text-lg text-muted-foreground">
          Complete architectural case studies across AWS Multi-Tier Terraform
          IaC, Amazon EKS Kubernetes orchestration, GitHub Actions CI/CD,
          Remote State locking, and Prometheus &amp; Grafana observability.
        </p>
      </div>

      <div className="space-y-12">
        {projects.map((project) => (
          <article
            key={project.id}
            style={{ backgroundColor: project.color, color: project.ink }}
            className="work-page-card overflow-hidden rounded-[32px] p-6 sm:p-10 md:p-12 shadow-xl"
          >
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-6 space-y-5">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider opacity-85">
                  <span>Project {project.indexNumber}</span>
                  <span>·</span>
                  <span>{project.category}</span>
                </div>

                <h2 className="font-display text-3xl sm:text-5xl font-black tracking-[-0.04em] leading-[0.94]">
                  {project.name}
                </h2>

                <p className="font-display text-lg font-semibold opacity-95">
                  {project.subtitle}
                </p>

                <p className="font-sans text-sm sm:text-base opacity-85 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-current/25 px-3 py-1 font-mono text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href={projectHash(project.id)}
                    style={{ backgroundColor: project.ink, color: project.color }}
                    className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-display text-sm font-bold shadow-md transition-transform hover:-translate-y-0.5"
                  >
                    <span>View Case Study</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-current/30 px-5 py-3 font-display text-xs font-bold uppercase tracking-wider hover:bg-black/15"
                  >
                    <span>GitHub Profile ↗</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <Link
                  href={projectHash(project.id)}
                  className="block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-current/20 shadow-2xl"
                >
                  <ArchitectureStage projectId={project.id} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
