import { useEffect, useRef } from 'react';
import { cinematic, gsap } from '../lib/gsap';

export function CursorLabel() {
  const pillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pill = pillRef.current;
    const text = textRef.current;
    if (!pill || !text || !cinematic()) return;

    // 0.4-second smoothing for desktop pointer follower
    const moveX = gsap.quickTo(pill, 'x', { duration: 0.4, ease: 'power3.out' });
    const moveY = gsap.quickTo(pill, 'y', { duration: 0.4, ease: 'power3.out' });

    let active = false;

    const onMove = (e: PointerEvent) => {
      moveX(e.clientX);
      moveY(e.clientY);

      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-cursor]'
      );
      const label = target?.dataset.cursor;

      if (label) {
        if (text.textContent !== label) text.textContent = label;
        if (!active) {
          active = true;
          gsap.to(pill, {
            scale: 1,
            opacity: 1,
            duration: 0.28,
            ease: 'power3.out',
            overwrite: true,
          });
        }
      } else if (active) {
        active = false;
        gsap.to(pill, {
          scale: 0.75,
          opacity: 0,
          duration: 0.22,
          ease: 'power2.out',
          overwrite: true,
        });
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div
      ref={pillRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:flex -translate-x-1/2 -translate-y-1/2 scale-75 opacity-0 items-center gap-2 rounded-full bg-primary px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-xl"
    >
      <span ref={textRef}>Explore</span>
      <span>→</span>
    </div>
  );
}
