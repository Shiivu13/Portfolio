import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SceneBackgroundProps {
  src: string;
  triggerId: string;
  zIndex: number;
}

export default function SceneBackground({ src, triggerId, zIndex }: SceneBackgroundProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: triggerId,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => gsap.to(el, { opacity: 1, duration: 1, ease: 'power2.out' }),
      onLeave: () => gsap.to(el, { opacity: 0, duration: 1, ease: 'power2.out' }),
      onEnterBack: () => gsap.to(el, { opacity: 1, duration: 1, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(el, { opacity: 0, duration: 1, ease: 'power2.out' }),
    });

    // Parallax effect
    const parallaxTween = gsap.to(el.querySelector('img'), {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: triggerId,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => {
      trigger.kill();
      parallaxTween.scrollTrigger?.kill();
    };
  }, [triggerId]);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 w-full h-full pointer-events-none will-change-transform"
      style={{ zIndex, opacity: 0 }}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover scale-110"
        style={{ filter: 'brightness(0.75) contrast(1.1)' }}
        loading="eager"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(26,26,62,0.4) 100%)' }}
      />
    </div>
  );
}
