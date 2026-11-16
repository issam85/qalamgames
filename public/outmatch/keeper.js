// De CPU-keeper: staat tussen bal en doel, duikt, pakt losse ballen in zijn gebied en gooit uit.
import { FIELD, GOAL, KEEPER } from './config.js';
import { readShot, startDive, touchBall } from './save.js';

const L = FIELD.halfL;

// side = kant van het eigen doel (-1 of 1)
export function createKeeper({ id, team, side }) {
  return {
    id, team, side, keeper: true,
    pos: { x: side * (L - KEEPER.out), z: 0 },
    vel: { x: 0, z: 0 },
    facing: side > 0 ? Math.PI : 0,
    state: 'guard', // guard, rush, dive, down, hold
    timer: 0, cool: 0, threat: 0, guess: 0,
    diveDir: 1, diveHigh: 0, kickTime: 0,
  };
}

export function placeKeeper(keeper) {
  Object.assign(keeper.pos, { x: keeper.side * (L - KEEPER.out), z: 0 });
  Object.assign(keeper, { state: 'guard', timer: 0, cool: 0, threat: 0 });
}

function walkTo(keeper, x, z, speed, dt) {
  const dx = x - keeper.pos.x, dz = z - keeper.pos.z;
  const dist = Math.hypot(dx, dz);
  const step = Math.min(dist, speed * dt);
  keeper.vel.x = dist ? (dx / dist) * speed * Math.min(1, dist * 4) : 0;
  keeper.vel.z = dist ? (dz / dist) * speed * Math.min(1, dist * 4) : 0;
  if (dist) {
    keeper.pos.x += (dx / dist) * step;
    keeper.pos.z += (dz / dist) * step;
  }
}

// op de lijn van het midden van het doel naar de bal, verder uit als de bal dichtbij is
function guardSpot(keeper, ball) {
  const gx = keeper.side * L;
  const dx = ball.pos.x - gx, dz = ball.pos.z;
  const dist = Math.hypot(dx, dz) || 1;
  const out = KEEPER.out + (1 - Math.min(1, dist / 15)) * (KEEPER.outMax - KEEPER.out);
  const z = Math.max(-GOAL.halfW - 0.3, Math.min(GOAL.halfW + 0.3, (dz / dist) * out * 1.3));
  return { x: gx + (dx / dist) * out, z };
}

function inBox(keeper, ball) {
  return Math.abs(ball.pos.x - keeper.side * L) < KEEPER.box && Math.abs(ball.pos.z) < GOAL.halfW + 2.5;
}

// een losse, langzame bal in het eigen gebied waar geen tegenstander dichterbij is
function shouldRush(keeper, ball, others) {
  if (ball.owner || ball.pos.y > 1.2 || !inBox(keeper, ball)) return false;
  if (Math.hypot(ball.vel.x, ball.vel.z) > 7) return false;
  const mine = Math.hypot(ball.pos.x - keeper.pos.x, ball.pos.z - keeper.pos.z);
  return !others.some((p) => p.team !== keeper.team
    && Math.hypot(ball.pos.x - p.pos.x, ball.pos.z - p.pos.z) < mine - 0.5);
}

// uitgooien naar de vrijste teamgenoot, anders rollen naar de zijkant
function distribute(keeper, ball, others, events) {
  const mates = others.filter((p) => p.team === keeper.team && !p.keeper);
  const freedom = (m) => Math.min(...others.filter((o) => o.team !== keeper.team)
    .map((o) => Math.hypot(o.pos.x - m.pos.x, o.pos.z - m.pos.z)), 9);
  const mate = mates.sort((a, b) => freedom(b) - freedom(a))[0];
  const to = mate ? mate.pos : { x: keeper.side * (L - 7), z: Math.random() < 0.5 ? -4 : 4 };
  const dx = to.x - ball.pos.x, dz = to.z - ball.pos.z;
  const dist = Math.hypot(dx, dz) || 1;
  const speed = Math.max(8, Math.min(16, 6 + dist * 0.9));
  ball.owner = null;
  ball.noTouch = 0.15;
  Object.assign(ball.vel, { x: (dx / dist) * speed, y: 1.5, z: (dz / dist) * speed });
  keeper.state = 'guard';
  keeper.cool = 0.8;
  keeper.kickTime = 0.25;
  events.push({ type: 'throw', keeper, to: mate });
}

