import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, skills } from '../data/projects';
import { companionSay } from '../lib/companion';
import { scrollToId } from '../lib/scroll';

type Line = { kind: 'cmd' | 'out' | 'err'; text: ReactNode };

const EMAIL = 'shiivu13@gmail.com';

const INTRO: { cmd: string; out: string }[] = [
  { cmd: 'whoami', out: 'shivansh tripathi, software engineer (ai / ml / backend)' },
  { cmd: 'cat focus.txt', out: 'computer vision, llm apps, fastapi backends' },
  { cmd: 'ls ~/projects | wc -l', out: String(projects.length) },
  { cmd: 'echo $STATUS', out: 'open to work. type "help" and press enter.' },
];

const COMMANDS = ['help', 'about', 'projects', 'skills', 'contact', 'clear', 'date', 'sudo hire-me', 'exit'];

function run(raw: string): { lines: Line[]; clear?: boolean } {
  const cmd = raw.trim().toLowerCase();
  const out = (text: ReactNode): Line => ({ kind: 'out', text });

  switch (cmd) {
    case '':
      return { lines: [] };
    case 'help':
      return {
        lines: [
          out('available commands:'),
          out('  about      who is this guy'),
          out('  projects   things he built'),
          out('  skills     what he works with'),
          out('  contact    how to reach him'),
          out('  date       what day it is'),
          out('  clear      wipe the screen'),
          out('  sudo hire-me'),
        ],
      };
    case 'about':
    case 'whoami':
      return {
        lines: [
          out("Shivansh. Builds AI that runs outside a notebook:"),
          out('YOLO pipelines, GenAI assistants, FastAPI services on AWS.'),
          out('3 years of building, still debugging.'),
        ],
      };
    case 'projects':
    case 'ls':
    case 'ls projects':
      return {
        lines: [
          ...projects.map((p, i) => out(`${String(i + 1).padStart(2, '0')}  ${p.title}`)),
          out('scroll down to the Work section for details.'),
        ],
      };
    case 'skills':
      return {
        lines: skills.map((s) => out(`${s.name.padEnd(32, ' ')}${'█'.repeat(Math.round(s.level / 10))} ${s.level}%`)),
      };
    case 'contact':
      return {
        lines: [
          out(`email     ${EMAIL}`),
          out('github    github.com/Shiivu13'),
          out('linkedin  linkedin.com/in/shivansh-tripathi-725584207'),
        ],
      };
    case 'date':
      return { lines: [out(new Date().toDateString())] };
    case 'clear':
      return { lines: [], clear: true };
    case 'sudo hire-me':
    case 'sudo hire me':
      companionSay({ text: 'Permission granted! Best command so far.', pose: 'cheer', hold: 3200 });
      return { lines: [out('[sudo] access granted.'), out(`send the offer to ${EMAIL} :)`)] };
    case 'hire-me':
    case 'hire me':
      return { lines: [{ kind: 'err', text: 'permission denied. try sudo.' }] };
    case 'exit':
      setTimeout(() => scrollToId('#contact'), 400);
      return { lines: [out('no exit here, only the contact section. taking you there...')] };
    case 'hi':
    case 'hello':
    case 'hey':
      return { lines: [out('hey :) type help to see what I can do.')] };
    default:
      return { lines: [{ kind: 'err', text: `command not found: ${raw.trim()}. try "help".` }] };
  }
}

/** A small working shell. Plays a short intro when it scrolls into view, then takes commands. */
export default function Terminal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState('');
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState('');
  const history = useRef<string[]>([]);
  const histIdx = useRef(-1);

  // Intro: type each command, then print its output.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const play = () => {
      if (reduce) {
        setLines(INTRO.flatMap((s) => [{ kind: 'cmd', text: s.cmd } as Line, { kind: 'out', text: s.out } as Line]));
        setReady(true);
        return;
      }
      let t = 300;
      INTRO.forEach((step) => {
        for (let i = 1; i <= step.cmd.length; i++) {
          later(() => setTyping(step.cmd.slice(0, i)), t);
          t += 45 + Math.random() * 40;
        }
        t += 250;
        later(() => {
          setTyping('');
          setLines((l) => [...l, { kind: 'cmd', text: step.cmd }, { kind: 'out', text: step.out }]);
        }, t);
        t += 450;
      });
      later(() => setReady(true), t);
    };

    const st = ScrollTrigger.create({ trigger: rootRef.current, start: 'top 80%', once: true, onEnter: play });
    return () => {
      st.kill();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Keep the newest line in view.
  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTop = b.scrollHeight;
  }, [lines, typing, ready]);

  const submit = () => {
    const raw = value;
    setValue('');
    if (raw.trim()) {
      history.current.push(raw);
      histIdx.current = history.current.length;
    }
    const res = run(raw);
    setLines((l) => (res.clear ? [] : [...l, { kind: 'cmd', text: raw }, ...res.lines]));
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      histIdx.current = Math.max(0, histIdx.current - 1);
      setValue(history.current[histIdx.current] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      histIdx.current = Math.min(history.current.length, histIdx.current + 1);
      setValue(history.current[histIdx.current] ?? '');
    } else if (e.key === 'Tab') {
      const match = COMMANDS.find((c) => value && c.startsWith(value.toLowerCase()));
      if (match) {
        e.preventDefault();
        setValue(match);
      }
    }
  };

  const prompt = <span className="text-blood">shivansh@portfolio:~$</span>;

  return (
    <div
      ref={rootRef}
      className="relative border-4 border-ink bg-ink text-paper shadow-[12px_12px_0_#E10600]"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b-2 border-paper/15 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-blood" />
        <span className="h-3 w-3 rounded-full bg-pow" />
        <span className="h-3 w-3 rounded-full bg-paper/60" />
        <span className="ml-3 truncate font-mono text-[11px] text-paper/50">shivansh@portfolio: ~ (zsh)</span>
      </div>

      <div
        ref={bodyRef}
        data-lenis-prevent
        className="h-[340px] overflow-y-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed md:h-[400px] md:text-[13.5px]"
      >
        {lines.map((l, i) =>
          l.kind === 'cmd' ? (
            <div key={i} className="break-words">
              {prompt} <span className="text-paper">{l.text}</span>
            </div>
          ) : (
            <div key={i} className={`whitespace-pre-wrap break-words ${l.kind === 'err' ? 'text-pow' : 'text-paper/70'}`}>
              {l.text}
            </div>
          ),
        )}

        {!ready ? (
          <div>
            {prompt} <span>{typing}</span>
            <span className="ml-0.5 inline-block h-[1.05em] w-[0.6em] translate-y-[0.15em] animate-[caret_1s_steps(1)_infinite] bg-paper" />
          </div>
        ) : (
          <label className="flex items-center gap-2">
            <span className="shrink-0">{prompt}</span>
            <input
              ref={inputRef}
              id="terminal-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKey}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Terminal command"
              placeholder="type help"
              className="min-w-0 flex-1 bg-transparent text-paper caret-blood outline-none placeholder:text-paper/25"
            />
          </label>
        )}
      </div>
    </div>
  );
}
