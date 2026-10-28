// Lopers van de sprint: momentum omzetten in afstand, stofwolkjes en renanimatie.
import { createSprite, play, update } from './sprites.js';
import { cloud } from './effects.js';
import { toScreen, laneOf } from './sprint-view.js';
import { TRACK_LEN } from './sprint-track.js';
import { createMomentum, stepMomentum, speedFraction } from './sprint-momentum.js';

// elke zoveel afgelegde meter een stofwolkje
const DUST_EVERY = 1.1;

export function createRunner(player) {
  return { sprite: createSprite(player.character.key), momentum: createMomentum(), x: 0, dustLeft: DUST_EVERY };
}

// beweegt de loper; finishers lopen uit tot net voorbij de vlag.
// Geeft true terug op het moment dat de loper de finish passeert.
export function moveRunner(race, r, idx, dt) {
  const running = race.phase === 'running' && r.finishTime === undefined;
  let crossed = false;
  if (r.finishTime === undefined) {
    const step = stepMomentum(r.momentum, dt, running);
    r.x += step;
    r.dustLeft -= step;
    if (r.dustLeft <= 0 && r.momentum.speed > 2) {
      r.dustLeft = DUST_EVERY;
      const p = toScreen(race.view, r.x - 0.5, 0.15, laneOf(race.view, idx));
      cloud(race.particles, p.x, p.y, r.momentum.turbo ? 1.5 : 0.6 + speedFraction(r.momentum) * 0.6);
    }
    crossed = running && r.x >= TRACK_LEN;
  } else {
    r.x += (TRACK_LEN + 2.5 - r.x) * Math.min(1, dt * 3);
  }
  if (running) {
    const f = speedFraction(r.momentum);
    play(r.sprite, f > 0.08 ? 'run' : 'idle');
    r.sprite.speed = f > 0.08 ? 0.5 + f * 2 : 1;
  } else {
    r.sprite.speed = 1;
  }
  update(r.sprite, dt);
  return crossed;
}
