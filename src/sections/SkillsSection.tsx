import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills, SKILL_CATEGORIES } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const SEGMENTS = 20;

const TOOLBOX = [
  'YOLOv8', 'OpenCV', 'LightGBM', 'SHAP', 'Gemini', 'Whisper', 'FAISS', 'ChromaDB',
  'pgvector', 'Supabase', 'Celery', 'Redis', 'MongoDB', 'Ruby on Rails', 'Sidekiq', 'Streamlit',
];

const grouped = Object.entries(SKILL_CATEGORIES).map(([key, cat]) => ({
  key,
  name: cat.name,
  items: skills.filter((s) => s.category === key),
}));

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.s-head span', {
        yPercent: 110,
        stagger: 0.08,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.s-head', start: 'top 85%' },
      });

      // Spinning badge turns with scroll.
      gsap.to('.s-badge', {
        rotate: 360,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      // Segmented power bars fill as each row scrolls into view.
      gsap.utils.toArray<HTMLElement>('.s-row').forEach((row) => {
        const segs = row.querySelectorAll<HTMLElement>('.s-seg.on');
        const pct = row.querySelector<HTMLElement>('.s-pct');
        const target = Number(pct?.dataset.to ?? 0);
        const obj = { v: 0 };
        gsap
          .timeline({
            scrollTrigger: { trigger: row, start: 'top 88%', end: 'top 55%', scrub: 0.5 },
          })
          .fromTo(segs, { scaleY: 0, opacity: 0.2 }, { scaleY: 1, opacity: 1, stagger: 0.05, ease: 'none' }, 0)
          .to(
            obj,
            {
              v: target,
              ease: 'none',
              duration: segs.length * 0.05,
              onUpdate: () => {
                if (pct) pct.textContent = String(Math.round(obj.v));
              },
            },
            0,
          )
          .from(row.querySelector('.s-name'), { x: -30, opacity: 0, ease: 'none', duration: 0.4 }, 0);
      });

      gsap.from('.s-chip', {
        y: 40,
        opacity: 0,
        rotate: () => gsap.utils.random(-20, 20),
        stagger: 0.04,
        duration: 0.7,
        ease: 'back.out(2)',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.s-toolbox', start: 'top 85%' },
      });
    }, sectionRef);

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="relative overflow-x-clip bg-blood py-28 text-ink md:py-40">
      <div className="pointer-events-none absolute inset-0 halftone-ink opacity-40" />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-5 md:px-10 lg:grid-cols-12">
        {/* Left: sticky heading */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <span className="tag-label !text-ink/70 before:!bg-ink">03 / Skills</span>
            <h2 className="s-head mt-5 font-display uppercase leading-[0.85]" style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)' }}>
              <span className="block overflow-hidden"><span className="inline-block">Power</span></span>
              <span className="block overflow-hidden"><span className="inline-block text-paper">Levels.</span></span>
            </h2>
            <p className="mt-6 max-w-sm font-body text-lg text-ink/80">
              My own rough guess at each one. The projects above are the proof.
            </p>

            <div className="s-badge relative mt-12 hidden h-44 w-44 lg:block">
              <svg viewBox="0 0 200 200" className="h-full w-full">
                <defs>
                  <path id="skillcirc" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
                </defs>
                <circle cx="100" cy="100" r="98" className="fill-ink" />
                <text className="fill-paper font-display text-[19px] uppercase tracking-[0.18em]">
                  <textPath href="#skillcirc">AI · Backend · Cloud · Frontend ·</textPath>
                </text>
              </svg>
              <span className="absolute inset-0 grid place-items-center font-comic text-5xl text-pow">⚡</span>
            </div>
          </div>
        </div>

        {/* Right: power bars */}
        <div className="space-y-12 lg:col-span-7">
          {grouped.map((g) => (
            <div key={g.key}>
              <div className="mb-4 flex items-center gap-3 border-b-4 border-ink pb-2">
                <span className="font-display text-2xl uppercase tracking-wide">{g.name}</span>
              </div>
              <ul className="space-y-3">
                {g.items.map((s) => {
                  const on = Math.round((s.level / 100) * SEGMENTS);
                  return (
                    <li
                      key={s.name}
                      data-cursor={`${s.level}%`}
                      className="s-row group relative grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 overflow-hidden border-[3px] border-ink bg-ink px-4 py-3 text-paper shadow-[5px_5px_0_#0B0B0C] transition-[transform,box-shadow] duration-500 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] hover:translate-x-1.5 hover:shadow-[9px_5px_0_#0B0B0C] md:grid-cols-[minmax(0,220px)_1fr_auto]"
                    >
                      <span className="pointer-events-none absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 bg-pow transition-transform duration-500 group-hover:scale-y-100" />
                      <span className="s-name font-body text-sm font-semibold uppercase tracking-wide transition-colors duration-300 group-hover:text-pow md:text-base">{s.name}</span>
                      <span className="order-3 col-span-2 flex h-5 gap-[3px] md:order-none md:col-span-1">
                        {Array.from({ length: SEGMENTS }, (_, i) => (
                          <span
                            key={i}
                            className={`s-seg h-full flex-1 origin-bottom -skew-x-12 transition-colors duration-300 ${
                              i < on ? 'on bg-blood group-hover:bg-pow' : 'bg-paper/10'
                            }`}
                            style={i < on ? { transitionDelay: `${i * 18}ms` } : undefined}
                          />
                        ))}
                      </span>
                      <span className="font-display text-2xl tabular-nums">
                        <span className="s-pct" data-to={s.level}>{s.level}</span>
                        <span className="text-base text-blood">%</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="s-toolbox pt-4">
            <div className="mb-5 font-comic text-3xl">Other tools I use:</div>
            <div className="flex flex-wrap gap-3">
              {TOOLBOX.map((t) => (
                <span
                  key={t}
                  className="s-chip border-[3px] border-ink bg-paper px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink shadow-[3px_3px_0_#0B0B0C] transition-[transform,background-color] duration-300 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1 hover:bg-pow"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
