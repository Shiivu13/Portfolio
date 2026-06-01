import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  Bot,
  ScanFace,
  Gauge,
  ShieldAlert,
  FileSearch,
  Film,
  NotebookPen,
  Network,
  MessagesSquare,
  type LucideIcon,
} from 'lucide-react';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, LucideIcon> = {
  bot: Bot,
  scan: ScanFace,
  gauge: Gauge,
  shield: ShieldAlert,
  search: FileSearch,
  film: Film,
  notebook: NotebookPen,
  agents: Network,
  qa: MessagesSquare,
};

/** Corner HUD bracket. */
function Bracket({ pos, color }: { pos: string; color: string }) {
  const base = 'absolute w-5 h-5 border-current pointer-events-none transition-all duration-500';
  const map: Record<string, string> = {
    tl: 'top-3 left-3 border-t-2 border-l-2',
    tr: 'top-3 right-3 border-t-2 border-r-2',
    bl: 'bottom-3 left-3 border-b-2 border-l-2',
    br: 'bottom-3 right-3 border-b-2 border-r-2',
  };
  return <span className={`${base} ${map[pos]}`} style={{ color }} />;
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const fileNo = String(index + 1).padStart(2, '0');
  const Icon = ICONS[project.icon] ?? Bot;

  useEffect(() => {
    const card = cardRef.current;
    const tilt = tiltRef.current;
    if (!card || !tilt) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Entrance: rise + slight 3D, stays readable (no fade-out on scroll-through).
      gsap.from(card, {
        y: 80,
        z: -160,
        rotateX: 12,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });

      // Continuous gentle float driven by scroll position for depth parallax.
      gsap.to(card, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, card);

    // Pointer-driven 3D tilt + glare (skipped when reduced motion).
    if (!reduce) {
      const rotX = gsap.quickTo(tilt, 'rotationX', { duration: 0.5, ease: 'power2.out' });
      const rotY = gsap.quickTo(tilt, 'rotationY', { duration: 0.5, ease: 'power2.out' });
      const onMove = (e: PointerEvent) => {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        rotY((px - 0.5) * 14);
        rotX(-(py - 0.5) * 12);
        if (glareRef.current) {
          glareRef.current.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, ${project.accent}33, transparent 60%)`;
        }
      };
      const onLeave = () => {
        rotX(0);
        rotY(0);
        if (glareRef.current) glareRef.current.style.background = 'transparent';
      };
      tilt.addEventListener('pointermove', onMove);
      tilt.addEventListener('pointerleave', onLeave);
      return () => {
        tilt.removeEventListener('pointermove', onMove);
        tilt.removeEventListener('pointerleave', onLeave);
        ctx.revert();
      };
    }

    return () => ctx.revert();
  }, [index, project.accent]);

  return (
    <div ref={cardRef} className="preserve-3d will-change-transform" style={{ marginBottom: '9vh' }}>
      <div
        ref={tiltRef}
        className="group relative preserve-3d will-change-transform rounded-2xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* glow aura */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-50 group-hover:opacity-100 blur-[2px] transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${project.accent}, transparent 55%, ${project.accent}55)` }}
        />

        <div
          className="relative rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all duration-500"
          style={{
            background: 'linear-gradient(160deg, rgba(28,26,58,0.92), rgba(16,15,36,0.96))',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
          }}
        >
          {/* glare follows cursor */}
          <div ref={glareRef} className="absolute inset-0 pointer-events-none z-20 transition-[background] duration-300" />

          {/* corner brackets */}
          <Bracket pos="tl" color={project.accent} />
          <Bracket pos="tr" color={project.accent} />
          <Bracket pos="bl" color={project.accent} />
          <Bracket pos="br" color={project.accent} />

          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* ---- Holographic poster panel (replaces the stock image) ---- */}
            <div
              className="md:col-span-5 relative overflow-hidden min-h-[210px] md:min-h-[300px]"
              style={{ background: `radial-gradient(120% 120% at 80% 0%, ${project.accent}2e, transparent 55%), linear-gradient(150deg, ${project.accent}1f, rgba(10,10,26,0.9))` }}
            >
              {/* faint real-image texture so it reads as art, not a photo */}
              <img
                src={project.image}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover opacity-[0.13] mix-blend-luminosity"
              />
              {/* tech grid */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />
              {/* giant ghosted file number */}
              <div
                className="absolute -bottom-6 -left-2 font-broadcast leading-none select-none"
                style={{ fontSize: 'clamp(7rem, 16vw, 12rem)', color: `${project.accent}1f` }}
              >
                {fileNo}
              </div>
              {/* kanji watermark */}
              <div
                className="absolute top-4 right-4 font-jp leading-none select-none"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', color: `${project.accent}40` }}
              >
                {project.kanji}
              </div>
              {/* central glowing icon medallion */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative flex items-center justify-center w-20 h-20 rounded-2xl border transition-transform duration-500 group-hover:scale-110"
                  style={{
                    borderColor: `${project.accent}66`,
                    background: `radial-gradient(circle, ${project.accent}26, transparent 70%)`,
                    boxShadow: `0 0 40px ${project.accent}40`,
                  }}
                >
                  <Icon size={34} style={{ color: project.accent }} />
                </div>
              </div>
              {/* scanline sweep on hover */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute left-0 w-full h-24 -translate-y-full group-hover:translate-y-[420%] transition-transform duration-[1400ms] ease-in-out"
                  style={{ background: `linear-gradient(180deg, transparent, ${project.accent}38, transparent)` }}
                />
              </div>
            </div>

            {/* ---- Content ---- */}
            <div className="md:col-span-7 p-6 lg:p-8 flex flex-col justify-center relative">
              {/* HUD header line */}
              <div className="flex items-center gap-3 mb-4 font-ui text-[0.6rem] tracking-[0.25em] text-white/45">
                <span style={{ color: project.accent }}>FILE {fileNo}</span>
                <span className="w-px h-3 bg-white/20" />
                <span>{project.category}</span>
                <span className="w-px h-3 bg-white/20" />
                <span>{project.year}</span>
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: project.accent }} />
                  <span className="text-white/40">ONLINE</span>
                </span>
              </div>

              <h3 className="font-heading font-medium text-soft-white text-xl lg:text-2xl mb-3 leading-snug">
                {project.title}
              </h3>

              <p className="font-body text-white/75 text-[0.95rem] leading-relaxed mb-6">
                {project.description}
              </p>

              {/* system tags */}
              <div className="flex flex-wrap gap-2 mb-7">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-ui text-[0.62rem] font-semibold tracking-wider px-2.5 py-1 rounded-md border"
                    style={{
                      borderColor: `${project.accent}33`,
                      background: `${project.accent}12`,
                      color: '#E9E4F5',
                    }}
                  >
                    <span style={{ color: project.accent }}>/</span> {tag}
                  </span>
                ))}
              </div>

              {/* premium button */}
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative inline-flex items-center gap-2.5 w-fit overflow-hidden rounded-full px-6 py-3 font-ui text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 border"
                style={{ borderColor: `${project.accent}66`, color: project.accent }}
              >
                {/* fill */}
                <span
                  className="absolute inset-0 -z-0 origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 ease-out"
                  style={{ background: `linear-gradient(90deg, ${project.accent}, #7EC8E3)` }}
                />
                <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-deep-bg">
                  ACCESS REPOSITORY
                </span>
                <ArrowUpRight
                  size={16}
                  className="relative z-10 transition-all duration-300 group-hover/btn:text-deep-bg group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
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
    <section id="projects" ref={sectionRef} className="relative py-[12vh] px-6 lg:px-10">
      <div className="max-w-[1200px] mx-auto">
        <div ref={headerRef} className="text-center mb-16 lg:mb-24">
          <div className="section-label mb-4">02 — PROJECTS · 作品集</div>
          <h2
            className="font-heading font-semibold text-soft-white"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.2 }}
          >
            CASE FILES
          </h2>
          <p className="font-ui text-xs tracking-[0.25em] text-white/40 mt-4">
            {projects.length} CLASSIFIED ENTRIES · SCROLL TO DECRYPT
          </p>
        </div>

        <div className="perspective-container" style={{ perspective: '1400px' }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
