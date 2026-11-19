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
  let el = document.querySelector<HTMLElement>(href);
  if (!el) return;
  // Pinned sections sit inside a GSAP pin-spacer; measure that, since the
  // section itself is shifted while pinned.
  if (el.parentElement?.classList.contains('pin-spacer')) el = el.parentElement;
  if (lenis) {
    lenis.scrollTo(href === '#hero' ? 0 : el, { duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
