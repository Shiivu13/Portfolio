import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Github } from 'lucide-react';
import { projects, type Project } from '../data/projects';
import { companionSay } from '../lib/companion';

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <article
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') companionSay({ text: project.quip, pose: 'point', hold: 2600 });
      }}
      className="p-card group relative flex h-full w-full flex-col border-[3px] border-paper bg-ink-2 p-6 shadow-[10px_10px_0_#E10600] transition-[transform,box-shadow] duration-500 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 hover:shadow-[16px_18px_0_#E10600] md:p-8"
    >
      {/* Red bar that draws across the top on hover */}
      <span className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 bg-blood transition-transform duration-500 [transition-timing-function:cubic-bezier(.7,0,.2,1)] group-hover:scale-x-100" />

      <header className="relative flex items-start justify-between gap-4">
        <div className="relative font-display text-6xl leading-none md:text-7xl">
          <span className="text-outline-red">#{num}</span>
          {/* Solid copy revealed bottom-up on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-0 text-blood transition-[clip-path] duration-500 [clip-path:inset(100%_0_0_0)] [transition-timing-function:cubic-bezier(.7,0,.2,1)] group-hover:[clip-path:inset(0_0_0_0)]"
          >
            #{num}
          </span>
        </div>
        <div className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-paper/60">
          <div>{project.category}</div>
          <div className="text-blood">{project.year}</div>
        </div>
      </header>

      <h3 className="relative mt-6 font-display text-3xl uppercase leading-[0.95] text-paper md:text-4xl">
        <span className="bg-[linear-gradient(#E10600,#E10600)] bg-[length:0%_4px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 [transition-timing-function:cubic-bezier(.7,0,.2,1)] group-hover:bg-[length:100%_4px]">
          {project.title}
        </span>
      </h3>

      <p className="relative mt-4 flex-1 font-body text-sm leading-relaxed text-paper/70 transition-colors duration-500 group-hover:text-paper/90 md:text-base">
        {project.description}
      </p>

      <ul className="relative mt-6 flex flex-wrap gap-2">
        {project.tags.map((t, i) => (
          <li
            key={t}
            className="border-2 border-paper/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-paper transition-colors duration-300 group-hover:border-blood group-hover:bg-blood"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            {t}
          </li>
        ))}
      </ul>

      <div className="relative mt-8 flex items-center justify-between gap-3 border-t-2 border-paper/15 pt-5">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-paper"
        >
          <Github size={18} />
          <span className="slash-link relative z-0">Code</span>
        </a>
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/live relative inline-flex items-center gap-1.5 overflow-hidden border-2 border-paper px-3 py-1.5 font-display text-base uppercase tracking-wide text-paper transition-colors duration-300 hover:border-blood"
          >
            <span className="absolute inset-0 translate-y-full bg-blood transition-transform duration-300 group-hover/live:translate-y-0" />
            <span className="relative">{project.liveLabel ?? 'Live'}</span>
            <ArrowUpRight size={18} className="relative transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop: pin the section and drive the comic strip sideways.
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current!;
      const distance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(projects.length, Math.max(1, Math.round(self.progress * (projects.length - 1)) + 1));
            if (counterRef.current) counterRef.current.textContent = String(i).padStart(2, '0');
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      // Each card swings in as it enters the viewport.
      gsap.utils.toArray<HTMLElement>('.p-slot').forEach((slot, i) => {
        gsap.fromTo(
          slot,
          { rotate: i % 2 ? 6 : -6, y: 80, scale: 0.88 },
          {
            rotate: i % 2 ? 1.5 : -1.5,
            y: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: slot,
              containerAnimation: tween,
              start: 'left 100%',
              end: 'left 45%',
              scrub: true,
            },
          },
        );
      });

      gsap.fromTo(
        '.p-bigtitle',
        { xPercent: 0 },
        {
          xPercent: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, sectionRef);

    // Mobile / tablet: cards slide up one by one.
    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.p-slot').forEach((slot, i) => {
        gsap.from(slot, {
          y: 80,
          rotate: i % 2 ? 4 : -4,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: slot, start: 'top 88%' },
        });
      });
    }, sectionRef);

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative overflow-hidden bg-ink lg:h-screen">
      <div className="pointer-events-none absolute inset-0 halftone opacity-40" />

      {/* Header strip (fixed inside the pinned frame) */}
      <div className="relative z-10 flex items-end justify-between px-5 pt-24 md:px-10 lg:absolute lg:inset-x-0 lg:top-0 lg:pt-24">
        <div>
          <span className="tag-label">02 / Work</span>
          <p className="mt-3 max-w-sm font-body text-sm text-paper/60">
            Every one of these has a repo you can clone. The ones with a Live button have a demo running too.
          </p>
        </div>
        <div className="hidden items-center gap-4 lg:flex">
          <span className="font-display text-4xl tabular-nums text-paper">
            <span ref={counterRef}>01</span>
            <span className="text-paper/30"> / {String(projects.length).padStart(2, '0')}</span>
          </span>
          <div className="h-1 w-40 bg-paper/15">
            <div ref={barRef} className="h-full origin-left bg-blood" style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>
      </div>

      {/* Huge sliding title behind the cards */}
      <div
        aria-hidden="true"
        className="p-bigtitle pointer-events-none absolute bottom-[-4vh] left-0 hidden whitespace-nowrap font-display uppercase leading-none text-outline opacity-[0.12] lg:block"
        style={{ fontSize: '30vh' }}
      >
        Built and shipped · Built and shipped
      </div>

      <div
        ref={trackRef}
        className="relative z-10 flex flex-col gap-14 px-5 pb-28 pt-12 md:px-10 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-16 lg:px-[8vw] lg:pb-0 lg:pt-16"
      >
        {/* Intro panel */}
        <div className="flex shrink-0 flex-col justify-center lg:w-[38vw]">
          <h2 className="font-display uppercase leading-[0.85]" style={{ fontSize: 'clamp(3.5rem, 9vw, 9rem)' }}>
            Stuff
            <br />
            <span className="text-blood">I've built</span>
          </h2>
          <div className="mt-8 hidden items-center gap-3 font-comic text-2xl text-pow lg:flex">
            Keep scrolling, the cards go sideways
            <span className="inline-block animate-[wiggle_1s_ease-in-out_infinite]">→</span>
          </div>
        </div>

        {projects.map((p, i) => (
          <div key={p.id} className="p-slot shrink-0 lg:min-h-[62vh] lg:w-[min(440px,32vw)] lg:[&>article]:min-h-[62vh]">
            <ProjectCard project={p} index={i} />
          </div>
        ))}

        {/* Outro card */}
        <a
          href="https://github.com/Shiivu13"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="MORE"
          className="p-slot group flex shrink-0 flex-col items-center justify-center gap-4 border-4 border-dashed border-paper/30 p-10 text-center transition-colors duration-300 hover:border-blood hover:bg-blood lg:h-[64vh] lg:w-[320px]"
        >
          <span className="font-display text-5xl uppercase leading-none transition-transform duration-500 group-hover:scale-110">
            More on
            <br />
            GitHub
          </span>
          <ArrowUpRight size={48} className="transition-transform duration-500 group-hover:rotate-45" />
        </a>
      </div>
    </section>
  );
}
