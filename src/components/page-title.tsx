import { useRef, type ReactNode } from 'react';
import { gsap, SplitText, useGSAP, motionOk } from '../lib/gsap';
import { cn } from '../lib/utils';

export function PageTitle({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionOk, () => {
        SplitText.create(ref.current, {
          type: 'words,chars',
          mask: 'chars',
          charsClass: 'split-char',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 135,
              duration: 1.05,
              ease: 'expo.out',
              stagger: 0.024,
              delay: 0.2,
            }),
        });
      });
    },
    { scope: ref }
  );

  return (
    <h1 ref={ref} id="page-title" className={cn('display-wide', className)}>
      {children}
    </h1>
  );
}
