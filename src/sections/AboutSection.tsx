import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PARAGRAPHS = [
  "Hi, I'm Shivansh. I'm a software engineer, and most of what I build sits between an AI model and the people who end up using it. I care a lot about whether the thing runs outside my laptop. A model that only works in a notebook doesn't help anyone.",
  'I got into this because I wanted to know how a computer could look at a photo and tell what was in it. That turned into YOLO surveillance pipelines, then GenAI assistants, then a lot of FastAPI services on AWS.',
  "When I'm not training models or trimming Docker images, I'm usually trying some new LLM framework and half-planning the next project.",
];

const STATS = [
  { value: 10, suffix: '+', label: 'Projects built', color: 'bg-blood text-paper', rot: -6 },
  { value: 3, suffix: '', label: 'Years building', color: 'bg-pow text-ink', rot: 4 },
  { value: 100, suffix: '%', label: 'Caffeine powered', color: 'bg-ink text-paper', rot: -3 },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Heading words slam in.
      gsap.from('.a-head span', {
        yPercent: 110,
        rotate: 6,
        stagger: 0.08,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.a-head', start: 'top 85%' },
      });

      // Paragraph words light up as you scroll past them.
      gsap.utils.toArray<HTMLElement>('.a-para').forEach((p) => {
        gsap.fromTo(
          p.querySelectorAll('.a-word'),
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: { trigger: p, start: 'top 85%', end: 'bottom 55%', scrub: true },
          },
        );
      });

      // Portrait panel wipes open and drifts with scroll.
      gsap.fromTo(
        '.a-portrait',
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          ease: 'none',
          scrollTrigger: { trigger: '.a-portrait-wrap', start: 'top 85%', end: 'top 30%', scrub: 0.6 },
        },
      );
      gsap.fromTo(
        '.a-portrait img',
        { scale: 1.35, yPercent: -8 },
        {
          scale: 1.05,
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: '.a-portrait-wrap', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
      gsap.fromTo(
        '.a-caption',
        { x: -60, rotate: -12, opacity: 0 },
        {
          x: 0,
          rotate: -4,
          opacity: 1,
          ease: 'back.out(2)',
          duration: 0.8,
          scrollTrigger: { trigger: '.a-portrait-wrap', start: 'top 45%' },
        },
      );

      // Big background word slides sideways.
      gsap.fromTo(
        '.a-bgword',
        { xPercent: 10 },
        {
          xPercent: -30,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );

      // Stickers pop + count up.
      gsap.from('.a-stat', {
        scale: 0,
        rotate: -30,
        stagger: 0.12,
        duration: 0.8,
        ease: 'back.out(2.2)',
        scrollTrigger: { trigger: '.a-stats', start: 'top 85%' },
      });
    }, sectionRef);

    // Count-up always runs (it's content, not decoration).
    const counters = gsap.utils.toArray<HTMLElement>('.a-count');
    const triggers = counters.map((el) => {
      const target = Number(el.dataset.to);
      const obj = { v: 0 };
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: 'power3.out',
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
          }),
      });
    });

    return () => {
      mm.revert();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-x-clip bg-paper py-28 text-ink md:py-40">
      <div className="pointer-events-none absolute inset-0 halftone-ink opacity-30" />
      <div
        aria-hidden="true"
        className="a-bgword pointer-events-none absolute -top-6 left-0 whitespace-nowrap font-display uppercase leading-none text-ink/[0.06]"
        style={{ fontSize: 'clamp(8rem, 28vw, 30rem)' }}
      >
        Origin Story Origin
      </div>

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
        {/* Portrait */}
        <div className="a-portrait-wrap relative mx-auto w-full max-w-[460px] self-start lg:sticky lg:top-28 lg:col-span-5 lg:mx-0">
          <div className="absolute -right-4 -top-4 z-20 rotate-12 bg-blood px-3 py-1 font-comic text-xl text-paper shadow-[3px_3px_0_#0B0B0C]">
            Issue #01
          </div>
          <div
            className="a-portrait group relative aspect-[4/5] overflow-hidden border-4 border-ink bg-ink shadow-[12px_12px_0_#E10600]"
            data-cursor="HI!"
          >
            <img
              src="/avatar-shivansh.jpg"
              alt="Portrait of Shivansh Tripathi"
              loading="lazy"
              className="h-full w-full object-cover grayscale contrast-125 transition-[filter] duration-700 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-blood mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
            <div className="absolute inset-0 halftone-ink opacity-40 mix-blend-multiply" />
          </div>
          <div className="a-caption absolute -bottom-8 -left-3 z-20 max-w-[78%] border-[3px] border-ink bg-pow px-4 py-2 font-comic text-lg leading-tight shadow-[4px_4px_0_#0B0B0C] md:text-xl">
            Fig. 1: the suspect. Armed with Python and too many browser tabs.
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-7 lg:pl-10">
          <span className="tag-label !text-ink/60">01 / About</span>
          <h2
            className="a-head mt-5 font-display uppercase leading-[0.9]"
            style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)' }}
          >
            {['The', 'origin', 'story.'].map((w, i) => (
              <span key={w} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                <span className={`inline-block ${i === 2 ? 'text-blood' : ''}`}>{w}</span>
              </span>
            ))}
          </h2>

          <div className="mt-10 space-y-7">
            {PARAGRAPHS.map((p, i) => (
              <p key={i} className="a-para max-w-2xl font-body text-lg leading-relaxed md:text-2xl md:leading-snug">
                {p.split(' ').map((w, j) => (
                  <span key={j} className="a-word">
                    {w}{' '}
                  </span>
                ))}
              </p>
            ))}
          </div>

          <div className="a-stats mt-16 flex flex-wrap gap-6">
            {STATS.map((s) => (
              <div
                key={s.label}
                className={`a-stat group relative grid h-36 w-36 place-items-center rounded-full border-4 border-ink text-center shadow-[5px_5px_0_#0B0B0C] md:h-40 md:w-40 ${s.color}`}
                style={{ transform: `rotate(${s.rot}deg)` }}
              >
                <div className="transition-transform duration-300 group-hover:animate-[wiggle_0.5s_ease-in-out]">
                  <div className="font-display text-5xl leading-none">
                    <span className="a-count tabular-nums" data-to={s.value}>
                      0
                    </span>
                    {s.suffix}
                  </div>
                  <div className="mt-1 px-4 font-mono text-[10px] uppercase leading-tight tracking-[0.18em]">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
