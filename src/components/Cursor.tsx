import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Katana cursor.
 * - The pointer is a small katana; its tip is the hotspot.
 * - The blade swings slightly toward the direction you move.
 * - Moving fast leaves a red ink slash trail that tapers and fades.
 * - Clicking cuts a slash mark across the screen for half a second.
 * - Over links and buttons the blade turns into a ready stance and a glint
 *   runs along the edge.
 * - Text fields get the normal text cursor back.
 * Hidden until the first move, and whenever the pointer leaves the window.
 * Not used on touch screens or with reduced motion.
 */

const SIZE = 46; // rendered px
const TIP = 2 / 64; // tip position inside the 64-unit viewBox
const TRAIL_LIFE = 260; // ms
const SLASH_LIFE = 520; // ms

type Pt = { x: number; y: number; t: number };
type Slash = { x: number; y: number; a: number; len: number; t: number };

const BLOOD = '#E10600';
const PAPER = '#F3EDE2';

export default function Cursor() {
  const swordRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (!enabled) return;
    const sword = swordRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    document.documentElement.classList.add('has-cursor');

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const mouse = { x: -200, y: -200 };
    let visible = false;
    let ready = false; // hovering a link
    let swing = 0; // current tilt in degrees
    let press = 0; // extra rotation while clicking
    const trail: Pt[] = [];
    const slashes: Slash[] = [];
    let dirty = false;

    const show = (on: boolean) => {
      if (on === visible) return;
      visible = on;
      sword.style.opacity = on ? '1' : '0';
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      trail.push({ x: mouse.x, y: mouse.y, t: performance.now() });
      if (!visible) {
        trail.length = 0;
        show(true);
      }
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      const field = el.closest('input, textarea, [contenteditable="true"]');
      // Give text fields the real text cursor.
      sword.dataset.hidden = field ? 'true' : 'false';
      ready = Boolean(!field && el.closest('a, button'));
      sword.dataset.ready = ready ? 'true' : 'false';
    };

    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) show(false);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const p = { v: 0 };
      gsap.to(p, {
        v: 1,
        duration: 0.35,
        ease: 'power3.out',
        onUpdate: () => {
          press = Math.sin(p.v * Math.PI) * -38;
        },
      });
      slashes.push({
        x: e.clientX,
        y: e.clientY,
        a: (-35 + (Math.random() * 20 - 10)) * (Math.PI / 180),
        len: 110 + Math.random() * 40,
        t: performance.now(),
      });
    };

    /* Tapered ink stroke along the recent pointer path, newest last. */
    const drawTrail = (now: number) => {
      while (trail.length && now - trail[0].t > TRAIL_LIFE) trail.shift();
      if (trail.length < 2) return;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const passes: [string, number, number][] = [
        ['#0B0B0C', 1.35, 0.55], // dark rim so it reads on red
        [BLOOD, 1, 0.95],
        [PAPER, 0.25, 0.9], // bright core, like light on a blade
      ];
      for (const [color, widthK, alphaK] of passes) {
        ctx.strokeStyle = color;
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1];
          const b = trail[i];
          const dt = Math.max(1, b.t - a.t);
          const speed = Math.min(Math.hypot(b.x - a.x, b.y - a.y) / dt / 1.6, 1);
          if (speed < 0.15) continue;
          const life = 1 - (now - b.t) / TRAIL_LIFE;
          const w = 14 * speed * life * widthK;
          if (w < 0.4) continue;
          ctx.globalAlpha = alphaK * life;
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    /* Slash mark: drawn out fast, then thins and fades. */
    const drawSlashes = (now: number) => {
      for (let i = slashes.length - 1; i >= 0; i--) {
        const s = slashes[i];
        const age = (now - s.t) / SLASH_LIFE;
        if (age >= 1) {
          slashes.splice(i, 1);
          continue;
        }
        const grow = Math.min(1, age / 0.22);
        const fade = age < 0.35 ? 1 : 1 - (age - 0.35) / 0.65;
        const half = (s.len / 2) * grow;
        const dx = Math.cos(s.a);
        const dy = Math.sin(s.a);
        const x1 = s.x - dx * half;
        const y1 = s.y - dy * half;
        const x2 = s.x + dx * half;
        const y2 = s.y + dy * half;
        const nx = -dy;
        const ny = dx;
        const w = 7 * fade;

        // Leaf-shaped cut: pointed ends, widest in the middle.
        ctx.globalAlpha = fade;
        ctx.fillStyle = BLOOD;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(s.x + nx * w, s.y + ny * w, x2, y2);
        ctx.quadraticCurveTo(s.x - nx * w, s.y - ny * w, x1, y1);
        ctx.fill();
        ctx.fillStyle = PAPER;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(s.x + nx * w * 0.3, s.y + ny * w * 0.3, x2, y2);
        ctx.quadraticCurveTo(s.x - nx * w * 0.3, s.y - ny * w * 0.3, x1, y1);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    let lastX = mouse.x;
    const tick = () => {
      const now = performance.now();

      // Blade swings toward horizontal movement, settles when still.
      const vx = mouse.x - lastX;
      lastX = mouse.x;
      const target = gsap.utils.clamp(-28, 28, vx * 0.9);
      swing += (target - swing) * 0.18;

      const base = ready ? 32 : 0;
      const scale = ready ? 1.15 : 1;
      const o = SIZE * TIP;
      sword.style.transform = `translate3d(${mouse.x - o}px, ${mouse.y - o}px, 0) rotate(${base + swing + press}deg) scale(${scale})`;

      if (trail.length || slashes.length || dirty) {
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        drawTrail(now);
        drawSlashes(now);
        dirty = trail.length > 0 || slashes.length > 0;
      }
    };

    gsap.ticker.add(tick);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('mouseout', onOut);

    return () => {
      gsap.ticker.remove(tick);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('mouseout', onOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="katana-trail" />
      <div
        ref={swordRef}
        aria-hidden="true"
        className="katana"
        data-ready="false"
        data-hidden="false"
        style={{ width: SIZE, height: SIZE, opacity: 0, transformOrigin: `${SIZE * TIP}px ${SIZE * TIP}px` }}
      >
        <svg viewBox="0 0 64 64" width={SIZE} height={SIZE}>
          <defs>
            <linearGradient id="katana-steel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.55" stopColor="#D9D4CC" />
              <stop offset="1" stopColor="#9C978F" />
            </linearGradient>
            <linearGradient id="katana-glint" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="katana-blade-clip">
              <path d="M2 2 C 14 9, 27 21, 40 34 L 34 40 C 21 27, 9 14, 2 2 Z" />
            </clipPath>
          </defs>

          {/* blade */}
          <path
            d="M2 2 C 14 9, 27 21, 40 34 L 34 40 C 21 27, 9 14, 2 2 Z"
            fill="url(#katana-steel)"
            stroke="#0B0B0C"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* cutting edge */}
          <path d="M3.5 3.5 C 14 10.5, 26 22, 38.5 35" fill="none" stroke={BLOOD} strokeWidth="1.4" strokeLinecap="round" />
          {/* glint that runs along the blade in the ready stance */}
          <g clipPath="url(#katana-blade-clip)">
            <g className="katana-glint">
              <rect x="-6" y="-40" width="8" height="80" fill="url(#katana-glint)" transform="rotate(45)" />
            </g>
          </g>

          {/* guard (tsuba) */}
          <path d="M29 43 L43 29 L47 33 L33 47 Z" fill="#FFD60A" stroke="#0B0B0C" strokeWidth="2" strokeLinejoin="round" />

          {/* handle (tsuka) with wrap */}
          <path d="M38 44 L44 38 L60 54 L54 60 Z" fill={BLOOD} stroke="#0B0B0C" strokeWidth="2" strokeLinejoin="round" />
          <path d="M43 43 L46 46 M47 47 L50 50 M51 51 L54 54" stroke="#0B0B0C" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M41 45 L45 41 M45 49 L49 45 M49 53 L53 49" stroke={PAPER} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

          {/* pommel */}
          <circle cx="58" cy="58" r="3.4" fill="#0B0B0C" />
        </svg>
      </div>
    </>
  );
}
