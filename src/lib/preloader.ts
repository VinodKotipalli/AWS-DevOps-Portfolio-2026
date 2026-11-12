export const PRELOADER_STORAGE_KEY = 'sv_preloader_seen_v1';
export const PRELOADER_HERO_START_EVENT = 'sv:preloader-hero-start';

let heroEntranceTriggeredInMemory = false;

export function shouldPlayPreloader(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(PRELOADER_STORAGE_KEY) !== '1';
  } catch {
    return false;
  }
}

export function markPreloaderSeen(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(PRELOADER_STORAGE_KEY, '1');
  } catch {
    // Ignore storage quota / privacy mode errors
  }
  document.documentElement.removeAttribute('data-preloader');
}

export function triggerHeroEntranceFromPreloader(): void {
  heroEntranceTriggeredInMemory = true;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PRELOADER_HERO_START_EVENT));
  }
}

export function hasHeroEntranceStarted(): boolean {
  return heroEntranceTriggeredInMemory || !shouldPlayPreloader();
}
