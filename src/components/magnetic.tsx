import { useRef, type ReactNode } from 'react';
import { canHoverAndFinePointer, cinematic, gsap, useGSAP } from '../lib/gsap';

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

export function Magnetic({
  children,
  strength = 0.3,
  className = 'inline-block',
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !cinematic() || !canHoverAndFinePointer()) return;

      // Magnetic motion: duration 0.8s, ease: elastic.out(1, 0.45), strength = 0.3
      const xTo = gsap.quickTo(el, 'x', {
        duration: 0.8,
        ease: 'elastic.out(1, 0.45)',
      });
      const yTo = gsap.quickTo(el, 'y', {
        duration: 0.8,
        ease: 'elastic.out(1, 0.45)',
      });

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        xTo((e.clientX - cx) * strength);
        yTo((e.clientY - cy) * strength);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);

      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref, dependencies: [strength] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
