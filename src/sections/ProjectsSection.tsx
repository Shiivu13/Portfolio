import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Github } from 'lucide-react';
import { projects, type Project } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const BURSTS = ['POW!', 'BAM!', 'ZAP!', 'BOOM!', 'WHAM!', 'KRAK!', 'THWIP!'];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);

  const onMove = (e: RPointerEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: px * 14,
      rotateX: -py * 14,
      duration: 0.5,
      ease: 'power3.out',
      transformPerspective: 900,
    });
    el.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
    el.style.setProperty('--my', `${(py + 0.5) * 100}%`);
  };

  const onLeave = () => {
    setHover(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)' });
    }
  };

  const num = String(index + 1).padStart(2, '0');

  return (
    <article
      ref={cardRef}
      onPointerMove={onMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={onLeave}
      className="p-card panel group flex h-full w-full flex-col p-6 hover:shadow-[16px_16px_0_#E10600] md:p-8"
      data-cursor=""
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Spotlight following the pointer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(225,6,0,0.22), transparent 60%)',
        }}
      />

      {/* Burst */}
      <div
        className="burst pointer-events-none absolute -right-8 -top-10 z-20 grid h-28 w-28 place-items-center bg-pow md:h-32 md:w-32"
        style={{
          transform: hover ? 'scale(1) rotate(-12deg)' : 'scale(0) rotate(-90deg)',
          transition: 'transform .45s cubic-bezier(.3,1.8,.4,1)',
        }}
      >
        <span className="font-comic text-2xl text-blood md:text-3xl" style={{ WebkitTextStroke: '1px #0B0B0C' }}>
          {BURSTS[index % BURSTS.length]}
        </span>
      </div>

      <header className="relative flex items-start justify-between gap-4" style={{ transform: 'translateZ(30px)' }}>
        <div className="font-display text-6xl leading-none text-outline-red md:text-7xl">#{num}</div>
        <div className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-paper/60">
          <div>{project.category}</div>
          <div className="text-blood">{project.year}</div>
        </div>
      </header>

      <h3
        className="relative mt-6 font-display text-3xl uppercase leading-[0.95] text-paper md:text-4xl"
        style={{ transform: 'translateZ(50px)' }}
      >
        {project.title}
      </h3>

      <p className="relative mt-4 flex-1 font-body text-sm leading-relaxed text-paper/70 md:text-base" style={{ transform: 'translateZ(20px)' }}>
        {project.description}
      </p>

      <ul className="relative mt-6 flex flex-wrap gap-2" style={{ transform: 'translateZ(25px)' }}>
        {project.tags.map((t, i) => (
          <li
            key={t}
            className="border-2 border-paper/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-paper transition-colors duration-200 group-hover:border-blood"
            style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 1.5}deg)` }}
          >
            {t}
          </li>
        ))}
      </ul>

      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="CODE"
        className="relative mt-8 inline-flex items-center justify-between border-t-2 border-paper/15 pt-5 font-display text-lg uppercase tracking-wide text-paper"
        style={{ transform: 'translateZ(35px)' }}
      >
        <span className="flex items-center gap-2">
          <Github size={18} />
          <span className="slash-link relative z-0">View the code</span>
        </span>
        <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-paper transition-all duration-300 group-hover:rotate-45 group-hover:border-blood group-hover:bg-blood">
          <ArrowUpRight size={20} />
        </span>
      </a>
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
          <span className="tag-label">02 — Missions</span>
          <p className="mt-3 max-w-sm font-body text-sm text-paper/60">
            Things I built that work in production, plus one movie recommender I'm still proud of.
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
        Selected missions · Selected missions
      </div>

      <div
        ref={trackRef}
        className="relative z-10 flex flex-col gap-14 px-5 pb-28 pt-12 md:px-10 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-16 lg:px-[8vw] lg:pb-0 lg:pt-16"
      >
        {/* Intro panel */}
        <div className="flex shrink-0 flex-col justify-center lg:w-[38vw]">
          <h2 className="font-display uppercase leading-[0.85]" style={{ fontSize: 'clamp(3.5rem, 9vw, 9rem)' }}>
            Selected
            <br />
            <span className="text-blood">Missions</span>
          </h2>
          <div className="mt-8 hidden items-center gap-3 font-comic text-2xl text-pow lg:flex">
            Keep scrolling, the cards move sideways
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
