import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  items: string[];
  /** 1 = moves left as you scroll down, -1 = right. */
  direction?: 1 | -1;
  rotate?: number;
  variant?: 'red' | 'ink' | 'pow';
}

const VARIANTS = {
  red: 'bg-blood text-ink border-ink',
  ink: 'bg-ink text-paper border-blood',
  pow: 'bg-pow text-ink border-ink',
};

/**
 * Caution-tape strip. Drifts constantly, is pushed along by scroll position,
 * and skews with scroll velocity so fast flicks feel physical.
 */
export default function Marquee({ items, direction = 1, rotate = 0, variant = 'red' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const wrap = wrapRef.current;
    if (!track || !wrap) return;

    const ctx = gsap.context(() => {
      // Endless drift on the inner track (content is duplicated, so -50% loops).
      const loop = gsap.fromTo(
        track,
        { xPercent: direction === 1 ? 0 : -50 },
        { xPercent: direction === 1 ? -50 : 0, duration: 28, ease: 'none', repeat: -1 },
      );

      // Scroll pushes the whole strip and speeds up the drift.
      gsap.fromTo(
        wrap,
        { x: `${direction * 8}vw` },
        {
          x: `${direction * -8}vw`,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
            onUpdate: (self) => {
              const v = self.getVelocity();
              const boost = 1 + Math.min(5, Math.abs(v) / 400);
              gsap.to(loop, { timeScale: boost, duration: 0.3, overwrite: true });
              gsap.to(track, {
                skewX: gsap.utils.clamp(-14, 14, (v / 120) * -direction),
                duration: 0.3,
                overwrite: 'auto',
              });
            },
          },
        },
      );
    }, wrap);

    return () => ctx.revert();
  }, [direction]);

  const content = [...items, ...items, ...items, ...items];

  return (
    <div className="relative z-20 -mx-[5vw] overflow-hidden py-3" style={{ transform: `rotate(${rotate}deg)` }}>
      <div ref={wrapRef} className={`border-y-4 ${VARIANTS[variant]}`}>
        <div ref={trackRef} className="flex w-max whitespace-nowrap py-3">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {content.map((t, i) => (
                <span key={`${dup}-${i}`} className="flex items-center font-display text-3xl uppercase md:text-5xl">
                  <span className="px-6">{t}</span>
                  <span className="font-comic text-2xl md:text-4xl">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
