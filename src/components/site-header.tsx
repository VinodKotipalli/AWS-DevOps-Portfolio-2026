import { personalInfo } from '../lib/content';
import { Link, useNavigation } from '../lib/navigation';
import type { Theme } from '../lib/theme';

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

export function SiteHeader({ theme, onToggleTheme }: HeaderProps) {
  const { route } = useNavigation();

  const navItems = [
    { label: 'Projects', href: '#work', active: route.page === 'work' || route.page === 'project' },
    { label: 'Experience', href: '#experience', active: false },
    { label: 'Skills', href: '#skills', active: false },
    { label: 'Certifications', href: '#certifications', active: false },
    { label: 'About', href: '#about', active: route.page === 'about' },
    { label: 'Resume', href: '#resume', active: route.page === 'resume' },
  ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-7 sm:pt-5">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
        {/* Left: Initials / Name Pill */}
        <Link
          href="#"
          aria-label={`${personalInfo.name} — Home`}
          className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-background/85 px-4 py-2 backdrop-blur-md shadow-xs transition-colors hover:border-primary"
        >
          <span className="font-display text-base font-black tracking-[-0.04em] text-foreground">
            {personalInfo.initials}
          </span>
          <span className="hidden sm:inline font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {personalInfo.name}
          </span>
        </Link>

        {/* Right: Navigation + Contact Button + Theme Toggle */}
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 rounded-full border border-border/80 bg-background/85 p-1.5 backdrop-blur-md shadow-xs">
          <nav aria-label="Primary navigation" className="flex items-center gap-0.5 overflow-x-auto max-w-[62vw] sm:max-w-none">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={`rounded-full px-2.5 sm:px-3 py-1.5 font-sans text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  item.active
                    ? 'bg-foreground text-background'
                    : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href={personalInfo.email.href}
            className="hidden lg:inline-flex items-center rounded-full bg-primary px-4 py-1.5 font-display text-xs font-bold tracking-[-0.01em] text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Contact Me
          </a>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
          >
            {theme === 'light' ? (
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
