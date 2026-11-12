import { forwardRef, useImperativeHandle, useRef } from 'react';
import { gsap, motionOk } from '../lib/gsap';

export type CurtainHandle = {
  play: (label: string, onMidpoint: () => void) => void;
};

export const Curtain = forwardRef<CurtainHandle>((_, ref) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    play(label: string, onMidpoint: () => void) {
      const curtain = rootRef.current;
      const text = labelRef.current;
      if (!curtain || !text || !motionOk()) {
        onMidpoint();
        return;
      }

      text.textContent = label;
      gsap.killTweensOf([curtain, text]);

      const tl = gsap.timeline();
      tl.set(curtain, { yPercent: 100, autoAlpha: 1 })
        .set(text, { yPercent: 60, opacity: 0 })
        // Cover upward: 0.62s, expo.inOut
        .to(curtain, {
          yPercent: 0,
          duration: 0.62,
          ease: 'expo.inOut',
        })
        // Label entrance: 0.5s, expo.out
        .to(
          text,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'expo.out',
          },
          '-=0.32'
        )
        .add(() => {
          onMidpoint();
        })
        // Label exit: 0.5s, expo.out
        .to(
          text,
          {
            yPercent: -60,
            opacity: 0,
            duration: 0.5,
            ease: 'expo.out',
          },
          '+=0.06'
        )
        // Uncover upward: 0.72s, expo.inOut
        .to(
          curtain,
          {
            yPercent: -100,
            duration: 0.72,
            ease: 'expo.inOut',
          },
          '-=0.38'
        )
        .set(curtain, { autoAlpha: 0 });
    },
  }));

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-0 z-[100] flex items-center justify-center bg-[#111315] text-[#fff5f7]"
    >
      <div className="overflow-hidden px-6 py-3">
        <span
          ref={labelRef}
          className="block font-display text-[clamp(2rem,5vw,4.5rem)] font-black tracking-[-0.04em]"
        />
      </div>
    </div>
  );
});
