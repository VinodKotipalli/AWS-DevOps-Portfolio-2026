import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { Curtain, type CurtainHandle } from './components/curtain';
import { CursorLabel } from './components/cursor-label';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';
import { personalInfo, projectNames } from './lib/content';
import { gsap, prefersReducedMotion, ScrollTrigger } from './lib/gsap';
import { NavigationContext } from './lib/navigation';
import {
  parseRoute,
  routeKey,
  routeTitle,
  type Route,
} from './lib/routes';
import { useTheme } from './lib/theme';
import { AboutPage } from './pages/about';
import { HomePage } from './pages/home';
import { ProjectPage } from './pages/project';
import { ResumePage } from './pages/resume';
import { ToolsPage } from './pages/tools';
import { WorkPage } from './pages/work';

function scrollToAnchor(anchor?: string, lenis?: Lenis | null) {
  if (!anchor) {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return;
  }
  const el = document.getElementById(anchor);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: -24, duration: 1.1 });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [route, setRoute] = useState<Route>(() =>
    parseRoute(window.location.hash)
  );
  const routeRef = useRef(route);
  routeRef.current = route;

  const lenisRef = useRef<Lenis | null>(null);
  const curtainRef = useRef<CurtainHandle>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Initialize Lenis smooth scrolling synchronized with GSAP ScrollTrigger
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Sync document title with active route
  useEffect(() => {
    const pageTitle = routeTitle(route, projectNames);
    document.title =
      route.page === 'home'
        ? `${personalInfo.name} — ${personalInfo.role}`
        : `${pageTitle} — ${personalInfo.name}`;
  }, [route]);

  const applyRoute = useCallback((next: Route, pushHash?: string) => {
    const current = routeRef.current;
    const samePage = routeKey(current) === routeKey(next);

    if (pushHash !== undefined && window.location.hash !== pushHash) {
      window.history.pushState(null, '', pushHash || '#');
    }

    if (samePage) {
      setRoute(next);
      if (next.page === 'home') {
        scrollToAnchor(next.anchor, lenisRef.current);
      }
      return;
    }

    const label = routeTitle(next, projectNames);
    if (curtainRef.current && !prefersReducedMotion()) {
      curtainRef.current.play(label, () => {
        setRoute(next);
        window.requestAnimationFrame(() => {
          if (next.page === 'home' && next.anchor) {
            scrollToAnchor(next.anchor, lenisRef.current);
          } else {
            scrollToAnchor(undefined, lenisRef.current);
          }
          ScrollTrigger.refresh();
          mainRef.current?.focus({ preventScroll: true });
        });
      });
    } else {
      setRoute(next);
      window.requestAnimationFrame(() => {
        if (next.page === 'home' && next.anchor) {
          scrollToAnchor(next.anchor, lenisRef.current);
        } else {
          scrollToAnchor(undefined, lenisRef.current);
        }
        ScrollTrigger.refresh();
      });
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const next = parseRoute(window.location.hash);
      applyRoute(next);
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
    };
  }, [applyRoute]);

  const navigate = useCallback(
    (href: string) => {
      const normalized = href.startsWith('#') ? href : `#${href}`;
      const next = parseRoute(normalized);
      applyRoute(next, normalized);
    },
    [applyRoute]
  );

  return (
    <NavigationContext.Provider value={{ route, navigate }}>
      {/* Skip-to-Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:font-mono focus:text-xs focus:font-bold focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <Curtain ref={curtainRef} />
      <CursorLabel />
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} />

      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className="min-h-svh w-full outline-none"
      >
        {route.page === 'home' && <HomePage />}
        {route.page === 'work' && <WorkPage />}
        {route.page === 'tools' && <ToolsPage />}
        {route.page === 'about' && <AboutPage />}
        {route.page === 'resume' && <ResumePage />}
        {route.page === 'project' && <ProjectPage id={route.id} />}
      </main>

      <SiteFooter />
    </NavigationContext.Provider>
  );
}
