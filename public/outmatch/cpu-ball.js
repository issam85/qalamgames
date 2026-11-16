// Een CPU-speler met de bal: schieten als het kan, passen als hij klem staat of iemand vrij staat,
// anders dribbelen richting het doel, om tegenstanders heen.
import { FIELD, GOAL, CPU } from './config.js';
import { dist, toward, lineDistance } from './geo.js';

const goalOf = (player) => ({ x: player.attack * FIELD.halfL, z: 0 });

// een vrije teamgenoot die beter staat (verder naar voren, of die om de bal roept)
function bestMate(player, mates, rivals) {
  let best = null;
  let bestScore = 0;
  mates.forEach((m) => {
    if (m === player) return;
    const lane = Math.min(...rivals.map((r) => lineDistance(r.pos, player.pos, m.pos)));
    if (lane < CPU.lane) return;
    const ahead = (m.pos.x - player.pos.x) * player.attack;
    const space = Math.min(...rivals.map((r) => dist(r.pos, m.pos)));
    const score = ahead * 0.4 + space + (m.callTime > 0 ? 6 : 0) - dist(m.pos, player.pos) * 0.1;
    if (score > bestScore) {
      best = m;
      bestScore = score;
    }
  });
  return best;
}

// mikt in de hoek waar de keeper niet staat
function shotTarget(player, keeper, level) {
  const goal = goalOf(player);
  const side = keeper.pos.z > 0 ? -1 : 1;
  const z = side * (GOAL.halfW - 0.55) + (Math.random() - 0.5) * 2 * level.aimError * 4;
  return { x: goal.x, z };
}

function shotIsOpen(player, target, rivals) {
  return rivals.every((r) => r.keeper || lineDistance(r.pos, player.pos, target) > 0.9);
}

// kiest één plan; de CPU houdt dat vast tot het af is
export function planWithBall(player, mates, rivals, keeper, level) {
  const goal = goalOf(player);
  const toGoal = dist(player.pos, goal);
  const target = shotTarget(player, keeper, level);
  const angleOk = Math.abs(player.pos.z) < GOAL.halfW + toGoal * 0.6;
  if (toGoal < level.shootRange && angleOk && shotIsOpen(player, target, rivals)) {
    const power = Math.min(1, 0.45 + toGoal / 18);
    return { type: 'shoot', target, hold: power * 0.8, t: 0 };
  }
  const mate = bestMate(player, mates, rivals);
  const nearest = Math.min(...rivals.filter((r) => !r.keeper).map((r) => dist(r.pos, player.pos)));
  const pressed = nearest < 2.2;
  if (mate && (pressed || mate.callTime > 0 || (mate.pos.x - player.pos.x) * player.attack > 4)) {
    return { type: 'pass', mate, t: 0 };
  }
  return { type: 'dribble', t: 0 };
}

// dribbelen: naar het doel, met een bocht weg van de dichtstbijzijnde tegenstander
function dribbleIntent(player, rivals) {
  const goal = goalOf(player);
  const dir = toward(player.pos, { x: goal.x - player.attack * 3, z: goal.z }, 0.01);
  const close = rivals.filter((r) => !r.keeper && dist(r.pos, player.pos) < 3);
  close.forEach((r) => {
    const away = toward(r.pos, player.pos, 0.01);
    const w = (3 - dist(r.pos, player.pos)) / 3;
    dir.x += away.x * w * 0.9;
    dir.z += away.z * w * 1.4;
  });
  return dir;
}

// het plan van deze stap omzetten in toetsen
export function withBallIntent(player, plan, rivals, level, dt) {
  plan.t += dt;
  if (plan.type === 'shoot') {
    const dir = toward(player.pos, plan.target, 0.01);
    return { x: dir.x, z: dir.z, shoot: plan.t < plan.hold, done: plan.t >= plan.hold + 0.05 };
  }
  if (plan.type === 'pass') {
    const dir = toward(player.pos, plan.mate.pos, 0.01);
    return { x: dir.x * 0.5, z: dir.z * 0.5, pass: plan.t > 0.05, done: plan.t > 0.15 };
  }
  const dir = dribbleIntent(player, rivals);
  return { x: dir.x * level.speed, z: dir.z * level.speed, done: plan.t > level.think * 2 };
}
