// Waar een CPU-speler zonder bal staat: een plek per rol die meeschuift met de bal,
// en in de aanval een vrije plek in de buurt waar hij aangespeeld kan worden.
import { FIELD } from './config.js';
import { dist, clampField, lineDistance } from './geo.js';

// plekken voor een team dat naar +x aanvalt; voor het andere team gespiegeld
const SHAPE = {
  attack: { achter: { x: -6, z: 0 }, links: { x: 4, z: -4 }, rechts: { x: 4, z: 4 } },
  defend: { achter: { x: -7, z: 0 }, links: { x: -2.5, z: -3 }, rechts: { x: -2.5, z: 3 } },
};

export function roleSpot(player, ball, attacking) {
  const a = player.attack;
  const shape = SHAPE[attacking ? 'attack' : 'defend'][player.role];
  const bx = ball.pos.x * a; // positie van de bal vanuit dit team gezien
  let x = bx + shape.x;
  if (player.role === 'achter') x = Math.min(x, attacking ? 2 : -FIELD.halfL + 4 + Math.max(0, bx + 8) * 0.5);
  const z = shape.z + ball.pos.z * a * 0.35;
  return clampField({ x: x * a, z: z * a }, 1.2);
}

// hoe vrij een plek is: ver van tegenstanders en met een open lijn vanaf de bal
function freedom(spot, ball, rivals) {
  let score = 9;
  rivals.forEach((r) => {
    score = Math.min(score, dist(spot, r.pos));
    score = Math.min(score, lineDistance(r.pos, ball.pos, spot) * 1.5);
  });
  return score;
}

// probeert een paar plekken rond de rolplek en kiest de vrijste
export function openSpot(player, ball, rivals) {
  const base = roleSpot(player, ball, true);
  let best = base;
  let bestScore = freedom(base, ball, rivals);
  [[2, 0], [-2, 0], [0, 2], [0, -2], [1.5, 1.5], [1.5, -1.5]].forEach(([dx, dz]) => {
    const spot = clampField({ x: base.x + dx * player.attack, z: base.z + dz }, 1.2);
    const score = freedom(spot, ball, rivals) - dist(spot, base) * 0.15;
    if (score > bestScore) {
      best = spot;
      bestScore = score;
    }
  });
  return best;
}

// verdedigen: tussen de dichtstbijzijnde aanvaller en het eigen doel in gaan staan
export function markSpot(player, ball, rivals) {
  const base = roleSpot(player, ball, false);
  const goal = { x: -player.attack * FIELD.halfL, z: 0 };
  const target = rivals
    .filter((r) => !r.keeper && ball.owner !== r)
    .sort((a, b) => dist(a.pos, base) - dist(b.pos, base))[0];
  if (!target || dist(target.pos, base) > 5) return base;
  const t = 1.6 / Math.max(1.6, dist(target.pos, goal));
  return clampField({ x: target.pos.x + (goal.x - target.pos.x) * t, z: target.pos.z + (goal.z - target.pos.z) * t }, 1);
}
