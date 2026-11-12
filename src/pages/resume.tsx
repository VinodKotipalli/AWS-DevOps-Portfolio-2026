import {
  achievements,
  certifications,
  contactLinks,
  education,
  experience,
  personalInfo,
  projects,
  skillCategories,
} from '../lib/content';
import { Link } from '../lib/navigation';
import { downloadResumePdf, hasResumePdf } from '../lib/resume-pdf';
import { projectHash } from '../lib/routes';

export function ResumePage() {
  const pdfAvailable = hasResumePdf();

  return (
    <section className="mx-auto max-w-[1180px] px-5 pt-32 pb-28 sm:px-8 md:pt-40">
      {/* Top Action Bar */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card/70 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="size-2.5 rounded-full bg-primary" />
          <span className="font-mono text-xs text-muted-foreground">
            {personalInfo.name} · {personalInfo.extendedTitle}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {pdfAvailable ? (
            <button
              type="button"
              onClick={downloadResumePdf}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Download PDF</span>
              <span aria-hidden="true">↓</span>
            </button>
          ) : (
            <span
              aria-disabled="true"
              title="Set personalInfo.resumePdfUrl in src/lib/content.ts when a PDF file is supplied"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2.5 font-mono text-xs text-muted-foreground opacity-75 cursor-not-allowed"
            >
              PDF Download Unavailable (No PDF URL Configured)
            </span>
          )}
          <Link
            href="#"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-background px-5 py-3 font-mono text-xs text-foreground hover:border-primary"
          >
            ← Back Home
          </Link>
        </div>
      </div>

      {/* Resume Document Sheet */}
      <div className="rounded-[32px] border border-border bg-card p-5 sm:p-10 md:p-14 shadow-xl space-y-12">
        {/* Identity Header */}
        <header className="flex flex-col justify-between gap-6 border-b border-border pb-8 lg:flex-row lg:items-end">
          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-[-0.045em] text-foreground">
              {personalInfo.name}
            </h1>
            <p className="font-display text-lg sm:text-xl font-bold text-primary">
              {personalInfo.extendedTitle}
            </p>
            <p className="max-w-2xl font-sans text-sm text-muted-foreground pt-1 leading-relaxed">
              {personalInfo.professionalSummary}
            </p>
          </div>

          <div className="font-mono text-xs text-muted-foreground space-y-2 lg:text-right shrink-0">
            <div className="font-semibold text-foreground">
              {personalInfo.location} (Personal) · {personalInfo.employmentLocation} (Work)
            </div>
            <div className="flex flex-wrap lg:justify-end gap-2 pt-1">
              <a
                href={personalInfo.email.href}
                className="inline-flex min-h-12 items-center rounded-full border border-border bg-background px-4 py-2 hover:border-primary hover:text-primary"
              >
                {personalInfo.email.address}
              </a>
              <a
                href={personalInfo.phone.href}
                className="inline-flex min-h-12 items-center rounded-full border border-border bg-background px-4 py-2 hover:border-primary hover:text-primary"
              >
                {personalInfo.phone.display}
              </a>
            </div>
            <div className="flex flex-wrap lg:justify-end gap-2 pt-1">
              {contactLinks
                .filter((c) => c.external)
                .map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center rounded-full border border-border bg-background px-4 py-2 hover:border-primary hover:text-primary"
                  >
                    {c.label} ↗
                  </a>
                ))}
            </div>
          </div>
        </header>

        {/* Key Achievements */}
        <div className="space-y-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
            01 / Key Achievements
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {achievements.map((a) => (
              <div
                key={a.title}
                className="rounded-2xl border border-border bg-background/60 p-5 space-y-1.5"
              >
                <div className="font-display text-2xl font-black text-primary">
                  {a.metric}
                </div>
                <div className="font-display text-base font-bold text-foreground">
                  {a.title}
                </div>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Experience (All 10 TCS Points) */}
        <div className="space-y-6 border-t border-border pt-10">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
            02 / Professional Experience
          </h2>
          <div className="space-y-8">
            {experience.map((job) => (
              <article
                key={`${job.company}-${job.role}`}
                className="rounded-2xl border border-border bg-background/50 p-6 sm:p-8 space-y-5"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline border-b border-border/70 pb-4">
                  <div>
                    <h3 className="font-display text-2xl font-extrabold text-foreground">
                      {job.role}
                    </h3>
                    <p className="font-sans text-base font-semibold text-primary">
                      {job.company} · {job.employmentType}
                    </p>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {job.dates} · {job.location}
                  </div>
                </div>

                <ol className="space-y-2.5 font-sans text-sm text-foreground/90 leading-relaxed">
                  {job.highlights.map((bullet, idx) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-primary shrink-0 mt-0.5">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>

        {/* Technical Skills (All 11 Categories) */}
        <div className="space-y-5 border-t border-border pt-10">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
            03 / Technical Skills ({skillCategories.length} Categories)
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((group) => (
              <div
                key={group.group}
                className="rounded-2xl border border-border bg-background/60 p-5 space-y-2.5"
              >
                <h3 className="font-display text-base font-bold text-foreground">
                  {group.group}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-card px-2.5 py-0.5 font-mono text-[11px] text-foreground/85"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All 5 Projects */}
        <div className="space-y-6 border-t border-border pt-10">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
            04 / Projects ({projects.length})
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl border border-border bg-background/50 p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                    <span>Project {proj.indexNumber}</span>
                    <span>{proj.category}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {proj.name}
                  </h3>
                  <p className="font-sans text-xs font-semibold text-primary">
                    {proj.subtitle}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[68%]">
                    {proj.technologies.join(' · ')}
                  </span>
                  <Link
                    href={projectHash(proj.id)}
                    className="font-mono text-xs font-semibold text-primary hover:underline shrink-0"
                  >
                    Case study →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All 9 Certifications */}
        <div className="space-y-6 border-t border-border pt-10">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
            05 / Certifications ({certifications.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert) => (
              <div
                key={cert.code}
                className="rounded-2xl border border-border bg-background/50 p-5 space-y-2"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-primary">{cert.code}</span>
                  <span className="text-muted-foreground">{cert.issuer}</span>
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {cert.name}
                </h3>
                <div className="font-mono text-[11px] text-muted-foreground">
                  Issued: {cert.issued}
                  {cert.expires ? ` · Expires: ${cert.expires}` : ''}
                </div>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-4 border-t border-border pt-10">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
            06 / Education
          </h2>
          {education.map((edu) => (
            <div
              key={edu.degree}
              className="flex flex-col justify-between gap-2 rounded-2xl border border-border bg-background/50 p-6 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {edu.degree}
                </h3>
                <p className="font-sans text-sm text-foreground/90">
                  {edu.institution} · {edu.university}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {edu.location}
                </p>
              </div>
              <div className="sm:text-right font-mono text-xs space-y-1">
                <div className="text-muted-foreground">{edu.dates}</div>
                <div className="font-bold text-primary text-sm">
                  Percentage: {edu.percentage}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
