import { useEffect, useRef } from 'react';
import { ArchitectureStage } from './architecture-stage';
import { personalInfo, type ProjectConfig } from '../lib/content';
import { Link } from '../lib/navigation';
import { projectHash } from '../lib/routes';

type ProjectDialogProps = {
  project: ProjectConfig | null;
  onClose: () => void;
  triggerRef?: HTMLElement | null;
};

export function ProjectDialog({
  project,
  onClose,
  triggerRef,
}: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;

    const previousActive =
      (triggerRef as HTMLElement | null) ??
      (document.activeElement as HTMLElement | null);

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 10);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousActive?.focus?.();
    };
  }, [project, onClose, triggerRef]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`dialog-title-${project.id}`}
        aria-describedby={`dialog-desc-${project.id}`}
        className="relative max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-border bg-card text-card-foreground shadow-2xl p-5 sm:p-8 space-y-6"
      >
        {/* Top Bar with 48x48px Close Button */}
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              Project {project.indexNumber} · {project.category}
            </span>
            <h2
              id={`dialog-title-${project.id}`}
              className="font-display text-2xl sm:text-3xl font-black tracking-[-0.03em] text-foreground"
            >
              {project.name}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details dialog"
            className="inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Architecture Preview */}
        <div className="sm:aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border">
          <ArchitectureStage projectId={project.id} compact />
        </div>

        {/* Subtitle & Full Description */}
        <div className="space-y-3">
          <p className="font-display text-base sm:text-lg font-bold text-foreground">
            {project.subtitle}
          </p>
          <p
            id={`dialog-desc-${project.id}`}
            className="font-sans text-sm sm:text-base leading-relaxed text-muted-foreground"
          >
            {project.description}
          </p>
        </div>

        {/* Implementation Details */}
        <div className="space-y-2.5">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
            Key Implementation Details
          </h3>
          <ul className="space-y-2 font-sans text-xs sm:text-sm text-foreground/90">
            {project.implementationDetails.map((detail) => (
              <li key={detail} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-foreground/90"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions with 48x48px Minimum Touch Targets */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={projectHash(project.id)}
              onClick={onClose}
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-primary px-6 py-3 font-display text-sm font-bold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5"
            >
              <span>Open Full Case Study</span>
              <span aria-hidden="true">→</span>
            </Link>

            <a
              href={project.repositoryUrl ?? personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-background px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <span>{project.repositoryUrl ? 'Repository ↗' : 'GitHub Profile ↗'}</span>
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border px-5 py-2.5 font-mono text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
