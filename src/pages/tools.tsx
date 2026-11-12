import { useRef } from 'react';
import { ArchitectureStage } from '../components/architecture-stage';
import { personalInfo, toolProjects } from '../lib/content';
import { gsap, motionOk, SplitText, useGSAP } from '../lib/gsap';
import { Link } from '../lib/navigation';
import { projectHash } from '../lib/routes';

export function ToolsPage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section || !motionOk()) return;

      const split = new SplitText('.tools-page-title', {
        type: 'chars',
        charsClass: 'char',
        mask: 'chars',
      });

      gsap.from(split.chars, {
        yPercent: 130,
        duration: 1.1,
        stagger: 0.025,
        ease: 'expo.out',
      });

      gsap.from('.tool-card', {
        y: 50,
        opacity: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: 'expo.out',
        delay: 0.2,
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
      <div className="mb-16 space-y-4">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Projects 04 &amp; 05 · IaC State Governance &amp; Observability
        </span>
        <h1 className="tools-page-title font-display text-[clamp(3rem,8.5vw,7.8rem)] font-black leading-[0.88] tracking-[-0.05em] text-foreground">
          State &amp; telemetry.
        </h1>
        <p className="max-w-2xl font-sans text-base sm:text-lg text-muted-foreground">
          Deep-dive architectures for Terraform Remote State &amp; DynamoDB
          Locking and AWS Observability with Prometheus, Grafana, and
          Alertmanager.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {toolProjects.map((tool) => (
          <article
            key={tool.id}
            style={{ backgroundColor: tool.color, color: tool.ink }}
            className="tool-card flex flex-col justify-between rounded-[28px] p-7 sm:p-9 shadow-xl space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-current/15 pb-4 font-mono text-xs uppercase tracking-wider">
                <span>Project {tool.indexNumber}</span>
                <span>{tool.category}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-[-0.035em]">
                {tool.name}
              </h2>

              <p className="font-display text-sm sm:text-base font-semibold opacity-95">
                {tool.subtitle}
              </p>

              <p className="font-sans text-sm opacity-85 leading-relaxed">
                {tool.description}
              </p>

              <div className="sm:aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <ArchitectureStage projectId={tool.id} compact />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-current/15">
              <div className="flex flex-wrap gap-1.5">
                {tool.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-current/25 px-2.5 py-0.5 font-mono text-[11px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={projectHash(tool.id)}
                  style={{ backgroundColor: tool.ink, color: tool.color }}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 font-display text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  <span>View Case Study</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center gap-1 rounded-full border border-current/30 px-4 py-3 font-mono text-xs"
                >
                  <span>GitHub ↗</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
