import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import NoiseOverlay from './components/NoiseOverlay';
import SceneBackground from './components/SceneBackground';
import ThreeScene from './components/ThreeScene';
import CinematicOverlay from './components/CinematicOverlay';
import EpisodeIntertitle from './components/EpisodeIntertitle';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import ContactSection from './sections/ContactSection';
import { scrollState, bindPointer } from './lib/scrollStore';

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  { src: '/bg-hero.png', trigger: '#hero', zIndex: 1 },
  { src: '/bg-about.jpg', trigger: '#about', zIndex: 2 },
  { src: '/bg-projects.jpg', trigger: '#projects', zIndex: 3 },
  { src: '/bg-skills.jpg', trigger: '#skills', zIndex: 4 },
  { src: '/bg-contact.jpg', trigger: '#contact', zIndex: 5 },
];

const SECTION_IDS = ['#hero', '#about', '#projects', '#skills', '#contact'];

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    bindPointer();

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Feed scroll state into the WebGL scene + cinematic overlays every frame.
    const sectionEls = SECTION_IDS.map((id) => document.querySelector<HTMLElement>(id));
    const updateState = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      scrollState.progress = progress;

      const v = (lenis as unknown as { velocity?: number }).velocity ?? 0;
      scrollState.velocity = v;
      const targetSpeed = Math.min(1, Math.abs(v) / 38);
      scrollState.speed += (targetSpeed - scrollState.speed) * 0.12;

      // Nearest section to viewport centre = current "episode".
      const center = window.innerHeight / 2;
      let best = scrollState.section;
      let bestDist = Infinity;
      sectionEls.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const d = Math.abs(c - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      scrollState.section = best;
    };
    gsap.ticker.add(updateState);

    return () => {
      gsap.ticker.remove(updateState);
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="relative">
      {/* WebGL 3D depth world (behind scenery imagery, in front of nothing) */}
      <ThreeScene />

      {/* Scene Backgrounds */}
      {scenes.map((scene) => (
        <SceneBackground
          key={scene.trigger}
          src={scene.src}
          triggerId={scene.trigger}
          zIndex={scene.zIndex}
        />
      ))}

      {/* Noise + cinematic film layer */}
      <NoiseOverlay />
      <CinematicOverlay />

      {/* Navigation */}
      <Navbar />

      {/* Main Content with anime "episode" act-breaks between scenes */}
      <main className="relative z-10">
        <HeroSection />
        <EpisodeIntertitle num="01" title="The Story So Far" kanji="物語" accent="#7EC8E3" />
        <AboutSection />
        <EpisodeIntertitle num="02" title="Selected Work" kanji="作品" accent="#F4A8B4" />
        <ProjectsSection />
        <EpisodeIntertitle num="03" title="Tech Arsenal" kanji="武器" accent="#9D8DF1" />
        <SkillsSection />
        <EpisodeIntertitle num="04" title="The Invitation" kanji="招待" accent="#7EC8E3" />
        <ContactSection />
      </main>
    </div>
  );
}
