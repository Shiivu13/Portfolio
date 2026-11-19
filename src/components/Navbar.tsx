import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToId } from '../lib/scroll';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const st = ScrollTrigger.create({
      start: 120,
      end: 'max',
      onUpdate: (self) => {
        gsap.to(nav, {
          yPercent: self.direction === 1 ? -120 : 0,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: true,
        });
      },
      onLeaveBack: () => gsap.to(nav, { yPercent: 0, duration: 0.3 }),
    });
    return () => st.kill();
  }, []);

  // Full-screen mobile menu.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      gsap.set(menu, { display: 'flex' });
      gsap.fromTo(
        menu,
        { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
        { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.6, ease: 'expo.inOut' },
      );
      gsap.fromTo(
        menu.querySelectorAll('.m-link'),
        { yPercent: 120, rotate: 6 },
        { yPercent: 0, rotate: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06, delay: 0.25 },
      );
    } else {
      gsap.to(menu, {
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        duration: 0.45,
        ease: 'expo.in',
        onComplete: () => {
          gsap.set(menu, { display: 'none' });
        },
      });
    }
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(href);
  };

  return (
    <>
      <nav ref={navRef} className="fixed inset-x-0 top-0 z-[70] px-5 py-4 md:px-10">
        <div className="flex items-center justify-between">
          <a
            href="#hero"
            onClick={go('#hero')}
            className="group flex items-center gap-3"
            aria-label="Back to top"
          >
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border-2 border-paper bg-blood transition-transform duration-500 group-hover:rotate-[360deg]">
              <span className="absolute inset-y-0 right-0 w-1/2 bg-ink" />
              <span className="relative font-display text-lg text-paper">ST</span>
            </span>
            <span className="hidden font-display text-xl uppercase tracking-wide sm:block">
              Shivansh<span className="text-blood">.</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 rounded-full border-2 border-paper/15 bg-ink/70 px-2 py-1.5 backdrop-blur-md md:flex">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={go(l.href)}
                className="roll-host group relative flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-paper/80 transition-colors hover:bg-blood hover:text-paper"
              >
                <span className="text-[10px] text-blood transition-colors group-hover:text-ink">0{i + 1}</span>
                <span className="roll">
                  <span>{l.label}</span>
                  <span>{l.label}</span>
                </span>
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="relative z-[80] grid h-12 w-12 place-items-center rounded-full border-2 border-paper bg-blood md:hidden"
          >
            <span
              className="absolute h-0.5 w-5 bg-paper transition-transform duration-300"
              style={{ transform: open ? 'rotate(45deg)' : 'translateY(-4px)' }}
            />
            <span
              className="absolute h-0.5 w-5 bg-paper transition-transform duration-300"
              style={{ transform: open ? 'rotate(-45deg)' : 'translateY(4px)' }}
            />
          </button>
        </div>
      </nav>

      <div
        ref={menuRef}
        className="fixed inset-0 z-[65] hidden flex-col justify-center gap-2 bg-blood px-8"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
      >
        <div className="absolute inset-0 halftone-ink opacity-40" />
        {links.map((l, i) => (
          <div key={l.href} className="relative overflow-hidden">
            <a
              href={l.href}
              onClick={go(l.href)}
              className="m-link block font-display text-[16vw] uppercase leading-[1.05] text-ink"
            >
              <span className="mr-3 align-top font-mono text-sm text-paper">0{i + 1}</span>
              {l.label}
            </a>
          </div>
        ))}
        <p className="relative mt-8 font-comic text-2xl text-paper">Where to?</p>
      </div>
    </>
  );
}
