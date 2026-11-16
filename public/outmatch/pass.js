// Passen en lobben: naar de teamgenoot in je kijkrichting, of gewoon vooruit als er niemand staat.
import { PASS, LOB, BALL } from './config.js';
import { canKick, launch, aimAt } from './kick.js';

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// de teamgenoot die het best in je kijkrichting staat (dichtbij en recht voor je telt zwaarder)
export function pickMate(player, mates) {
  let best = null;
  let bestScore = Infinity;
  mates.forEach((m) => {
    if (m === player || m.team !== player.team) return;
    const dx = m.pos.x - player.pos.x, dz = m.pos.z - player.pos.z;
    const dist = Math.hypot(dx, dz);
    const off = Math.abs(wrap(Math.atan2(-dz, dx) - player.aim));
    if (off > PASS.cone || dist < 1.5) return;
    const score = off * 4 + dist * 0.08;
    if (score < bestScore) {
      bestScore = score;
      best = m;
    }
  });
  return best;
}

// waar de teamgenoot is als de bal aankomt
function leadPoint(player, mate, speed) {
  const dist = Math.hypot(mate.pos.x - player.pos.x, mate.pos.z - player.pos.z);
  const t = dist / speed;
  const v = mate.vel || { x: 0, z: 0 };
  return { x: mate.pos.x + v.x * t, z: mate.pos.z + v.z * t };
}

export function pass(player, ball, mates, events) {
  if (!canKick(player, ball)) return false;
  const mate = pickMate(player, mates);
  if (!mate) {
    const a = player.aim;
    launch(player, ball, { x: Math.cos(a) * PASS.blind, z: -Math.sin(a) * PASS.blind, y: PASS.lift }, 'pass', events);
    return true;
  }
  const first = Math.hypot(mate.pos.x - ball.pos.x, mate.pos.z - ball.pos.z);
  const speed = Math.max(PASS.min, Math.min(PASS.max, 7 + first * PASS.perMeter));
  const to = leadPoint(player, mate, speed);
  const dx = to.x - ball.pos.x, dz = to.z - ball.pos.z;
  const len = Math.hypot(dx, dz) || 1;
  launch(player, ball, { x: (dx / len) * speed, z: (dz / len) * speed, y: PASS.lift }, 'pass', events, { to: mate });
  return true;
}

// een boogbal: landt vlak voor de teamgenoot, of ver vooruit (met hulp richting het doel)
export function lob(player, ball, mates, events) {
  if (!canKick(player, ball)) return false;
  const mate = pickMate(player, mates);
  const flight = (2 * LOB.up) / BALL.gravity; // tijd in de lucht
  let angle, dist;
  if (mate) {
    const to = leadPoint(player, mate, 10);
    angle = Math.atan2(-(to.z - ball.pos.z), to.x - ball.pos.x);
    dist = Math.hypot(to.x - ball.pos.x, to.z - ball.pos.z) * 0.85;
  } else {
    angle = aimAt(player, ball, player.aim);
    dist = LOB.blind;
  }
  const speed = Math.max(LOB.min, Math.min(LOB.max, dist / flight));
  launch(player, ball, { x: Math.cos(angle) * speed, z: -Math.sin(angle) * speed, y: LOB.up },
    'lob', events, { to: mate });
  ball.pos.y = Math.max(ball.pos.y, BALL.radius + 0.05);
  return true;
}
