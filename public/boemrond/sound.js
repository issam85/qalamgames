// Geluiden, gemaakt met Web Audio (geen bestanden). De aan/uit-stand wordt onthouden.
const KEY = 'boemrond-geluid';
let ctx = null;

function readMuted() {
  try {
    return localStorage.getItem(KEY) === 'uit';
  } catch {
    return false;
  }
}

let muted = readMuted();

export const isMuted = () => muted;

export function setMuted(value) {
  muted = value;
  try {
    localStorage.setItem(KEY, value ? 'uit' : 'aan');
  } catch {
    // Geen opslag beschikbaar: dan geldt het alleen voor dit potje.
  }
}

// Moet na een klik of toets, anders blokkeert de browser het geluid.
export function unlockSound() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!ctx && Audio) ctx = new Audio();
  ctx?.resume();
}

function tone(freq, dur, type, vol, slideTo, delay = 0) {
  if (muted || !ctx) return;
  const at = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, at + dur);
  gain.gain.setValueAtTime(vol, at);
  gain.gain.exponentialRampToValueAtTime(0.001, at + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + dur);
}

function noise(dur, vol) {
  if (muted || !ctx) return;
  const size = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * (1 - i / size);
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  src.buffer = buffer;
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + dur);
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start();
}

export const sound = {
  tick: (n) => tone(n % 2 ? 1250 : 930, 0.05, 'square', 0.06),
  toss: () => tone(420, 0.16, 'triangle', 0.14, 820),
  oops: () => tone(320, 0.32, 'sawtooth', 0.12, 90),
  go: () => tone(880, 0.16, 'triangle', 0.18),
  boom() {
    noise(1.3, 0.9);
    tone(120, 0.9, 'sine', 0.6, 30);
  },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.24, 'triangle', 0.2, null, i * 0.14)),
  lose: () => [392, 330, 262].forEach((f, i) => tone(f, 0.3, 'triangle', 0.16, null, i * 0.2)),
};
