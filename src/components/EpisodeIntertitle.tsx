import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EpisodeIntertitleProps {
  /** Episode number, e.g. "01". */
  num: string;
  /** English title shown large. */
  title: string;
  /** Japanese subtitle / kanji. */
  kanji: string;
  /** Accent colour for the sweep + number. */
  accent: string;
}

/**
 * A full-width "act break" that drops between page sections. As it scrolls
 * through the viewport, a light bar sweeps across, the kanji slides in from the
 * right, the giant episode number counts in from the left, and the whole card
 * tilts slightly in 3D — the beat that makes the scroll feel episodic, like the
 * title card between scenes of an anime.
 */
export default function EpisodeIntertitle({ num, title, kanji, accent }: EpisodeIntertitleProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const kanjiRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 85%',
          end: 'bottom 15%',
          scrub: 1,
        },
      });

      tl.fromTo(
        numRef.current,
        { x: '-30vw', opacity: 0, rotateY: 40 },
        { x: '0vw', opacity: 1, rotateY: 0, ease: 'none' },
        0
      )
        .fromTo(
          kanjiRef.current,
          { x: '30vw', opacity: 0, rotateY: -40 },
          { x: '0vw', opacity: 1, rotateY: 0, ease: 'none' },
          0
        )
        .fromTo(
          labelRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: 'none' },
          0.1
        )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 30, letterSpacing: '0.6em' },
          { opacity: 1, y: 0, letterSpacing: '0.2em', ease: 'none' },
          0.15
        )
        .fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none' },
          0.05
        )
        .fromTo(
          sweepRef.current,
          { xPercent: -120 },
          { xPercent: 120, ease: 'none' },
          0
        )
        // ease the whole card back out as it leaves
        .to(
          [numRef.current, kanjiRef.current, titleRef.current, labelRef.current],
          { opacity: 0, ease: 'none' },
          0.85
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative h-[78vh] flex items-center justify-center overflow-hidden select-none"
      style={{ perspective: '1200px' }}
    >
      {/* sweeping light bar */}
      <div
        ref={sweepRef}
        className="absolute top-0 left-0 h-full w-[40%] opacity-30 blur-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 preserve-3d">
        <div
          ref={labelRef}
          className="font-ui text-xs tracking-[0.5em] text-white/50 mb-4"
        >
          EPISODE
        </div>

        <div className="flex items-end justify-center gap-5 lg:gap-8 preserve-3d">
          <div
            ref={numRef}
            className="font-broadcast leading-none will-change-transform"
            style={{
              fontSize: 'clamp(6rem, 24vw, 18rem)',
              color: accent,
              textShadow: `0 0 60px ${accent}66`,
            }}
          >
            {num}
          </div>
          <div
            ref={kanjiRef}
            className="font-jp leading-none text-white/85 will-change-transform mb-3"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 7rem)', writingMode: 'vertical-rl' }}
          >
            {kanji}
          </div>
        </div>

        <div
          ref={lineRef}
          className="h-px w-[min(70vw,520px)] my-6 origin-center"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />

        <div
          ref={titleRef}
          className="font-ui uppercase text-soft-white"
          style={{ fontSize: 'clamp(1rem, 3.5vw, 2rem)', letterSpacing: '0.2em' }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
