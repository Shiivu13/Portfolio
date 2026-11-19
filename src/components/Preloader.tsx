import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const LINES = [
  'Loading sarcasm module',
  'Sharpening the code',
  'Bribing the compiler',
  'Breaking the fourth wall',
];

/** Comic-style intro: counter ticks to 100, then two red panels slash apart. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const counter = { v: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to(counter, {
        v: 100,
        duration: reduce ? 0.2 : 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          const v = Math.round(counter.v);
          if (countRef.current) countRef.current.textContent = String(v).padStart(3, '0');
          if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
          setLine(Math.min(LINES.length - 1, Math.floor(v / 26)));
        },
      })
        .to('.pl-content', { y: -40, opacity: 0, duration: 0.35, ease: 'power2.in' })
        .call(onDone)
        .to('.pl-top', { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, '<0.1')
        .to('.pl-bottom', { yPercent: 100, duration: 0.8, ease: 'expo.inOut' }, '<')
        .set(rootRef.current, { display: 'none' });
    }, rootRef);

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[150]" aria-hidden="true">
      <div
        className="pl-top absolute inset-x-0 top-0 h-[55%] bg-blood"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 82%, 0 100%)' }}
      >
        <div className="absolute inset-0 halftone-ink opacity-40" />
      </div>
      <div
        className="pl-bottom absolute inset-x-0 bottom-0 h-[55%] bg-ink"
        style={{ clipPath: 'polygon(0 18%, 100% 0, 100% 100%, 0 100%)' }}
      />

      <div className="pl-content absolute inset-0 flex flex-col items-center justify-center gap-6 px-6">
        <div className="font-display leading-none text-paper" style={{ fontSize: 'clamp(5rem, 22vw, 16rem)' }}>
          <span ref={countRef} className="tabular-nums">000</span>
          <span className="text-ink">%</span>
        </div>
        <div className="h-2 w-[min(420px,80vw)] overflow-hidden border-2 border-paper bg-ink">
          <div ref={barRef} className="h-full origin-left bg-pow" style={{ transform: 'scaleX(0)' }} />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-paper/80">{LINES[line]}…</p>
      </div>
    </div>
  );
}
