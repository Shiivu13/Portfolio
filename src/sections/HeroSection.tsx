import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(labelRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      })
        .from(
          line1Ref.current,
          {
            rotateX: 90,
            opacity: 0,
            y: 50,
            duration: 1.2,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        .from(
          line2Ref.current,
          {
            rotateX: 90,
            opacity: 0,
            y: 50,
            duration: 1.2,
            ease: 'power3.out',
          },
          '-=0.9'
        )
        .from(
          subRef.current,
          {
            opacity: 0,
            x: -30,
            duration: 1,
            ease: 'power2.out',
          },
          '-=0.6'
        )
        .from(
          ctaRef.current,
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
          },
          '-=0.5'
        );

      // Scroll exit animations
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 1,
        },
      });

      scrollTl
        .to(line1Ref.current, { y: '-15vh', rotateX: 20, opacity: 0 }, 0)
        .to(line2Ref.current, { y: '-15vh', rotateX: 20, opacity: 0 }, 0.1)
        .to(subRef.current, { y: '-10vh', opacity: 0 }, 0.1)
        .to(ctaRef.current, { y: '-10vh', opacity: 0 }, 0.15)
        .to(labelRef.current, { opacity: 0 }, 0);

      // Scroll indicator pulse
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-start px-6 lg:px-[8vw] overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      <div className="relative z-10 max-w-2xl preserve-3d">
        <div
          ref={labelRef}
          className="section-label mb-6"
        >
          SOFTWARE ENGINEER — AI / ML / BACKEND
        </div>

        <div className="preserve-3d mb-6">
          <h1
            ref={line1Ref}
            className="font-display font-bold uppercase tracking-[0.05em] text-soft-white will-change-transform"
            style={{
              fontSize: 'clamp(2rem, 10vw, 6.5rem)',
              textShadow: '0 4px 30px rgba(0,0,0,0.4)',
              lineHeight: 1.1,
            }}
          >
            CRAFTING
          </h1>
          <h1
            ref={line2Ref}
            className="font-display font-bold uppercase tracking-[0.05em] text-soft-white will-change-transform"
            style={{
              fontSize: 'clamp(2rem, 10vw, 6.5rem)',
              textShadow: '0 4px 30px rgba(0,0,0,0.4)',
              lineHeight: 1.1,
            }}
          >
            INTELLIGENCE
          </h1>
        </div>

        <p
          ref={subRef}
          className="font-body text-lg lg:text-xl text-white/90 max-w-[500px] mb-8 leading-relaxed"
        >
          Real-time vision systems · Fraud detection · GenAI evaluation platforms
        </p>

        <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            onClick={handleCtaClick}
            className="group/cta relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 font-ui font-semibold text-sm uppercase tracking-[0.14em] text-deep-bg shadow-glow transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 btn-gradient" />
            <span
              className="absolute inset-0 translate-x-[-120%] group-hover/cta:translate-x-[120%] transition-transform duration-700 ease-out"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)' }}
            />
            <span className="relative z-10">VIEW PROJECTS</span>
            <ChevronDown size={16} className="relative z-10 -rotate-90" />
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group/ghost relative inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 font-ui font-semibold text-sm uppercase tracking-[0.14em] text-soft-white/90 transition-all duration-300 hover:border-cyan hover:text-cyan"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            GET IN TOUCH
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-ui text-xs uppercase tracking-[0.15em] text-white/60">SCROLL</span>
        <ChevronDown size={20} className="text-white/60" />
      </div>
    </section>
  );
}
