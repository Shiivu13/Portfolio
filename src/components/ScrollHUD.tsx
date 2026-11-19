import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const QUIPS: Record<string, string> = {
  hero: "Scroll down, there's more.",
  about: 'Origin story. Short, I promise.',
  projects: 'The part recruiters actually read.',
  skills: 'Power levels. Mostly honest.',
  contact: 'You made it to the bottom. Say hi?',
};

/** Health-bar scroll progress (bottom left) + a quip bubble that changes per section. */
export default function ScrollHUD() {
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState('hero');

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const p = self.progress;
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
        if (pctRef.current) pctRef.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
      },
    });

    const triggers = Object.keys(QUIPS).map((id) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 55%',
        end: 'bottom 55%',
        // Measure after the pinned sections have added their spacing.
        refreshPriority: -1,
        onToggle: (self) => self.isActive && setSection(id),
      }),
    );

    return () => {
      st.kill();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    if (!bubbleRef.current) return;
    gsap.fromTo(
      bubbleRef.current,
      { scale: 0.4, rotate: -12, opacity: 0 },
      { scale: 1, rotate: -3, opacity: 1, duration: 0.6, ease: 'back.out(2.4)' },
    );
  }, [section]);

  return (
    <>
      {/* HP bar */}
      <div
        className="pointer-events-none fixed bottom-5 left-5 z-[60] hidden items-center gap-3 rounded-full border-2 border-paper/15 bg-ink/85 px-4 py-2 backdrop-blur-md transition-opacity duration-300 md:flex"
        style={{ opacity: section === 'hero' ? 0 : 1 }}
      >
        <span className="font-comic text-xl text-pow">HP</span>
        <div className="relative h-3.5 w-36 skew-x-[-18deg] border-2 border-paper bg-ink">
          <div ref={fillRef} className="h-full origin-left bg-blood" style={{ transform: 'scaleX(0)' }} />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 15px, #0B0B0C 15px 18px)',
            }}
          />
        </div>
        <span ref={pctRef} className="font-mono text-xs tabular-nums text-paper/70">000</span>
      </div>

      {/* Quip */}
      <div
        className="pointer-events-none fixed bottom-8 right-5 z-[60] hidden transition-opacity duration-300 lg:block"
        style={{ opacity: section === 'hero' ? 0 : 1 }}
      >
        <div ref={bubbleRef} className="bubble max-w-[210px] px-3.5 py-2.5 text-base leading-tight">
          {QUIPS[section]}
        </div>
      </div>
    </>
  );
}
