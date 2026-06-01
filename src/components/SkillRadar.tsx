import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Skill } from '../data/projects';
import { SKILL_CATEGORIES } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const SIZE = 360;
const C = SIZE / 2;
const R = 132;
const RINGS = [0.25, 0.5, 0.75, 1];

function polygon(values: number[], scale = 1) {
  const n = values.length;
  return values
    .map((v, i) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
      const r = R * (v / 100) * scale;
      return `${(C + r * Math.cos(a)).toFixed(1)},${(C + r * Math.sin(a)).toFixed(1)}`;
    })
    .join(' ');
}

/** Holographic "skill matrix" radar — animated decagon stat readout. */
export default function SkillRadar({ skills }: { skills: Skill[] }) {
  const rootRef = useRef<SVGSVGElement>(null);
  const valueRef = useRef<SVGPolygonElement>(null);
  const sweepRef = useRef<SVGGElement>(null);
  const dotsRef = useRef<SVGGElement>(null);

  const n = skills.length;
  const ringPolys = RINGS.map((rr) => polygon(skills.map(() => 100 * rr)));
  const valuePoly = polygon(skills.map((s) => s.level));

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (valueRef.current) {
        gsap.from(valueRef.current, {
          scale: 0,
          opacity: 0,
          transformOrigin: '50% 50%',
          svgOrigin: `${C} ${C}`,
          duration: 1.4,
          ease: 'elastic.out(1, 0.6)',
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      }
      if (dotsRef.current) {
        gsap.from(dotsRef.current.children, {
          scale: 0,
          opacity: 0,
          transformOrigin: '50% 50%',
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      }
      if (sweepRef.current && !reduce) {
        gsap.to(sweepRef.current, { rotation: 360, transformOrigin: `${C}px ${C}px`, duration: 6, ease: 'none', repeat: -1 });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={rootRef} viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[420px] mx-auto overflow-visible">
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4A8B4" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#7EC8E3" stopOpacity="0.18" />
        </radialGradient>
        <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7EC8E3" stopOpacity="0" />
          <stop offset="100%" stopColor="#7EC8E3" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* rotating radar sweep wedge */}
      <g ref={sweepRef}>
        <path d={`M ${C} ${C} L ${C} ${C - R} A ${R} ${R} 0 0 1 ${C + R * Math.cos(-Math.PI / 2 + 0.9)} ${C + R * Math.sin(-Math.PI / 2 + 0.9)} Z`} fill="url(#sweepGrad)" />
        <line x1={C} y1={C} x2={C} y2={C - R} stroke="#7EC8E3" strokeWidth="1" strokeOpacity="0.5" />
      </g>

      {/* grid rings */}
      {ringPolys.map((p, i) => (
        <polygon key={i} points={p} fill="none" stroke="#ffffff" strokeOpacity={i === RINGS.length - 1 ? 0.25 : 0.1} strokeWidth="1" />
      ))}

      {/* axis spokes + labels */}
      {skills.map((s, i) => {
        const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const x2 = C + R * Math.cos(a);
        const y2 = C + R * Math.sin(a);
        const lx = C + (R + 22) * Math.cos(a);
        const ly = C + (R + 22) * Math.sin(a);
        const accent = SKILL_CATEGORIES[s.category]?.accent ?? '#F4A8B4';
        return (
          <g key={s.short}>
            <line x1={C} y1={C} x2={x2} y2={y2} stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
            <text x={lx} y={ly} dy="0.35em" textAnchor="middle" className="font-ui" style={{ fontSize: 9, letterSpacing: '0.12em', fill: accent }}>
              {s.short}
            </text>
          </g>
        );
      })}

      {/* value polygon */}
      <polygon ref={valueRef} points={valuePoly} fill="url(#radarFill)" stroke="#F4A8B4" strokeWidth="1.5" strokeOpacity="0.9" style={{ filter: 'drop-shadow(0 0 8px rgba(244,168,180,0.5))' }} />

      {/* vertex dots */}
      <g ref={dotsRef}>
        {skills.map((s, i) => {
          const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
          const r = R * (s.level / 100);
          const accent = SKILL_CATEGORIES[s.category]?.accent ?? '#F4A8B4';
          return <circle key={s.short} cx={C + r * Math.cos(a)} cy={C + r * Math.sin(a)} r="3" fill={accent} style={{ filter: `drop-shadow(0 0 4px ${accent})` }} />;
        })}
      </g>

      {/* centre core */}
      <circle cx={C} cy={C} r="3" fill="#fff" fillOpacity="0.8" />
    </svg>
  );
}
