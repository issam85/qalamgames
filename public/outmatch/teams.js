// Twee teams van drie veldspelers met een vaste rol, de aftrap en spelers die niet door elkaar lopen.
import { CPU, PLAYER, KEEPER } from './config.js';
import { createPlayer, placePlayer } from './player.js';

// humans: ids van de echte spelers in team 0, bv. ['p1'] (of [] voor CPU tegen CPU)
export function createTeams(humans) {
  const players = [];
  [0, 1].forEach((team) => {
    CPU.roles.forEach((role, i) => {
      const cpuId = `c${team}${i}`;
      const extra = { role, cpu: true, cpuId, cpuName: NAMES[team][i], name: NAMES[team][i] };
      players.push(Object.assign(createPlayer({ id: cpuId, team, attack: team === 0 ? 1 : -1 }), extra));
    });
  });
  setHumans(players, humans);
  return players;
}

const SLOT = { rechts: 0, links: 1, achter: 2 }; // speler 1 is 'rechts', speler 2 'links'

// wie in team 0 door een echte speler bestuurd wordt; de rest is CPU
export function setHumans(players, humans) {
  players.filter((p) => p.team === 0).forEach((p) => {
    const id = humans[SLOT[p.role]];
    const name = humans.length > 1 && id ? `Speler ${id.slice(1)}` : p.cpuName;
    Object.assign(p, { id: id || p.cpuId, cpu: !id, name, held: {}, brain: null, callTime: 0 });
  });
}

// namen voor het eindscherm (in stap 6 zelf aan te passen)
const NAMES = [['Bilal', 'Sami', 'Jij'], ['Adam', 'Idris', 'Zakaria']];

const SPOTS = { achter: { x: -8, z: 0 }, links: { x: -3.5, z: -4 }, rechts: { x: -3.5, z: 4 } };

// iedereen op zijn eigen helft; de 'rechts' van het team met de aftrap staat bij de bal
export function kickOffSpots(players, team) {
  players.forEach((p) => {
    const spot = SPOTS[p.role];
    const taker = p.team === team && p.role === 'rechts';
    const x = taker ? -0.9 : spot.x;
    const z = taker ? 0 : spot.z;
    placePlayer(p, x * p.attack, z * p.attack);
  });
}

// spelers duwen elkaar en de keepers zacht opzij
export function separate(players, keepers) {
  const all = [...players, ...keepers];
  players.forEach((p, i) => {
    all.forEach((o, j) => {
      if (j <= i && !o.keeper) return;
      const min = PLAYER.radius + (o.keeper ? KEEPER.radius : PLAYER.radius);
      const dx = p.pos.x - o.pos.x, dz = p.pos.z - o.pos.z;
      const d = Math.hypot(dx, dz);
      if (d >= min || d === 0) return;
      const push = (min - d) / (o.keeper ? 1 : 2);
      p.pos.x += (dx / d) * push;
      p.pos.z += (dz / d) * push;
      if (o.keeper) return;
      o.pos.x -= (dx / d) * push;
      o.pos.z -= (dz / d) * push;
    });
  });
}
