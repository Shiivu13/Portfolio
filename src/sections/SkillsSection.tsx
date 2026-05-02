import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

function SkillBar({ skill }: { skill: typeof skills[0] }) {
  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const fill = fillRef.current;
    const name = nameRef.current;
    const percent = percentRef.current;
    if (!bar || !fill || !name || !percent) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bar,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.from(name, {
        x: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
        .from(
          fill,
          {
            scaleX: 0,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        .from(
          percent,
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          '-=0.6'
        );

      // Animate percentage number
      const obj = { val: 0 };
      gsap.to(obj, {
        val: skill.level,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bar,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        onUpdate: () => {
          percent.textContent = `${Math.round(obj.val)}%`;
        },
      });
    }, bar);

    return () => ctx.revert();
  }, [skill.level]);

  return (
    <div ref={barRef} className="flex items-center gap-4 lg:gap-6 mb-5">
      <div ref={nameRef} className="w-[35%] lg:w-[30%] flex-shrink-0">
        <span className="font-ui text-xs lg:text-sm font-semibold uppercase tracking-wider text-soft-white truncate block">
          {skill.name}
        </span>
      </div>

      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          ref={fillRef}
          className="h-full bar-gradient rounded-full will-change-transform"
          style={{
            width: `${skill.level}%`,
            transformOrigin: 'left',
          }}
        />
      </div>

      <span
        ref={percentRef}
        className="font-ui text-sm text-white/60 w-12 text-right flex-shrink-0"
      >
        {skill.level}%
      </span>
    </div>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen flex items-center py-[12vh] px-6 lg:px-10"
    >
      <div className="max-w-[900px] mx-auto w-full">
        <div ref={headerRef} className="text-center mb-12 lg:mb-16">
          <div className="section-label mb-4">03 — SKILLS</div>
          <h2
            className="font-heading font-semibold text-soft-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.2 }}
          >
            TECH ARSENAL
          </h2>
        </div>

        <div className="space-y-2">
          {skills.map((skill) => (
            <SkillBar key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}
