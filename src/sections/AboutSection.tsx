import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const para1Ref = useRef<HTMLParagraphElement>(null);
  const para2Ref = useRef<HTMLParagraphElement>(null);
  const para3Ref = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline 3D swing-in
      gsap.from(headlineRef.current, {
        x: -80,
        rotateY: 25,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
        },
      });

      // Paragraphs stagger
      gsap.from([para1Ref.current, para2Ref.current, para3Ref.current], {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });

      // Label fade
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Portrait 3D entrance + tilt on scroll
      gsap.from(imageRef.current, {
        x: 100,
        rotateY: -30,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });

      // Continuous portrait tilt tied to scroll
      gsap.to(imageRef.current, {
        rotateY: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Stats stagger
      gsap.from(statsRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen flex items-center py-[12vh] px-6 lg:px-10"
      style={{ perspective: '1000px' }}
    >
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div ref={labelRef} className="section-label mb-4">
              01 — ABOUT
            </div>

            <h2
              ref={headlineRef}
              className="font-heading font-semibold text-soft-white mb-8 will-change-transform"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.2 }}
            >
              The Story So Far
            </h2>

            <div className="space-y-5 mb-10">
              <p ref={para1Ref} className="font-body text-lg text-white/90 leading-relaxed">
                Hi, I'm Shivansh, a software engineer who loves bridging the gap between cutting-edge AI and everyday applications. For me, it's not just about writing code; it's about building intelligent, production-ready systems that solve real-world problems.
              </p>
              <p ref={para2Ref} className="font-body text-lg text-white/90 leading-relaxed">
                My journey started with a simple curiosity about how machines perceive the world. Today, that curiosity fuels my work—whether I'm developing YOLO-powered surveillance pipelines, creating smart GenAI assistants, or architecting robust FastAPI backends on AWS.
              </p>
              <p ref={para3Ref} className="font-body text-lg text-white/90 leading-relaxed">
                I believe the best technology is powerful yet invisible. When I'm not fine-tuning models or optimizing Docker containers, you'll probably find me exploring the latest LLM frameworks and brainstorming my next big project.
              </p>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex flex-wrap gap-8 lg:gap-12">
              <div>
                <div className="font-ui text-2xl lg:text-3xl font-semibold text-sakura">6+</div>
                <div className="font-ui text-xs uppercase tracking-[0.12em] text-white/60 mt-1">Projects</div>
              </div>
              <div>
                <div className="font-ui text-2xl lg:text-3xl font-semibold text-sakura">3</div>
                <div className="font-ui text-xs uppercase tracking-[0.12em] text-white/60 mt-1">Years Exp</div>
              </div>
              <div>
                <div className="font-ui text-2xl lg:text-3xl font-semibold text-sakura">7</div>
                <div className="font-ui text-xs uppercase tracking-[0.12em] text-white/60 mt-1">Repos</div>
              </div>
            </div>
          </div>

          {/* Portrait Image */}
          <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8 flex justify-center lg:justify-end">
            <div
              ref={imageRef}
              className="relative w-full max-w-[400px] preserve-3d will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="rounded-2xl overflow-hidden shadow-card">
                <img
                  src="/avatar-shivansh.jpg"
                  alt="Shivansh Tripathi"
                  className="w-full h-auto object-cover"
                  style={{ filter: 'brightness(0.9)' }}
                />
              </div>
              {/* Decorative glow behind */}
              <div
                className="absolute -inset-4 rounded-2xl -z-10 opacity-40 blur-2xl"
                style={{ background: 'linear-gradient(135deg, #F4A8B4, #7EC8E3)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
