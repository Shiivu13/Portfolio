import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import { scrollToId } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const FIRST = 'SHIVANSH'.split('');
const LAST = 'TRIPATHI'.split('');

export default function HeroSection({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const introPlayed = useRef(false);

  // Scroll-driven exit: name splits apart, red slash eats the screen.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.8,
        },
      });

      tl.to('.h-first', { xPercent: -35, ease: 'none' }, 0)
        .to('.h-last', { xPercent: 35, ease: 'none' }, 0)
        .to('.h-name', { scale: 1.15, ease: 'none' }, 0)
        .to('.h-fade', { opacity: 0, y: -40, ease: 'none', duration: 0.3 }, 0)
        .to('.h-emblem', { rotate: 540, scale: 0.4, opacity: 0, ease: 'none', duration: 0.6 }, 0)
        .to('.h-slash', { scaleY: 14, rotate: 0, ease: 'power2.in', duration: 0.7 }, 0.15)
        .to('.h-name', { opacity: 0, duration: 0.2 }, 0.6)
        .set('.h-outro', { visibility: 'visible' }, 0.64)
        .fromTo(
          '.h-outro span',
          { yPercent: 110, rotate: 8 },
          { yPercent: 0, rotate: 0, stagger: 0.05, duration: 0.3, ease: 'back.out(2)' },
          0.65,
        );
    }, sectionRef);

    return () => mm.revert();
  }, []);

  // Entrance once the preloader clears.
  useEffect(() => {
    if (!ready || introPlayed.current) return;
    introPlayed.current = true;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.h-slash', { scaleX: 0, duration: 1.1 })
        .from('.h-char', { yPercent: 120, rotate: 12, duration: 1, stagger: 0.035, clearProps: 'transform' }, '<0.15')
        .from('.h-emblem', { scale: 0, rotate: -180, duration: 1.2, ease: 'back.out(1.6)' }, '<0.2')
        .from('.h-bubble', { scale: 0, rotate: -20, transformOrigin: '0% 100%', duration: 0.7, ease: 'back.out(3)' }, '<0.4')
        .from('.h-meta', { y: 30, opacity: 0, duration: 0.8, stagger: 0.08 }, '<0.1');
    }, sectionRef);
    return () => ctx.revert();
  }, [ready]);

  // Pointer parallax on layers marked with data-depth.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-depth]')).map((node) => ({
      depth: Number(node.dataset.depth),
      x: gsap.quickTo(node, 'x', { duration: 1, ease: 'power3' }),
      y: gsap.quickTo(node, 'y', { duration: 1, ease: 'power3' }),
    }));
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => {
        l.x(nx * l.depth);
        l.y(ny * l.depth);
      });
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink">
      {/* Texture + red slash */}
      <div className="absolute inset-0 halftone opacity-60" />
      <div data-depth="-20" className="absolute inset-0">
        <div
          className="h-slash absolute left-[-20%] top-[37vh] h-[26vh] w-[140%] bg-blood"
          style={{ transform: 'rotate(-8deg)' }}
        >
          <div className="absolute inset-0 halftone-ink opacity-50" />
        </div>
      </div>

      {/* Outro text revealed when the slash fills the screen */}
      <div className="h-outro pointer-events-none invisible absolute inset-0 z-[5] flex items-center justify-center">
        <div className="flex flex-wrap justify-center gap-x-[0.25em] overflow-hidden px-6 font-display uppercase leading-none text-ink" style={{ fontSize: 'clamp(3rem, 11vw, 10rem)' }}>
          {['Enough', 'talk.'].map((w) => (
            <span key={w} className="inline-block">
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Top meta row */}
      <div className="h-fade absolute inset-x-0 top-24 z-10 flex justify-between px-5 md:top-28 md:px-10">
        <span className="h-meta tag-label">AI / ML · Backend · Open to work</span>
      </div>

      {/* Name */}
      <div className="h-name absolute inset-0 z-10 flex flex-col items-center justify-center">
        <h1 className="sr-only">Shivansh Tripathi, software engineer working on AI, ML and backend systems</h1>
        <div
          aria-hidden="true"
          className="h-first select-none overflow-hidden font-display uppercase leading-[0.86] text-paper"
          style={{ fontSize: 'clamp(4.2rem, 18.5vw, 19rem)' }}
          data-depth="12"
        >
          {FIRST.map((c, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <span className="h-char jump-letter">{c}</span>
            </span>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="h-last select-none overflow-hidden font-display uppercase leading-[0.86] text-outline"
          style={{ fontSize: 'clamp(4.2rem, 18.5vw, 19rem)' }}
          data-depth="24"
        >
          {LAST.map((c, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <span className="h-char jump-letter">{c}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Emblem */}
      <div
        data-depth="-40"
        className="absolute right-[4%] top-[13%] z-20 hidden md:block"
      >
        <div className="h-emblem">
        <div
          className="relative grid h-32 w-32 place-items-center rounded-full border-4 border-paper bg-blood shadow-[6px_6px_0_#0B0B0C] transition-transform duration-700 [transition-timing-function:cubic-bezier(.3,1.6,.4,1)] hover:rotate-[200deg] hover:scale-110 lg:h-40 lg:w-40"
          data-cursor="HEY!"
        >
          <span className="absolute inset-y-0 right-0 w-1/2 rounded-r-full bg-ink" />
          <span className="absolute h-[115%] w-2 rotate-[20deg] bg-paper" />
          <span className="relative font-display text-5xl text-paper lg:text-6xl">ST</span>
          <svg className="absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] animate-[spin-slow_14s_linear_infinite]" viewBox="0 0 200 200">
            <defs>
              <path id="circ" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
            </defs>
            <text className="fill-paper font-mono text-[11px] uppercase tracking-[0.3em]">
              <textPath href="#circ">· Code · Coffee · Debug · Repeat · Ship it</textPath>
            </text>
          </svg>
        </div>
        </div>
      </div>

      {/* Speech bubble */}
      <div data-depth="30" className="absolute left-[6%] top-[22%] z-20 -rotate-3 md:left-[10%] md:top-[20%]">
        <div className="h-bubble h-fade bubble px-4 py-2 text-base md:text-xl">
          Hi! I build AI that actually ships.
          <span className="block text-blood">…most of the time.</span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="h-fade absolute inset-x-0 bottom-0 z-20 flex flex-col gap-6 px-5 pb-8 md:flex-row md:items-end md:justify-between md:px-10 md:pb-10 md:pr-[170px]">
        <p className="h-meta max-w-md font-body text-base text-paper/80 md:text-lg">
          I'm a software engineer. Most of my work is <span className="text-paper">computer vision</span>,{' '}
          <span className="text-paper">LLM apps</span> and the FastAPI backends that keep them running.
        </p>
        <div className="h-meta flex items-center gap-4">
          <Magnetic>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('#projects');
              }}
              data-cursor="GO!"
              className="group relative inline-flex items-center gap-3 overflow-hidden border-[3px] border-paper bg-blood px-7 py-4 font-display text-lg uppercase tracking-wide text-paper shadow-[6px_6px_0_#F3EDE2] transition-[box-shadow,transform] duration-300 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#F3EDE2]"
            >
              <span className="absolute inset-0 -translate-x-full bg-ink transition-transform duration-500 [transition-timing-function:cubic-bezier(.7,0,.2,1)] group-hover:translate-x-0" />
              <span className="relative">See my work</span>
              <ArrowDownRight className="relative transition-transform duration-500 group-hover:rotate-[-45deg]" size={22} />
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="h-fade pointer-events-none absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/50">Scroll</span>
        <span className="relative h-12 w-[2px] overflow-hidden bg-paper/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.6s_ease-in-out_infinite] bg-blood" />
        </span>
      </div>
    </section>
  );
}
