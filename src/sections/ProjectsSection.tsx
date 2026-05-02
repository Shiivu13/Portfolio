import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    if (!card || !image || !text) return;

    const ctx = gsap.context(() => {
      // 3D card deck animation
      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      cardTl.fromTo(
        card,
        {
          rotateX: 25,
          z: -200,
          scale: 0.8,
          opacity: 0,
        },
        {
          rotateX: 0,
          z: 0,
          scale: 1,
          opacity: 1,
          ease: 'none',
          duration: 0.5,
        },
        0
      );

      cardTl.to(
        card,
        {
          rotateX: -25,
          z: -200,
          scale: 0.8,
          opacity: 0,
          ease: 'none',
          duration: 0.5,
        },
        0.5
      );

      // Image parallax inside card
      gsap.fromTo(
        image,
        { yPercent: 15 },
        {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Text stagger when card is at center
      const textElements = text.querySelectorAll('.animate-in');
      gsap.from(textElements, {
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
        },
      });
    }, card);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="preserve-3d will-change-transform"
      style={{ marginBottom: '10vh' }}
    >
      <div className="bg-midnight/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-card border border-white/10 hover:border-sakura/30 transition-all duration-500">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Image */}
          <div className="md:col-span-5 overflow-hidden relative h-48 md:h-auto">
            <img
              ref={imageRef}
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover will-change-transform"
              style={{ filter: 'brightness(0.85)' }}
            />
            <div className="absolute inset-0 card-overlay-gradient" />
          </div>

          {/* Content */}
          <div ref={textRef} className="md:col-span-7 p-6 lg:p-8 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-ui text-[0.65rem] font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ background: 'rgba(244,168,180,0.15)', color: '#F4A8B4' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="animate-in font-heading font-medium text-soft-white text-xl lg:text-2xl mb-3">
              {project.title}
            </h3>

            <p className="animate-in font-body text-white/90 text-base leading-relaxed mb-6">
              {project.description}
            </p>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-in inline-flex items-center gap-2 font-ui text-sm font-semibold uppercase tracking-wider text-cyan hover:text-sakura transition-colors duration-300 link-underline w-fit"
            >
              VIEW ON GITHUB
              <ArrowUpRight size={16} />
            </a>
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
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-[12vh] px-6 lg:px-10"
    >
      <div className="max-w-[1200px] mx-auto">
        <div ref={headerRef} className="text-center mb-16 lg:mb-24">
          <div className="section-label mb-4">02 — PROJECTS</div>
          <h2
            className="font-heading font-semibold text-soft-white"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.2 }}
          >
            SELECTED WORK
          </h2>
        </div>

        <div className="perspective-container">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
