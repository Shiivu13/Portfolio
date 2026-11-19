export type Pose = 'idle' | 'wave' | 'think' | 'point' | 'flex' | 'cheer' | 'look';

export interface SayDetail {
  text: string;
  pose?: Pose;
  /** How long the bubble stays up, in ms. */
  hold?: number;
}

const EVENT = 'companion:say';

/** Make the robot sidekick say something (and optionally strike a pose). */
export function companionSay(detail: SayDetail) {
  window.dispatchEvent(new CustomEvent<SayDetail>(EVENT, { detail }));
}

export function onCompanionSay(handler: (d: SayDetail) => void) {
  const fn = (e: Event) => handler((e as CustomEvent<SayDetail>).detail);
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
