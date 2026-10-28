// Lopers van de sprint: momentum omzetten in afstand, stofwolkjes en renanimatie.
import { createSprite, play, update } from './sprites.js';
import { spawnCloud } from './sprint-particles.js';
import { TRACK_LEN, laneZ } from './sprint-track.js';
import { createMomentum, stepMomentum, speedFraction } from './sprint-momentum.js';

// elke zoveel afgelegde meter een stofwolkje
const DUST_EVERY = 1.1;

export function createRunner(player) {
  return { sprite: createSprite(player.character.key), momentum: createMomentum(), x: 0, dustLeft: DUST_EVERY };
}

// beweegt de loper in stapjes van max. 50 ms (ook bij een trage computer even snel);
// finishers lopen uit tot net voorbij de vlag. Geeft de exacte speltijd terug waarop
// de loper de finish passeerde, of null.
export function moveRunner(race, r, idx, dt) {
  const running = race.phase === 'running' && r.finishTime === undefined;
  let crossed = null;
  if (r.finishTime === undefined) {
    for (let left = dt; left > 0 && crossed === null; left -= 0.05) {
      const step = stepMomentum(r.momentum, Math.min(0.05, left), running);
      r.x += step;
      r.dustLeft -= step;
      if (running && r.x >= TRACK_LEN) {
        // terugrekenen naar het moment van passeren binnen dit frame
        crossed = race.clock - (left - Math.min(0.05, left)) - (r.x - TRACK_LEN) / Math.max(0.1, r.momentum.speed);
      }
    }
    if (r.dustLeft <= 0 && r.momentum.speed > 2) {
      r.dustLeft = DUST_EVERY;
      const size = r.momentum.turbo ? 1.5 : 0.6 + speedFraction(r.momentum) * 0.6;
      spawnCloud(race.particles, r.x - 0.5, laneZ(idx, race.players.length), size);
    }
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
