import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
gsap.defaults({ ease: 'power3.out' });

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const MOTION_OK_QUERY = '(prefers-reduced-motion: no-preference)';
export const HOVER_FINE_QUERY = '(hover: hover) and (pointer: fine)';
export const CINEMATIC_QUERY =
  '(min-width: 1024px) and (min-height: 600px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function motionOk(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(MOTION_OK_QUERY).matches
  );
}

export function canHoverAndFinePointer(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(HOVER_FINE_QUERY).matches
  );
}

export function cinematic(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(CINEMATIC_QUERY).matches
  );
}
