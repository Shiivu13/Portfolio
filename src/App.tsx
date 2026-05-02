import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import NoiseOverlay from './components/NoiseOverlay';
import SceneBackground from './components/SceneBackground';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import ContactSection from './sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  { src: '/bg-hero.png', trigger: '#hero', zIndex: 1 },
  { src: '/bg-about.jpg', trigger: '#about', zIndex: 2 },
  { src: '/bg-projects.jpg', trigger: '#projects', zIndex: 3 },
  { src: '/bg-skills.jpg', trigger: '#skills', zIndex: 4 },
  { src: '/bg-contact.jpg', trigger: '#contact', zIndex: 5 },
];

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="relative">
      {/* Scene Backgrounds */}
      {scenes.map((scene) => (
        <SceneBackground
          key={scene.trigger}
          src={scene.src}
          triggerId={scene.trigger}
          zIndex={scene.zIndex}
        />
      ))}

      {/* Noise Overlay */}
      <NoiseOverlay />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </div>
  );
}
