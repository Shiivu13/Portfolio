# Shivansh Tripathi — Portfolio

Personal portfolio for Shivansh Tripathi, AI / ML and backend engineer.

A red-and-black comic style site with scroll-driven animation throughout:

- Intro loader with a slash-apart reveal
- Pinned hero where the name splits and a red slash takes over the screen
- Caution-tape marquees that react to scroll speed
- Word-by-word text reveal and a wipe-in portrait in the About section
- Horizontally scrolling project cards with 3D tilt and comic "POW" bursts on hover
- Segmented "power level" skill bars that fill as you scroll
- Custom cursor, magnetic buttons and a scroll-progress HP bar

Built with React 19, TypeScript, Vite, Tailwind CSS, GSAP (ScrollTrigger) and Lenis.
All motion respects `prefers-reduced-motion`.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Project and skill data live in `src/data/projects.ts`.
