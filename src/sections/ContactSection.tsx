import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, ArrowUpRight, Copy, Check } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import { scrollToId } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const EMAIL = 'shiivu13@gmail.com';

const LINKS = [
  { label: 'GitHub', value: '@Shiivu13', href: 'https://github.com/Shiivu13' },
  { label: 'LinkedIn', value: 'Shivansh Tripathi', href: 'https://www.linkedin.com/in/shivansh-tripathi-725584207/' },
  { label: 'Phone', value: '+91 90267 54020', href: 'tel:+919026754020' },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Giant headline zooms in from behind as you arrive.
      gsap.fromTo(
        '.c-big',
        { scale: 1.8, opacity: 0.1, letterSpacing: '0.2em' },
        {
          scale: 1,
          opacity: 1,
          letterSpacing: '0em',
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'top 15%', scrub: 0.6 },
        },
      );
      gsap.from('.c-big .c-char', {
        yPercent: 60,
        rotate: () => gsap.utils.random(-25, 25),
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 20%', scrub: 0.6 },
      });

      gsap.from('.c-row', {
        x: -60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.c-rows', start: 'top 85%' },
      });

      gsap.from('.c-cta', {
        scale: 0,
        rotate: -120,
        duration: 1.1,
        ease: 'back.out(1.8)',
        scrollTrigger: { trigger: '.c-cta', start: 'top 90%' },
      });

      gsap.fromTo(
        '.c-footname',
        { yPercent: 60 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.c-footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      );
    }, sectionRef);
    return () => mm.revert();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="relative overflow-hidden bg-ink pt-28 md:pt-40">
      <div className="pointer-events-none absolute inset-0 halftone opacity-40" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <span className="tag-label">04 — Contact</span>
        <p className="mt-4 font-comic text-2xl text-pow md:text-3xl">Got a mission? I've got a keyboard.</p>

        <h2
          className="c-big mt-6 origin-left select-none font-display uppercase leading-[0.82]"
          style={{ fontSize: 'clamp(4.5rem, 19vw, 20rem)' }}
          aria-label="Let's talk"
        >
          <span aria-hidden="true" className="block">
            {"LET'S".split('').map((c, i) => (
              <span key={i} className="c-char inline-block"><span className="jump-letter">{c}</span></span>
            ))}
          </span>
          <span aria-hidden="true" className="block text-blood">
            {'TALK'.split('').map((c, i) => (
              <span key={i} className="c-char inline-block"><span className="jump-letter">{c}</span></span>
            ))}
            <span className="c-char inline-block text-paper"><span className="jump-letter">.</span></span>
          </span>
        </h2>

        <div className="mt-16 grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          {/* Contact rows */}
          <div className="c-rows lg:col-span-7">
            <button
              type="button"
              onClick={copyEmail}
              data-cursor={copied ? 'NICE!' : 'COPY'}
              className="c-row group flex w-full items-center justify-between gap-4 border-y-2 border-paper/15 py-6 text-left"
            >
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50">Email</div>
                <div className="mt-1 break-all font-display text-3xl uppercase md:text-5xl">
                  <span className="slash-link relative z-0">{EMAIL}</span>
                </div>
              </div>
              <span
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 ${
                  copied ? 'border-pow bg-pow text-ink' : 'border-paper group-hover:border-blood group-hover:bg-blood'
                }`}
              >
                {copied ? <Check size={22} /> : <Copy size={20} />}
              </span>
            </button>

            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="c-row group flex items-center justify-between gap-4 border-b-2 border-paper/15 py-6"
              >
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50">{l.label}</div>
                  <div className="mt-1 font-display text-2xl uppercase transition-transform duration-500 group-hover:translate-x-3 md:text-4xl">
                    <span className="slash-link relative z-0">{l.value}</span>
                  </div>
                </div>
                <ArrowUpRight
                  size={36}
                  className="shrink-0 text-paper/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-blood"
                />
              </a>
            ))}

            <p
              className="mt-6 font-comic text-xl text-pow transition-opacity duration-300"
              style={{ opacity: copied ? 1 : 0 }}
              aria-live="polite"
            >
              {copied ? 'Copied to clipboard. Look at you, being efficient.' : ''}
            </p>
          </div>

          {/* Big magnetic CTA */}
          <div className="flex justify-center lg:col-span-5">
            <Magnetic strength={0.45}>
              <a
                href={`mailto:${EMAIL}`}
                data-cursor="SEND"
                className="c-cta group relative grid h-60 w-60 place-items-center rounded-full border-4 border-paper bg-blood shadow-[10px_10px_0_#F3EDE2] transition-shadow duration-300 hover:shadow-[4px_4px_0_#F3EDE2] md:h-72 md:w-72"
              >
                <svg
                  className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] animate-[spin-slow_12s_linear_infinite] group-hover:[animation-duration:3s]"
                  viewBox="0 0 200 200"
                >
                  <defs>
                    <path id="ctacirc" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
                  </defs>
                  <text className="fill-paper font-mono text-[12px] uppercase tracking-[0.32em]">
                    <textPath href="#ctacirc">Open for work · Freelance · Full-time ·</textPath>
                  </text>
                </svg>
                <span className="relative text-center font-display text-4xl uppercase leading-none text-paper transition-transform duration-500 group-hover:scale-110 md:text-5xl">
                  Say
                  <br />
                  hi!
                </span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="c-footer relative mt-28 overflow-hidden border-t-4 border-blood">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
            © {new Date().getFullYear()} Shivansh Tripathi · No fourth walls were harmed.
          </p>
          <button
            type="button"
            onClick={() => scrollToId('#hero')}
            data-cursor="UP!"
            className="group inline-flex items-center gap-2 self-start font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70 hover:text-blood md:self-auto"
          >
            Back to top
            <ArrowUp size={16} className="transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </div>
        <div
          aria-hidden="true"
          className="c-footname select-none whitespace-nowrap text-center font-display uppercase leading-[0.78] text-outline-red"
          style={{ fontSize: '17.5vw' }}
        >
          Shivansh
        </div>
      </footer>
    </section>
  );
}
