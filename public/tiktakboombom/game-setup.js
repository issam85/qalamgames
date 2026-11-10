// Een nieuw potje: zes kinderen in de kring, spelers op vaste plekken.
import { KIDS } from './data.js';

// Op welke plek in de kring elke speler staat: verspreid, en in de volgorde van de toetsen.
const HUMAN_SEATS = {
  1: [0],
  2: [0, 2],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 3, 4],
};

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
  HUMAN_SEATS[humans].forEach((seat, human) => {
    players[seat].human = human;
    players[seat].name = humans === 1 ? 'Jij' : `Speler ${human + 1}`;
  });
  return {
    players, humans, rng, phase: 'menu', round: 0, timer: 0, fuse: 1, elapsed: 0, blink: 0,
    holder: 0, flight: null, drop: 0, wait: 0, loser: -1, events: [],
  };
}
