/** Tiny synthesized sound effects (no audio files). Muted state persists in localStorage. */
const KEY = 'loopwise.muted';
let ctx: AudioContext | null = null;

export const isMuted = () => {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
};
export const setMuted = (m: boolean) => {
  try { localStorage.setItem(KEY, m ? '1' : '0'); } catch { /* ignore */ }
};

function tone(freqs: number[], dur = 0.09, type: OscillatorType = 'sine', gain = 0.08) {
  if (isMuted()) return;
  try {
    ctx ??= new AudioContext();
    let t = ctx.currentTime;
    for (const f of freqs) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.8);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur * 2);
      t += dur;
    }
  } catch { /* audio unavailable */ }
}

export const sfx = {
  correct: () => tone([660, 880], 0.08, 'triangle'),
  wrong: () => tone([300, 220], 0.12, 'sawtooth', 0.04),
  finish: () => tone([523, 659, 784, 1047], 0.1, 'triangle'),
};
