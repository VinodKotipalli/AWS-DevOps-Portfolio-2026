import { useEffect, useRef, useState } from 'react';
import { personalInfo } from '../lib/content';
import { Link, useNavigation } from '../lib/navigation';
import type { Theme } from '../lib/theme';

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

export function SiteHeader({ theme, onToggleTheme }: HeaderProps) {
  const { route } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  const navItems = [
    {
      label: 'Projects',
      href: '#work',
      active: route.page === 'work' || route.page === 'project',
    },
    { label: 'Experience', href: '#experience', active: false },
    { label: 'Skills', href: '#skills', active: false },
    { label: 'Certifications', href: '#certifications', active: false },
    { label: 'About', href: '#about', active: route.page === 'about' },
    { label: 'Resume', href: '#resume', active: route.page === 'resume' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [route]);

  // Keyboard Escape & outside tap handling for Android/Desktop mobile drawer
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (
        target &&
        !mobileDrawerRef.current?.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-10">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 sm:gap-3">
        {/* Left: Initials / Name Pill (Minimum 48x48px touch target) */}
        <Link
          href="#"
          aria-label={`${personalInfo.name} — Home`}
          className="pointer-events-auto inline-flex min-h-12 min-w-12 items-center gap-2.5 rounded-full border border-border/80 bg-background/90 px-4 py-2.5 backdrop-blur-md shadow-xs transition-colors hover:border-primary"
        >
          <span className="font-display text-base font-black tracking-[-0.04em] text-foreground">
            {personalInfo.initials}
          </span>
          <span className="hidden xs:inline sm:inline font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground truncate max-w-[140px] sm:max-w-none">
            {personalInfo.name}
          </span>
        </Link>

        {/* Right: Desktop Navigation + Contact Button + Theme Toggle + Mobile Menu Toggle */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 p-1.5 backdrop-blur-md shadow-xs">
          {/* Desktop Primary Navigation (lg and above) */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-1"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={`inline-flex min-h-12 items-center justify-center rounded-full px-4 py-2 font-sans text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  item.active
                    ? 'bg-foreground text-background'
                    : 'text-foreground/85 hover:text-foreground hover:bg-foreground/8'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Contact CTA */}
          <a
            href={personalInfo.email.href}
            className="hidden lg:inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 py-2 font-display text-xs font-bold tracking-[-0.01em] text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Contact Me
          </a>

          {/* Theme Toggle Button (48x48px touch target) */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
          >
            {theme === 'light' ? (
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>

          {/* Compact Mobile Navigation Menu Button (< lg, 48x48px touch target) */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            className="lg:hidden inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
          >
            <span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
            {mobileMenuOpen ? (
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Compact Mobile Navigation Drawer (Android Phones & Small Tablets) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          ref={mobileDrawerRef}
          role="dialog"
          aria-label="Mobile Navigation Menu"
          className="pointer-events-auto lg:hidden mx-auto mt-2.5 max-w-[1440px] max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-3xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-xl"
        >
          <nav
            aria-label="Mobile navigation"
            className="grid grid-cols-1 gap-1.5 sm:grid-cols-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={item.active ? 'page' : undefined}
                className={`flex min-h-12 items-center justify-between rounded-2xl px-4 py-3 font-display text-base font-bold transition-colors ${
                  item.active
                    ? 'bg-foreground text-background'
                    : 'bg-card/80 text-foreground hover:bg-card hover:text-primary'
                }`}
              >
                <span>{item.label}</span>
                <span aria-hidden="true" className="font-mono text-xs opacity-70">
                  →
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-3 grid grid-cols-1 gap-2 border-t border-border pt-3 sm:grid-cols-2">
            <a
              href={personalInfo.email.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-display text-sm font-bold text-primary-foreground shadow-sm"
            >
              <span>Email Saivinod</span>
              <span aria-hidden="true">↗</span>
            </a>

            <a
              href={personalInfo.phone.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 font-mono text-xs font-semibold text-foreground hover:border-primary"
            >
              <span>Call {personalInfo.phone.display}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
