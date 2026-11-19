import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import ScrollHUD from './components/ScrollHUD';
import Marquee from './components/Marquee';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import ContactSection from './sections/ContactSection';
import { setLenis } from './lib/scroll';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Fonts change text metrics, so re-measure pins once they land.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const handleLoaded = useCallback(() => {
    setReady(true);
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="relative">
      <Preloader onDone={handleLoaded} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <ScrollHUD />

      <main className="relative">
        <HeroSection ready={ready} />

        <div className="relative z-20 -my-10 bg-transparent">
          <Marquee items={['AI Engineer', 'Backend Builder', 'Cloud Wrangler', 'Bug Slayer']} rotate={-3} variant="red" />
          <Marquee items={['Python', 'FastAPI', 'LLMs', 'Computer Vision', 'AWS', 'Docker']} direction={-1} rotate={2} variant="ink" />
        </div>

        <AboutSection />

        <Marquee items={['Selected work', 'Shipped', 'Battle tested']} rotate={-2} variant="pow" />

        <ProjectsSection />
        <SkillsSection />

        <Marquee items={["Let's talk", 'Open for work', "Let's build"]} direction={-1} rotate={2} variant="ink" />

        <ContactSection />
      </main>
    </div>
  );
}
