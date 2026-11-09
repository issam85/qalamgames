// Een nieuw potje: zes kinderen in de kring, spelers op vaste plekken.
import { KIDS } from './data.js';

function shuffled(list, rng) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createGame(humans, rng = Math.random) {
  const players = shuffled(KIDS, rng).slice(0, 6)
    .map((kid) => ({ kid, name: kid.name, human: -1, out: false, place: 0 }));
  players[0].human = 0;
  players[0].name = humans === 1 ? 'Jij' : 'Speler 1';
  if (humans === 2) {
    players[2].human = 1;
    players[2].name = 'Speler 2';
  }
  return {
    players, humans, rng, phase: 'menu', round: 0, timer: 0, fuse: 1, elapsed: 0, blink: 0,
    holder: 0, flight: null, drop: 0, wait: 0, loser: -1, events: [],
  };
}
