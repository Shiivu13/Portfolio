import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills, SKILL_CATEGORIES } from '../data/projects';
import SkillRadar from '../components/SkillRadar';

gsap.registerPlugin(ScrollTrigger);

const SEGMENTS = 22;

function SkillMeter({ skill, accent }: { skill: typeof skills[0]; accent: string }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const lit = Math.round((skill.level / 100) * SEGMENTS);

  useEffect(() => {
    const row = rowRef.current;
    const percent = percentRef.current;
    if (!row || !percent) return;

    const ctx = gsap.context(() => {
      const segs = row.querySelectorAll<HTMLElement>('[data-lit="1"]');
      gsap.from(segs, {
        scaleY: 0,
        opacity: 0,
        transformOrigin: 'bottom',
        duration: 0.4,
        stagger: 0.025,
        ease: 'power2.out',
        scrollTrigger: { trigger: row, start: 'top 90%', toggleActions: 'play none none reverse' },
      });

      const obj = { v: 0 };
      gsap.to(obj, {
        v: skill.level,
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: row, start: 'top 90%', toggleActions: 'play none none reverse' },
        onUpdate: () => {
          percent.textContent = `${Math.round(obj.v)}`;
        },
      });
    }, row);

    return () => ctx.revert();
  }, [skill.level]);

  return (
    <div ref={rowRef} className="group/skill mb-4">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-ui text-xs font-semibold tracking-wider text-soft-white/90 group-hover/skill:text-white transition-colors">
          {skill.name}
        </span>
        <span className="font-broadcast text-base leading-none" style={{ color: accent }}>
          <span ref={percentRef}>{skill.level}</span>
          <span className="text-white/30 text-[0.7em]">%</span>
        </span>
      </div>
      <div className="flex gap-[3px] h-3.5 items-stretch">
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const isLit = i < lit;
          return (
            <span
              key={i}
              data-lit={isLit ? '1' : '0'}
              className="flex-1 rounded-[1px] will-change-transform"
              style={{
                background: isLit ? accent : 'rgba(255,255,255,0.07)',
                boxShadow: isLit ? `0 0 6px ${accent}77` : 'none',
                opacity: isLit ? 0.92 : 1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const syncRef = useRef<HTMLSpanElement>(null);

  // average skill = "synchronisation rate" (anime stat flavour)
  const sync = Math.round(skills.reduce((a, s) => a + s.level, 0) / skills.length);

  // group skills by category, preserving SKILL_CATEGORIES order
  const grouped = Object.keys(SKILL_CATEGORIES).map((key) => ({
    key,
    cat: SKILL_CATEGORIES[key],
    items: skills.filter((s) => s.category === key),
  }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      });

      const obj = { v: 0 };
      gsap.to(obj, {
        v: sync,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none reverse' },
        onUpdate: () => {
          if (syncRef.current) syncRef.current.textContent = `${Math.round(obj.v)}`;
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [sync]);

  return (
    <section id="skills" ref={sectionRef} className="relative min-h-screen flex items-center py-[12vh] px-6 lg:px-10">
      <div className="max-w-[1200px] mx-auto w-full">
        <div ref={headerRef} className="text-center mb-12 lg:mb-16">
          <div className="section-label mb-4">03 — SKILLS · 武器</div>
          <h2 className="font-heading font-semibold text-soft-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.2 }}>
            TECH ARSENAL
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ---- Radar HUD panel ---- */}
          <div className="lg:col-span-5">
            <div
              className="relative rounded-2xl border border-white/10 p-6 lg:p-8"
              style={{ background: 'radial-gradient(120% 120% at 50% 0%, rgba(244,168,180,0.08), rgba(13,13,30,0.6))', backdropFilter: 'blur(10px)' }}
            >
              {/* corner brackets */}
              <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan/60" />
              <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan/60" />
              <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan/60" />
              <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-cyan/60" />

              <div className="flex items-center justify-between mb-2 font-ui text-[0.6rem] tracking-[0.25em] text-white/45">
                <span>SKILL MATRIX</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                  ANALYSIS COMPLETE
                </span>
              </div>

              <SkillRadar skills={skills} />

              {/* sync rate */}
              <div className="mt-2 flex items-end justify-center gap-3">
                <div className="text-center">
                  <div className="font-ui text-[0.58rem] tracking-[0.3em] text-white/45 mb-1">SYNC RATE</div>
                  <div className="font-broadcast leading-none text-soft-white" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)' }}>
                    <span ref={syncRef}>{sync}</span>
                    <span className="text-cyan text-[0.5em]">.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Category power meters ---- */}
          <div className="lg:col-span-7 space-y-8">
            {grouped.map((g) => (
              <div key={g.key}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-jp text-2xl leading-none" style={{ color: g.cat.accent }}>
                    {g.cat.kanji}
                  </span>
                  <span className="font-ui text-xs font-semibold tracking-[0.2em] text-white/70">{g.cat.name}</span>
                  <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${g.cat.accent}55, transparent)` }} />
                  <span className="font-ui text-[0.6rem] text-white/35 tracking-widest">{g.items.length} MODULES</span>
                </div>
                {g.items.map((skill) => (
                  <SkillMeter key={skill.name} skill={skill} accent={g.cat.accent} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
