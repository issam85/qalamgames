// De klok: 1,5 minuut speeltijd, dan 10 of 20 seconden blessuretijd, dan het eindsignaal.
import { MATCH } from './config.js';

export function startClock(match) {
  match.time = MATCH.length;
  match.extra = 0; // blessuretijd, bekend zodra de speeltijd om is
  match.elapsed = 0;
}

// geeft 'fulltime' terug als de wedstrijd net is afgelopen
export function stepClock(match, dt) {
  if (match.pause > 0) return null; // tijdens het juichen staat de klok stil
  match.time -= dt;
  match.elapsed += dt;
  if (match.time > 0) return null;
  if (match.phase === 'play') {
    match.phase = 'injury';
    match.extra = MATCH.extras[Math.floor(Math.random() * MATCH.extras.length)];
    match.time += match.extra;
    match.events.push({ type: 'injury', extra: match.extra });
    return null;
  }
  match.time = 0;
  return 'fulltime';
}

// mm:ss voor op het scorebord
export function clockText(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
