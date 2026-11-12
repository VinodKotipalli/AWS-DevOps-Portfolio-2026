import { useCallback, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark';

export type ThemeValue = {
  theme: Theme;
  toggle: () => void;
  toggleTheme: () => void;
};

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function useTheme(): ThemeValue {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle('dark', next === 'dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', next === 'dark' ? '#141414' : '#eef0f2');
    }
    try {
      localStorage.setItem('portfolio-theme', next);
    } catch {
      // ignore storage errors in restricted contexts
    }
    setTheme(next);
  }, []);

  return useMemo(
    () => ({ theme, toggle, toggleTheme: toggle }),
    [theme, toggle]
  );
}
