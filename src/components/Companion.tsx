import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onCompanionSay, type Pose, type SayDetail } from '../lib/companion';

gsap.registerPlugin(ScrollTrigger);

const SECTION_LINES: Record<string, SayDetail> = {
  hero: { text: "Hey! I'm Bit. I live here. Scroll down, I'll show you around.", pose: 'wave', hold: 4200 },
  about: { text: 'That terminal actually works. Type help in it.', pose: 'think', hold: 4000 },
  projects: { text: 'The good stuff. Hover a card and I will tell you about it.', pose: 'point', hold: 3800 },
  skills: { text: 'Power levels! Mostly honest ones.', pose: 'flex', hold: 3400 },
  contact: { text: 'You made it to the end. Go on, say hi.', pose: 'cheer', hold: 4200 },
};

const POKES = [
  'Hey, that tickles.',
  'I run on Python and coffee. Mostly coffee.',
  "Careful, I'm still in beta.",
  'Beep boop. Sorry, force of habit.',
  'Ten more clicks and I unlock a secret. Not really.',
  'Have you tried turning me off and on again?',
];

/**
 * Bit, the robot sidekick. Sits in the bottom-right corner, follows the
 * pointer with its eyes, leans and runs when you scroll fast, strikes a pose
 * for each section and reacts when you hover projects or poke it.
 */
