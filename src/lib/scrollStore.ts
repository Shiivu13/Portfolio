// Lightweight global store that bridges Lenis scroll state into the WebGL
// scene and the cinematic overlays. Updated every frame in App, read inside
// requestAnimationFrame loops — so we keep it as a plain mutable object to
// avoid React re-renders on every scroll tick.

export interface ScrollState {
  /** Normalised page scroll progress, 0 (top) → 1 (bottom). */
  progress: number;
  /** Instantaneous scroll velocity reported by Lenis (px/frame-ish). */
  velocity: number;
  /** Smoothed absolute velocity, 0 → ~1, used to drive speed-lines. */
  speed: number;
  /** Index of the section currently closest to the viewport centre. */
  section: number;
  /** Pointer position, normalised to -1 → 1 on both axes. */
  pointerX: number;
  pointerY: number;
}

export const scrollState: ScrollState = {
  progress: 0,
  velocity: 0,
  speed: 0,
  section: 0,
  pointerX: 0,
  pointerY: 0,
};

// Accent palette per "episode" — drives the 3D fog/petal tint and HUD colour.
export const SECTION_THEMES = [
  { name: 'ARRIVAL', kanji: '到着', accent: '#F4A8B4', fog: '#1A1A3E' },
  { name: 'THE STORY', kanji: '物語', accent: '#7EC8E3', fog: '#171732' },
  { name: 'SELECTED WORK', kanji: '作品', accent: '#F4A8B4', fog: '#1d1530' },
  { name: 'TECH ARSENAL', kanji: '武器', accent: '#9D8DF1', fog: '#13132b' },
  { name: 'THE INVITATION', kanji: '招待', accent: '#7EC8E3', fog: '#1A1A3E' },
] as const;

let pointerBound = false;
export function bindPointer() {
  if (pointerBound || typeof window === 'undefined') return;
  pointerBound = true;
  window.addEventListener('pointermove', (e) => {
    scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    scrollState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });
}
