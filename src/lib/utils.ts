import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitChange(elements: Element[]): () => void {
  const htmlElements = elements.filter(
    (el): el is HTMLElement => el instanceof HTMLElement
  );
  htmlElements.forEach((el) => {
    el.style.willChange = 'transform';
  });
  return () => {
    htmlElements.forEach((el) => {
      el.style.willChange = '';
    });
  };
}
