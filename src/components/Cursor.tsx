import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type Mode = 'default' | 'link' | 'text';

/**
 * Custom cursor.
 * - A small red dot sits exactly on the pointer.
 * - A ring follows with a little lag and stretches in the direction of travel
 *   (squash and stretch), so fast flicks feel physical.
 * - Over links and buttons the ring fills red, grows, shows an arrow and is
 *   pulled toward the centre of the element (magnetic snap).
 * - Over text fields it turns into a text caret.
 * - Clicking fires a ring ripple.
 * Hidden until the pointer first moves and whenever it leaves the window.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const layer = layerRef.current!;
    document.documentElement.classList.add('has-cursor');

    const mouse = { x: -200, y: -200 };
    const pos = { x: -200, y: -200 };
    let visible = false;
    let mode: Mode = 'default';
    let target: HTMLElement | null = null;

    const setMode = (m: Mode) => {
      if (m === mode) return;
      mode = m;
      ring.dataset.mode = m;
      dot.dataset.mode = m;
    };
    setMode('default');
    ring.dataset.mode = 'default';

    const show = (on: boolean) => {
      if (on === visible) return;
      visible = on;
      layer.style.opacity = on ? '1' : '0';
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        // Jump straight to the pointer the first time instead of flying in from a corner.
        pos.x = mouse.x;
        pos.y = mouse.y;
        show(true);
      }
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      const field = el.closest<HTMLElement>('input, textarea, [contenteditable="true"]');
      const link = el.closest<HTMLElement>('a, button');
      if (field) {
        target = null;
        setMode('text');
      } else if (link) {
        target = link;
        setMode('link');
      } else {
        target = null;
        setMode('default');
      }
    };

    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) show(false);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      gsap.fromTo(ring, { '--press': 0.82 }, { '--press': 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      // Ripple
      const r = document.createElement('span');
      r.className = 'cursor-ripple';
      r.style.left = `${e.clientX}px`;
      r.style.top = `${e.clientY}px`;
      layer.appendChild(r);
      gsap.fromTo(
        r,
        { scale: 0.3, opacity: 0.9 },
        { scale: 2.6, opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => r.remove() },
      );
    };

    const tick = () => {
      // Magnetic pull toward the hovered element's centre.
      let tx = mouse.x;
      let ty = mouse.y;
      if (mode === 'link' && target) {
        const b = target.getBoundingClientRect();
        if (b.width < 360 && b.height < 200) {
          tx += (b.left + b.width / 2 - mouse.x) * 0.3;
          ty += (b.top + b.height / 2 - mouse.y) * 0.3;
        }
      }
      const dx = tx - pos.x;
      const dy = ty - pos.y;
      pos.x += dx * 0.2;
      pos.y += dy * 0.2;

      // Stretch along the direction of travel (only in the plain ring state,
      // so the arrow and caret never spin).
      const free = mode === 'default';
      const stretch = free ? Math.min(Math.hypot(dx, dy) / 90, 0.55) : 0;
      const angle = free ? (Math.atan2(dy, dx) * 180) / Math.PI : 0;

      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${angle}deg) scale(calc(${1 + stretch} * var(--press, 1)), calc(${1 - stretch * 0.6} * var(--press, 1)))`;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    };

    gsap.ticker.add(tick);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('mouseout', onOut);

    return () => {
      gsap.ticker.remove(tick);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('mouseout', onOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={layerRef} aria-hidden="true" className="cursor-layer" style={{ opacity: 0 }}>
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-ring-inner">
          <svg className="cursor-arrow" viewBox="0 0 24 24" width="22" height="22">
            <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
