import { useEffect, useState, useCallback } from 'react';
import { Menu, X, Github, Linkedin, Twitter, FileText } from 'lucide-react';

const navLinks = [
  { label: 'ABOUT', href: '#about' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[70] transition-all duration-500 ${
          scrolled ? 'bg-deep-bg/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, '#hero')}
            className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-soft-white hover:text-sakura transition-colors duration-300"
          >
            SHIVANSH.TRIPATHI
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-ui text-sm font-semibold uppercase text-soft-white hover:text-sakura transition-colors duration-300 link-underline"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/Shiivu13"
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft-white hover:text-sakura transition-colors duration-300"
            >
              <Github size={20} />
            </a>
          </div>

          <button
            className="md:hidden text-soft-white hover:text-sakura transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-deep-bg/98 backdrop-blur-xl transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="font-heading text-2xl uppercase tracking-[0.1em] text-soft-white hover:text-sakura transition-all duration-300"
              style={{
                transitionDelay: mobileOpen ? `${i * 80}ms` : '0ms',
                transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: mobileOpen ? 1 : 0,
              }}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-6 mt-8">
            <a href="https://github.com/Shiivu13" target="_blank" rel="noopener noreferrer" className="text-soft-white hover:text-sakura transition-colors">
              <Github size={24} />
            </a>
            <a href="#" className="text-soft-white hover:text-sakura transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="#" className="text-soft-white hover:text-sakura transition-colors">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-soft-white hover:text-sakura transition-colors">
              <FileText size={24} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
