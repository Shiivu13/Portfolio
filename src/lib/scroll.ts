import type Lenis from 'lenis';

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Smooth-scroll to a section, going through Lenis when it is running. */
export function scrollToId(href: string) {
  const el = document.querySelector<HTMLElement>(href);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