export default function Companion({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState('');
  const hideTimer = useRef<number | undefined>(undefined);
  const poseTl = useRef<gsap.core.Timeline | null>(null);
  const reduce = useRef(false);

  const q = useCallback((sel: string) => svgRef.current?.querySelector<SVGElement>(sel) ?? null, []);

  /* ---------- poses ---------- */
  const strike = useCallback((pose: Pose = 'idle') => {
    const armL = q('.b-armL');
    const armR = q('.b-armR');
    const head = q('.b-head');
    const pupils = q('.b-pupils');
    const happy = q('.b-happy');
    const eyes = q('.b-eyes');
    const mouthO = q('.b-mouthO');
    const smile = q('.b-smile');
    const body = q('.b-whole');
    if (!armL || !armR || !head || !body) return;

    poseTl.current?.kill();
    const tl = gsap.timeline();
    poseTl.current = tl;

    const faceHappy = (on: boolean) => {
      tl.set(happy, { opacity: on ? 1 : 0 }, 0).set(eyes, { opacity: on ? 0 : 1 }, 0);
    };
    const mouth = (open: boolean) => {
      tl.set(mouthO, { opacity: open ? 1 : 0 }, 0).set(smile, { opacity: open ? 0 : 1 }, 0);
    };

    const d = reduce.current ? 0 : 1;
    tl.to([armL, armR, head], { rotate: 0, duration: 0.3 * d, ease: 'power2.out' }, 0);
    tl.to(pupils, { x: 0, y: 0, duration: 0.3 * d }, 0);

    switch (pose) {
      case 'wave':
        faceHappy(true);
        mouth(true);
        tl.to(armR, { rotate: -150, duration: 0.35 * d, ease: 'back.out(2)' }, 0)
          .to(armR, { rotate: -115, duration: 0.22 * d, yoyo: true, repeat: reduce.current ? 0 : 5, ease: 'sine.inOut' })
          .to(armR, { rotate: 0, duration: 0.4 * d, ease: 'power2.inOut' });
        tl.to(head, { rotate: -6, duration: 0.4 * d, yoyo: true, repeat: 1 }, 0);
        tl.add(() => {
          faceHappyNow(false);
        });
        break;
      case 'think':
        mouth(false);
        tl.to(armR, { rotate: -125, duration: 0.45 * d, ease: 'back.out(1.6)' }, 0)
          .to(head, { rotate: 8, duration: 0.5 * d, ease: 'sine.inOut' }, 0)
          .to(pupils, { x: 3, y: -4, duration: 0.4 * d }, 0)
          .to(armR, { rotate: 0, duration: 0.5 * d, ease: 'power2.inOut' }, 2.6 * d)
          .to(head, { rotate: 0, duration: 0.5 * d }, 2.6 * d);
        break;
      case 'point':
        mouth(true);
        tl.to(armL, { rotate: 95, duration: 0.35 * d, ease: 'back.out(2.4)' }, 0)
          .to(head, { rotate: -8, duration: 0.35 * d }, 0)
          .to(armL, { rotate: 85, duration: 0.18 * d, yoyo: true, repeat: reduce.current ? 0 : 3 }, 0.35 * d)
          .to(armL, { rotate: 0, duration: 0.45 * d, ease: 'power2.inOut' }, 2.4 * d)
          .to(head, { rotate: 0, duration: 0.45 * d }, 2.4 * d);
        tl.add(() => mouthNow(false), 2.4 * d);
        break;
      case 'flex':
        faceHappy(true);
        tl.to(armL, { rotate: 140, duration: 0.3 * d, ease: 'back.out(2)' }, 0)
          .to(armR, { rotate: -140, duration: 0.3 * d, ease: 'back.out(2)' }, 0)
          .to(body, { scale: 1.08, duration: 0.18 * d, yoyo: true, repeat: reduce.current ? 0 : 5 }, 0.3 * d)
          .to([armL, armR], { rotate: 0, duration: 0.45 * d, ease: 'power2.inOut' }, 2.2 * d);
        tl.add(() => faceHappyNow(false), 2.2 * d);
        break;
      case 'cheer':
        faceHappy(true);
        mouth(true);
        tl.to(armL, { rotate: 150, duration: 0.3 * d, ease: 'back.out(2)' }, 0)
          .to(armR, { rotate: -150, duration: 0.3 * d, ease: 'back.out(2)' }, 0)
          .to(body, { y: -26, duration: 0.28 * d, ease: 'power2.out', yoyo: true, repeat: reduce.current ? 0 : 3 }, 0.1 * d)
          .to([armL, armR], { rotate: 0, duration: 0.5 * d, ease: 'power2.inOut' }, 2.4 * d);
        tl.add(() => {
          faceHappyNow(false);
          mouthNow(false);
        }, 2.4 * d);
        break;
      case 'look':
        tl.to(head, { rotate: -10, duration: 0.3 * d, yoyo: true, repeat: 1 }, 0);
        break;
      default:
        faceHappy(false);
        mouth(false);
    }

    function faceHappyNow(on: boolean) {
      gsap.set(happy, { opacity: on ? 1 : 0 });
      gsap.set(eyes, { opacity: on ? 0 : 1 });
    }
    function mouthNow(open: boolean) {
      gsap.set(mouthO, { opacity: open ? 1 : 0 });
      gsap.set(smile, { opacity: open ? 0 : 1 });
    }
  }, [q]);

  /* ---------- talking ---------- */
  const say = useCallback(
    ({ text, pose, hold = 3200 }: SayDetail) => {
      setLine(text);
      if (pose) strike(pose);
      const b = bubbleRef.current;
      if (b) {
        gsap.killTweensOf(b);
        gsap.fromTo(
          b,
          { scale: 0.5, opacity: 0, y: 10 },
          { scale: 1, opacity: 1, y: 0, duration: reduce.current ? 0 : 0.45, ease: 'back.out(2.2)' },
        );
      }
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => {
        if (bubbleRef.current) gsap.to(bubbleRef.current, { opacity: 0, scale: 0.8, duration: 0.25 });
      }, hold);
    },
    [strike],
  );

  useEffect(() => onCompanionSay(say), [say]);

  /* ---------- idle life: breathing, blinking, antenna ---------- */
  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = rootRef.current;
    if (!root) return;
    gsap.set(root, { yPercent: 160 });

    // Pivot points in SVG user space (shoulders, hips, neck, feet).
    const origins: Record<string, string> = {
      '.b-lean': '80 192',
      '.b-whole': '80 120',
      '.b-legL': '68 150',
      '.b-legR': '92 150',
      '.b-armL': '50 112',
      '.b-armR': '110 112',
      '.b-head': '80 100',
      '.b-antenna': '80 30',
      '.b-scarf': '100 110',
    };
    Object.entries(origins).forEach(([sel, o]) => {
      const el = q(sel);
      if (el) gsap.set(el, { svgOrigin: o });
    });
    if (reduce.current) return;

    const ctx = gsap.context(() => {
      gsap.to('.b-torso', { scaleY: 1.03, transformOrigin: '50% 100%', duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.b-head', { y: 2, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.b-antenna', { rotate: 10, duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.b-bulb', { opacity: 0.35, duration: 0.7, yoyo: true, repeat: -1, ease: 'steps(1)' });
      gsap.to('.b-chest', { fill: '#E10600', duration: 0.9, yoyo: true, repeat: -1, ease: 'steps(1)' });

      const blink = () => {
        gsap
          .timeline({ onComplete: () => void gsap.delayedCall(gsap.utils.random(2.2, 5), blink) })
          .to('.b-eyes', { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.07 })
          .to('.b-eyes', { scaleY: 1, duration: 0.1 });
      };
      gsap.delayedCall(2, blink);
    }, svgRef);

    return () => ctx.revert();
  }, [q]);

  /* ---------- entrance once the loader clears ---------- */
  useEffect(() => {
    if (!ready || !rootRef.current) return;
    gsap.to(rootRef.current, {
      yPercent: 0,
      duration: reduce.current ? 0 : 1.1,
      delay: reduce.current ? 0 : 0.9,
      ease: 'bounce.out',
      onComplete: () => say(SECTION_LINES.hero),
    });
  }, [ready, say]);

  /* ---------- eyes follow the pointer ---------- */
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const pupils = q('.b-pupils');
    if (!pupils) return;
    const px = gsap.quickTo(pupils, 'x', { duration: 0.35, ease: 'power3' });
    const py = gsap.quickTo(pupils, 'y', { duration: 0.35, ease: 'power3' });
    const move = (e: PointerEvent) => {
      const r = svgRef.current?.getBoundingClientRect();
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.33;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const len = Math.hypot(dx, dy) || 1;
      px((dx / len) * Math.min(5, len / 40));
      py((dy / len) * Math.min(5, len / 40));
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [q]);

  /* ---------- scroll: lean, run, react per section ---------- */
  useEffect(() => {
    if (reduce.current) return;
    const whole = q('.b-lean');
    const legL = q('.b-legL');
    const legR = q('.b-legR');
    const scarf = q('.b-scarf');
    if (!whole || !legL || !legR || !scarf) return;

    const run = gsap
      .timeline({ paused: true, repeat: -1 })
      .to(legL, { rotate: 28, duration: 0.12, ease: 'sine.inOut' }, 0)
      .to(legR, { rotate: -28, duration: 0.12, ease: 'sine.inOut' }, 0)
      .to(legL, { rotate: -28, duration: 0.24, ease: 'sine.inOut' }, 0.12)
      .to(legR, { rotate: 28, duration: 0.24, ease: 'sine.inOut' }, 0.12)
      .to(legL, { rotate: 0, duration: 0.12 }, 0.36)
      .to(legR, { rotate: 0, duration: 0.12 }, 0.36);

    let settle: gsap.core.Tween | null = null;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const v = self.getVelocity();
        const lean = gsap.utils.clamp(-14, 14, v / 160);
        gsap.to(whole, { rotate: lean, duration: 0.35, overwrite: 'auto' });
        gsap.to(scarf, { rotate: gsap.utils.clamp(-40, 40, -v / 50), duration: 0.35, overwrite: 'auto' });
        if (Math.abs(v) > 600) {
          run.play();
          settle?.kill();
          settle = gsap.delayedCall(0.25, () => {
            run.pause();
            gsap.to([legL, legR], { rotate: 0, duration: 0.25 });
            gsap.to([whole, scarf], { rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' });
          });
        }
      },
    });

    const sectionTriggers = Object.keys(SECTION_LINES)
      .filter((id) => id !== 'hero')
      .map((id) =>
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top 55%',
          end: 'bottom 55%',
          refreshPriority: -1,
          onEnter: () => say(SECTION_LINES[id]),
          onEnterBack: () => say(SECTION_LINES[id]),
        }),
      );

    return () => {
      st.kill();
      sectionTriggers.forEach((t) => t.kill());
      run.kill();
    };
  }, [say, q]);

  /* ---------- poke ---------- */
  const poke = () => {
    const whole = q('.b-whole');
    if (whole && !reduce.current) {
      gsap.fromTo(whole, { y: 0 }, { y: -40, duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 });
      gsap.fromTo(whole, { rotate: 0 }, { rotate: 360, duration: 0.6, ease: 'power2.inOut', svgOrigin: '80 120' });
    }
    say({ text: POKES[Math.floor(Math.random() * POKES.length)], pose: 'look', hold: 2600 });
  };

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-3 right-2 z-[60] flex flex-col items-end md:bottom-5 md:right-5"
      style={{ paddingRight: 'env(safe-area-inset-right, 0px)' }}
    >
      <div
        ref={bubbleRef}
        role="status"
        aria-live="polite"
        className="bubble bubble-right mb-4 mr-4 max-w-[170px] px-3 py-2 text-xs leading-tight opacity-0 md:mr-6 md:max-w-[240px] md:text-base"
      >
        {line}
      </div>

      <button
        type="button"
        onClick={poke}
        aria-label="Poke Bit, the robot"
        className="pointer-events-auto block rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pow"
      >
        <svg ref={svgRef} viewBox="0 0 160 200" className="h-[86px] w-[70px] overflow-visible md:h-[150px] md:w-[120px]" aria-hidden="true">
          <ellipse cx="80" cy="194" rx="34" ry="5" fill="#000" opacity="0.35" />
          <g className="b-lean">
            <g className="b-whole">
              {/* legs */}
              <g className="b-legL">
                <rect x="61" y="148" width="14" height="32" rx="6" fill="#F3EDE2" stroke="#0B0B0C" strokeWidth="3" />
                <rect x="56" y="176" width="22" height="12" rx="6" fill="#E10600" stroke="#0B0B0C" strokeWidth="3" />
              </g>
              <g className="b-legR">
                <rect x="85" y="148" width="14" height="32" rx="6" fill="#F3EDE2" stroke="#0B0B0C" strokeWidth="3" />
                <rect x="82" y="176" width="22" height="12" rx="6" fill="#E10600" stroke="#0B0B0C" strokeWidth="3" />
              </g>

              {/* arms */}
              <g className="b-armL">
                <rect x="36" y="108" width="15" height="36" rx="7" fill="#F3EDE2" stroke="#0B0B0C" strokeWidth="3" />
                <circle cx="43.5" cy="148" r="8.5" fill="#E10600" stroke="#0B0B0C" strokeWidth="3" />
              </g>
              <g className="b-armR">
                <rect x="109" y="108" width="15" height="36" rx="7" fill="#F3EDE2" stroke="#0B0B0C" strokeWidth="3" />
                <circle cx="116.5" cy="148" r="8.5" fill="#E10600" stroke="#0B0B0C" strokeWidth="3" />
              </g>

              {/* torso */}
              <g className="b-torso">
                <rect x="48" y="102" width="64" height="54" rx="15" fill="#E10600" stroke="#0B0B0C" strokeWidth="3.5" />
                <rect x="62" y="116" width="36" height="22" rx="6" fill="#0B0B0C" />
                <circle className="b-chest" cx="72" cy="127" r="4.5" fill="#FFD60A" />
                <rect x="80" y="124" width="12" height="2.5" rx="1" fill="#F3EDE2" />
                <rect x="80" y="129" width="8" height="2.5" rx="1" fill="#F3EDE2" />
              </g>

              {/* scarf */}
              <path d="M52 100 Q80 112 108 100 L108 108 Q80 120 52 108 Z" fill="#FFD60A" stroke="#0B0B0C" strokeWidth="3" strokeLinejoin="round" />
              <path
                className="b-scarf"
                d="M100 106 L128 98 L124 110 L134 114 L102 116 Z"
                fill="#FFD60A"
                stroke="#0B0B0C"
                strokeWidth="3"
                strokeLinejoin="round"
               
              />

              {/* head */}
              <g className="b-head">
                <g className="b-antenna">
                  <line x1="80" y1="30" x2="80" y2="12" stroke="#0B0B0C" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="80" cy="10" r="7" fill="#E10600" stroke="#0B0B0C" strokeWidth="3" />
                  <circle className="b-bulb" cx="78" cy="8" r="2.2" fill="#F3EDE2" />
                </g>
                <rect x="26" y="54" width="10" height="24" rx="4" fill="#E10600" stroke="#0B0B0C" strokeWidth="3" />
                <rect x="124" y="54" width="10" height="24" rx="4" fill="#E10600" stroke="#0B0B0C" strokeWidth="3" />
                <rect x="33" y="28" width="94" height="74" rx="24" fill="#F3EDE2" stroke="#0B0B0C" strokeWidth="3.5" />
                <rect x="43" y="40" width="74" height="50" rx="15" fill="#0B0B0C" />
                {/* face */}
                <g className="b-pupils">
                  <g className="b-eyes">
                    <rect x="58" y="52" width="12" height="18" rx="6" fill="#F3EDE2" />
                    <rect x="90" y="52" width="12" height="18" rx="6" fill="#F3EDE2" />
                  </g>
                  <g className="b-happy" opacity="0">
                    <path d="M57 64 Q64 54 71 64" fill="none" stroke="#F3EDE2" strokeWidth="4" strokeLinecap="round" />
                    <path d="M89 64 Q96 54 103 64" fill="none" stroke="#F3EDE2" strokeWidth="4" strokeLinecap="round" />
                  </g>
                </g>
                <circle cx="54" cy="76" r="4" fill="#E10600" opacity="0.7" />
                <circle cx="106" cy="76" r="4" fill="#E10600" opacity="0.7" />
                <path className="b-smile" d="M72 77 Q80 84 88 77" fill="none" stroke="#F3EDE2" strokeWidth="3.5" strokeLinecap="round" />
                <ellipse className="b-mouthO" cx="80" cy="80" rx="6" ry="5" fill="#E10600" stroke="#F3EDE2" strokeWidth="2.5" opacity="0" />
              </g>
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
