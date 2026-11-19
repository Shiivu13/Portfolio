import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Custom cursor: a red dot that tracks the pointer exactly, plus a ring that
 * trails behind. Hovering anything with [data-cursor="LABEL"] (or a link /
 * button) blows the ring up and prints the label inside it.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [active, setActive] = useState(false);
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  );

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-cursor');

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button');
      if (el) {
        setActive(true);
        setLabel(el.dataset.cursor ?? '');
      } else {
        setActive(false);
        setLabel('');
      }
    };

    const onDown = () => gsap.to(ring, { scale: 0.7, duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  const big = active && label;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] flex items-center justify-center rounded-full border-2 border-blood"
        style={{
          width: big ? 96 : active ? 64 : 40,
          height: big ? 96 : active ? 64 : 40,
          background: big ? 'var(--blood)' : active ? 'rgba(225,6,0,0.12)' : 'transparent',
          transition:
            'width .35s cubic-bezier(.2,.9,.3,1.3), height .35s cubic-bezier(.2,.9,.3,1.3), background .25s ease',
        }}
      >
        <span
          className="font-comic text-lg tracking-wider text-paper"
          style={{ opacity: big ? 1 : 0, transition: 'opacity .2s ease' }}
        >
          {label}
        </span>
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[201] h-2 w-2 rounded-full bg-blood"
        style={{ opacity: big ? 0 : 1 }}
      />
    </>
  );
}
