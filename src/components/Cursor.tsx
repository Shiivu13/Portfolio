import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Custom cursor: a red dot that tracks the pointer exactly, plus a ring that
 * trails behind. Over a link or button the ring swells into a disc that
 * inverts whatever is under it.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
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
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, input');
      setActive(Boolean(el));
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

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] rounded-full border-[1.5px] border-paper mix-blend-difference"
        style={{
          width: active ? 64 : 34,
          height: active ? 64 : 34,
          background: active ? 'var(--paper)' : 'transparent',
          transition:
            'width .45s cubic-bezier(.2,.8,.2,1), height .45s cubic-bezier(.2,.8,.2,1), background-color .3s ease',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[201] h-1.5 w-1.5 rounded-full bg-blood"
        style={{ opacity: active ? 0 : 1, transition: 'opacity .2s ease' }}
      />
    </>
  );
}
