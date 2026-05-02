import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Twitter, FileText, Mail, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/Shiivu13' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/shivansh-tripathi-725584207/' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: FileText, label: 'Resume', href: '#' },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline 3D entrance
      gsap.from(headlineRef.current, {
        y: 60,
        rotateX: 20,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Subtext + email
      gsap.from([subtextRef.current, emailRef.current, phoneRef.current], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });

      // Social links stagger
      const socialIcons = socialsRef.current?.children || [];
      gsap.from(socialIcons, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: socialsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      // Footer fade
      gsap.from(footerRef.current, {
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 95%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-[80vh] flex flex-col items-center justify-center py-[12vh] px-6 lg:px-10"
      style={{ perspective: '1000px' }}
    >
      <div className="max-w-[800px] mx-auto text-center">
        <h2
          ref={headlineRef}
          className="font-display font-bold uppercase tracking-[0.05em] text-soft-white mb-6 will-change-transform"
          style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            lineHeight: 1.2,
            textShadow: '0 4px 30px rgba(0,0,0,0.4)',
          }}
        >
          LET'S BUILD SOMETHING EXTRAORDINARY
        </h2>

        <p
          ref={subtextRef}
          className="font-body text-lg lg:text-xl text-white/90 mb-8 max-w-[600px] mx-auto leading-relaxed"
        >
          Open for collaborations, freelance projects, and full-time opportunities in AI/ML engineering.
        </p>

        <a
          ref={emailRef}
          href="mailto:shiivu13@gmail.com"
          className="inline-flex items-center gap-3 font-heading font-medium text-sakura hover:text-cyan transition-colors duration-300 mb-4"
          style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
        >
          <Mail size={24} />
          shiivu13@gmail.com
        </a>

        <div
          ref={phoneRef}
          className="flex items-center justify-center gap-3 font-body text-white/60 mb-10"
        >
          <Phone size={18} />
          <span>+91 9026754020</span>
        </div>

        <div ref={socialsRef} className="flex items-center justify-center gap-6 mb-16">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href !== '#' ? '_blank' : undefined}
              rel={link.href !== '#' ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-2 font-ui text-sm font-semibold uppercase tracking-wider text-white/60 hover:text-soft-white transition-colors duration-300"
              aria-label={link.label}
            >
              <link.icon size={20} />
              <span className="hidden sm:inline">{link.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        className="absolute bottom-8 left-0 right-0 text-center px-6"
      >
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="h-px bg-white/10 mb-6" />
          <p className="font-ui text-xs uppercase tracking-[0.15em] text-white/40">
            &copy; 2026 SHIVANSH TRIPATHI. CRAFTED WITH CODE AND CURIOSITY.
          </p>
        </div>
      </div>
    </section>
  );
}