function holdBall(keeper, ball, others, dt, events) {
  keeper.vel.x = keeper.vel.z = 0;
  ball.pos.x = keeper.pos.x + Math.cos(keeper.facing) * 0.35;
  ball.pos.z = keeper.pos.z - Math.sin(keeper.facing) * 0.35;
  ball.pos.y = 1.05;
  Object.assign(ball.vel, { x: 0, y: 0, z: 0 });
  keeper.facing = keeper.side > 0 ? Math.PI : 0;
  keeper.timer -= dt;
  if (keeper.timer <= 0) distribute(keeper, ball, others, events);
}

function dive(keeper, dt) {
  keeper.timer -= dt;
  if (keeper.timer < KEEPER.diveTime) {
    keeper.pos.z += keeper.diveDir * keeper.speed * dt * Math.min(1, keeper.timer / 0.15 + 0.3);
    keeper.vel.z = keeper.diveDir * keeper.speed;
  }
  if (keeper.timer <= 0) {
    keeper.state = 'down';
    keeper.timer = KEEPER.down;
  }
}

function guard(keeper, ball, others, level, dt) {
  keeper.facing = Math.atan2(-(ball.pos.z - keeper.pos.z), ball.pos.x - keeper.pos.x);
  const shot = readShot(keeper, ball, level, dt);
  if (shot && Math.abs(shot.z) < GOAL.halfW + 0.4 && shot.y < GOAL.height + 0.4) {
    const gap = Math.abs(shot.z - keeper.pos.z) - KEEPER.reach * 0.8;
    if (gap > 0 && gap / level.step > shot.t - 0.05) {
      keeper.speed = level.dive;
      startDive(keeper, shot.z);
      keeper.diveHigh = Math.max(0, Math.min(1, shot.y - 0.6));
      return;
    }
    walkTo(keeper, keeper.pos.x, shot.z, level.step, dt);
    return;
  }
  if (shouldRush(keeper, ball, others)) {
    keeper.state = 'rush';
    walkTo(keeper, ball.pos.x, ball.pos.z, KEEPER.rush, dt);
    return;
  }
  keeper.state = 'guard';
  const spot = guardSpot(keeper, ball);
  walkTo(keeper, spot.x, spot.z, KEEPER.walk, dt);
}

function keepInArea(keeper) {
  const near = L - 0.35, far = L - KEEPER.box - 1;
  const ax = keeper.pos.x * keeper.side;
  keeper.pos.x = keeper.side * Math.max(far, Math.min(near, ax));
  keeper.pos.z = Math.max(-FIELD.halfW + 0.4, Math.min(FIELD.halfW - 0.4, keeper.pos.z));
}

// others: alle veldspelers en de andere keeper; level: KEEPER.levels.normal enz.
export function stepKeeper(keeper, ball, others, level, dt, events) {
  keeper.cool = Math.max(0, keeper.cool - dt);
  keeper.kickTime = Math.max(0, keeper.kickTime - dt);
  if (keeper.state === 'hold') holdBall(keeper, ball, others, dt, events);
  else if (keeper.state === 'dive') dive(keeper, dt);
  else if (keeper.state === 'down') {
    keeper.vel.x = keeper.vel.z = 0;
    keeper.timer -= dt;
    if (keeper.timer <= 0) keeper.state = 'guard';
  } else guard(keeper, ball, others, level, dt);
  keepInArea(keeper);
  touchBall(keeper, ball, level, events);
}
