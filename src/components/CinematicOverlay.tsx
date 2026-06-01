import { useEffect, useRef } from 'react';
import { scrollState, SECTION_THEMES } from '../lib/scrollStore';

/**
 * The "anime episode" film layer that sits on top of everything:
 *  - widescreen letterbox bars that snap wider during fast scrolls (action cut)
 *  - manga speed-lines that streak in proportion to scroll velocity
 *  - vignette + scanlines + a broadcast-style HUD (REC dot, timecode, episode)
 *  - a vertical episode scrubber on the right
 * Everything is driven from `scrollState` inside one rAF loop, so it never
 * triggers React re-renders while you scroll.
 */
export default function CinematicOverlay() {
  const barTopRef = useRef<HTMLDivElement>(null);
  const barBottomRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const epNameRef = useRef<HTMLSpanElement>(null);
  const epKanjiRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const recDotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let lastSection = -1;
    let blink = 0;

    const draw = () => {
      const { speed, progress, section } = scrollState;

      // --- letterbox bars: base 5.5vh, expand toward 12vh on fast scroll ---
      const base = 5.5;
      const extra = Math.min(speed, 1) * 6.5;
      const barH = base + extra;
      if (barTopRef.current) barTopRef.current.style.height = `${barH}vh`;
      if (barBottomRef.current) barBottomRef.current.style.height = `${barH}vh`;

      // --- manga speed-lines ---
      ctx.clearRect(0, 0, w, h);
      const intensity = Math.max(0, Math.min(1, (speed - 0.18) / 0.82));
      if (intensity > 0.01) {
        const cx = w / 2;
        const cy = h / 2;
        const lines = 70;
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < lines; i++) {
          const a = (i / lines) * Math.PI * 2 + (i % 2) * 0.04;
          const inner = Math.max(w, h) * (0.34 + (i % 5) * 0.02);
          const outer = Math.max(w, h) * 0.95;
          const lw = (0.6 + (i % 3)) * intensity;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
          ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
          ctx.lineWidth = lw;
          ctx.strokeStyle = `rgba(255,255,255,${0.16 * intensity})`;
          ctx.stroke();
        }
        ctx.restore();
      }

      // --- HUD timecode (fake film timecode from progress) ---
      if (timecodeRef.current) {
        const total = 23 * 60; // 23 minute "episode"
        const secs = Math.floor(progress * total);
        const mm = String(Math.floor(secs / 60)).padStart(2, '0');
        const ss = String(secs % 60).padStart(2, '0');
        const ff = String(Math.floor((blink * 24) % 24)).padStart(2, '0');
        timecodeRef.current.textContent = `${mm}:${ss}:${ff}`;
      }
      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${progress})`;
      }

      // --- episode label + scrubber on section change ---
      const sec = Math.min(section, SECTION_THEMES.length - 1);
      if (sec !== lastSection) {
        lastSection = sec;
        const theme = SECTION_THEMES[sec];
        if (epNameRef.current) epNameRef.current.textContent = theme.name;
        if (epKanjiRef.current) epKanjiRef.current.textContent = theme.kanji;
        if (nodesRef.current) {
          Array.from(nodesRef.current.children).forEach((node, i) => {
            const el = node as HTMLElement;
            const active = i === sec;
            el.style.background = active ? theme.accent : 'rgba(255,255,255,0.25)';
            el.style.transform = active ? 'scale(1.6)' : 'scale(1)';
            el.style.boxShadow = active ? `0 0 12px ${theme.accent}` : 'none';
          });
        }
        document.documentElement.style.setProperty('--episode-accent', theme.accent);
      }

      // --- REC dot blink ---
      blink += 0.016;
      if (recDotRef.current) {
        recDotRef.current.style.opacity = (Math.sin(blink * 4) > 0 ? 1 : 0.15).toString();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
      {/* Letterbox bars */}
      <div
        ref={barTopRef}
        className="absolute top-0 left-0 w-full bg-black"
        style={{ height: '5.5vh', boxShadow: '0 6px 24px rgba(0,0,0,0.6)' }}
      />
      <div
        ref={barBottomRef}
        className="absolute bottom-0 left-0 w-full bg-black"
        style={{ height: '5.5vh', boxShadow: '0 -6px 24px rgba(0,0,0,0.6)' }}
      />

      {/* Speed-lines canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Bottom-left broadcast HUD */}
      <div className="absolute left-5 flex items-center gap-3 font-ui text-[0.62rem] tracking-[0.25em] text-white/80"
           style={{ bottom: 'calc(5.5vh + 22px)' }}>
        <span ref={recDotRef} className="inline-block w-2 h-2 rounded-full bg-red-500" />
        <span>REC</span>
        <span ref={timecodeRef} className="tabular-nums text-white/60">00:00:00</span>
      </div>

      {/* Bottom-right episode label */}
      <div className="absolute right-5 flex items-center gap-3 font-ui text-[0.62rem] tracking-[0.3em] text-white/80"
           style={{ bottom: 'calc(5.5vh + 22px)' }}>
        <span ref={epKanjiRef} className="font-jp text-base leading-none" style={{ color: 'var(--episode-accent, #F4A8B4)' }}>
          到着
        </span>
        <span ref={epNameRef} className="text-white/70">ARRIVAL</span>
      </div>

      {/* Right-side episode scrubber */}
      <div
        ref={nodesRef}
        className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
      >
        {SECTION_THEMES.map((t, i) => (
          <div
            key={t.name}
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: i === 0 ? t.accent : 'rgba(255,255,255,0.25)',
              transform: i === 0 ? 'scale(1.6)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Bottom progress bar (above bottom bar) */}
      <div className="absolute left-0 right-0" style={{ bottom: 'calc(5.5vh + 10px)' }}>
        <div className="mx-5 h-px bg-white/15 overflow-hidden">
          <div
            ref={progressFillRef}
            className="h-full origin-left"
            style={{
              transform: 'scaleX(0)',
              background:
                'linear-gradient(90deg, var(--episode-accent, #F4A8B4), #7EC8E3)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
