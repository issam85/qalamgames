// Piepjes met Web Audio (geen bestanden): fladderen, punt, botsen.
import { loadMuted, saveMuted } from './storage.js';

let ctx = null;
let muted = loadMuted();

export const isMuted = () => muted;

export function setMuted(value) {
  muted = value;
  saveMuted(value);
}

// Moet na een klik of toets, anders blokkeert de browser het geluid.
export function unlockSound() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!ctx && Audio) ctx = new Audio();
  ctx?.resume().catch(() => {});
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

export const sound = {
  flap: () => tone(520, 0.09, 'triangle', 0.12, 880),
  point: () => [880, 1320].forEach((f, i) => tone(f, 0.1, 'square', 0.06, null, i * 0.07)),
  hit: () => tone(260, 0.35, 'sawtooth', 0.14, 70),
  land: () => tone(120, 0.15, 'sine', 0.3, 60),
  record: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.18, null, i * 0.12)),
};
