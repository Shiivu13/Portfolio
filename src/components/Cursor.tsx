import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Glitch cursor.
 * Three stacked copies of an arrow pointer: a red and a yellow copy sit
 * behind the main cream one. The faster you move, the further the coloured
 * copies split apart and jitter (RGB-split glitch). Over links and buttons it
 * keeps glitching gently, and a click fires one big glitch.
 * Text fields keep the normal text cursor. Hidden until the first move and
 * whenever the pointer leaves the window. Not used on touch screens or with
 * reduced motion.
 */

const W = 30;
const H = 38;
const TIP = 2; // hotspot offset in px (the arrow tip)

const BLOOD = '#E10600';
const PAPER = '#F3EDE2';
const POW = '#FFD60A';
const INK = '#0B0B0C';

function Arrow({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <svg viewBox="0 0 32 40" width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      <path
        d="M2 2 L2 32 L10 25 L15 37 L21 34 L16 23 L27 23 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current!;
    const red = redRef.current!;
    const yellow = yellowRef.current!;
    document.documentElement.classList.add('has-cursor');

    const mouse = { x: -200, y: -200 };
    let lastX = mouse.x;
    let lastY = mouse.y;
    let speed = 0;
    let hit = 0;
    let link = false;
    let visible = false;

    const show = (on: boolean) => {
      if (on === visible) return;
      visible = on;
      root.style.opacity = on ? '1' : '0';
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        lastX = mouse.x;
        lastY = mouse.y;
        show(true);
      }
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      const field = el.closest('input, textarea, [contenteditable="true"]');
      root.dataset.hidden = field ? 'true' : 'false';
      link = Boolean(!field && el.closest('a, button'));
    };

    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) show(false);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hit = 1;
    };

    const rand = (n: number) => (Math.random() * 2 - 1) * n;

    const tick = () => {
      const v = Math.hypot(mouse.x - lastX, mouse.y - lastY);
      lastX = mouse.x;
      lastY = mouse.y;
      speed += (Math.min(v / 40, 1) - speed) * 0.3;
      hit += (0 - hit) * 0.1;

      const amt = speed * 14 + (link ? 4 : 0) + hit * 18;
      const j = amt * 0.5;
      red.style.transform = `translate(${-amt * 0.6 + rand(j)}px, ${rand(j) * 0.4}px)`;
      yellow.style.transform = `translate(${amt * 0.6 + rand(j)}px, ${rand(j) * 0.4}px)`;
      root.style.transform = `translate3d(${mouse.x - TIP}px, ${mouse.y - TIP}px, 0)`;
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
    <div ref={rootRef} aria-hidden="true" className="glitch-cursor" data-hidden="false" style={{ opacity: 0 }}>
      <div ref={redRef} className="glitch-layer glitch-screen">
        <Arrow fill={BLOOD} stroke={BLOOD} />
      </div>
      <div ref={yellowRef} className="glitch-layer glitch-screen">
        <Arrow fill={POW} stroke={POW} />
      </div>
      <div className="glitch-layer">
        <Arrow fill={PAPER} stroke={INK} />
      </div>
    </div>
  );
}
