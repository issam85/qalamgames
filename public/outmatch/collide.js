// De bal tegen de kooi: vloer, muren, plafondnet, palen, lat en het net in het doel.
import { FIELD, GOAL, BALL } from './config.js';
import { markRebound } from './tricks.js';

const R = BALL.radius;

// kaatst de snelheid terug langs de normaal (nx, ny, nz) met verlies k
function reflect(v, nx, ny, nz, k) {
  const into = v.x * nx + v.y * ny + v.z * nz;
  if (into >= 0) return false;
  v.x -= (1 + k) * into * nx;
  v.y -= (1 + k) * into * ny;
  v.z -= (1 + k) * into * nz;
  return -into;
}

export function inMouth(p) {
  return Math.abs(p.z) < GOAL.halfW - R && p.y < GOAL.height - R;
}

// bal tegen een stuk paal of lat: dichtstbijzijnde punt op het lijnstuk a-b
function hitSegment(ball, a, b) {
  const { pos, vel } = ball;
  const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
  const len2 = dx * dx + dy * dy + dz * dz;
  const t = Math.max(0, Math.min(1, ((pos.x - a.x) * dx + (pos.y - a.y) * dy + (pos.z - a.z) * dz) / len2));
  const cx = pos.x - (a.x + dx * t), cy = pos.y - (a.y + dy * t), cz = pos.z - (a.z + dz * t);
  const dist = Math.hypot(cx, cy, cz);
  const min = R + GOAL.post;
  if (dist >= min || dist === 0) return 0;
  const nx = cx / dist, ny = cy / dist, nz = cz / dist;
  pos.x += nx * (min - dist);
  pos.y += ny * (min - dist);
  pos.z += nz * (min - dist);
  return reflect(vel, nx, ny, nz, BALL.post) || 0;
}

function hitFrame(ball, events) {
  [-1, 1].forEach((side) => {
    const x = side * FIELD.halfL;
    const posts = [
      [{ x, y: 0, z: -GOAL.halfW }, { x, y: GOAL.height, z: -GOAL.halfW }],
      [{ x, y: 0, z: GOAL.halfW }, { x, y: GOAL.height, z: GOAL.halfW }],
      [{ x, y: GOAL.height, z: -GOAL.halfW }, { x, y: GOAL.height, z: GOAL.halfW }],
    ];
    posts.forEach(([a, b]) => {
      const speed = hitSegment(ball, a, b);
      if (speed > 1) events.push({ type: 'post', speed });
    });
  });
}

// binnen het doel: zijnetten, dak en achternet houden de bal vast
function insideGoal(ball, side, events) {
  const { pos, vel } = ball;
  const back = FIELD.halfL + GOAL.depth - R;
  let speed = 0;
  if (Math.abs(pos.x) > back) {
    pos.x = side * back;
    speed = reflect(vel, -side, 0, 0, BALL.net) || speed;
  }
  if (Math.abs(pos.z) > GOAL.halfW - R) {
    pos.z = Math.sign(pos.z) * (GOAL.halfW - R);
    speed = reflect(vel, 0, 0, -Math.sign(pos.z), BALL.net) || speed;
  }
  if (pos.y > GOAL.height - R) {
    pos.y = GOAL.height - R;
    speed = reflect(vel, 0, -1, 0, BALL.net) || speed;
  }
  if (!speed) return;
  vel.x *= BALL.netHold; // het net geeft mee en de bal zakt erin
  vel.z *= BALL.netHold;
  if (speed > 2) events.push({ type: 'net', speed });
}

function walls(ball, events) {
  const { pos, vel } = ball;
  let speed = 0;
  const side = Math.sign(pos.x);
  const endWall = FIELD.halfL - R;
  if (Math.abs(pos.x) > FIELD.halfL) {
    insideGoal(ball, side, events);
  } else if (Math.abs(pos.x) > endWall && !inMouth(pos)) {
    pos.x = side * endWall;
    speed = reflect(vel, -side, 0, 0, BALL.wall) || speed;
  }
  if (Math.abs(pos.z) > FIELD.halfW - R) {
    pos.z = Math.sign(pos.z) * (FIELD.halfW - R);
    speed = reflect(vel, 0, 0, -Math.sign(pos.z), BALL.wall) || speed;
  }
  if (speed) ball.curve = null;
  if (speed > 3) markRebound(ball); // hard tegen de rand: een kaatsbal voor de trucs
  if (pos.y > FIELD.ceiling - R) {
    pos.y = FIELD.ceiling - R;
    speed = reflect(vel, 0, -1, 0, BALL.wall) || speed;
  }
  if (speed > 1.5) events.push({ type: 'wall', speed });
}

function floor(ball, events) {
  const { pos, vel } = ball;
  if (pos.y > R) return;
  pos.y = R;
  if (vel.y < -1.6) {
    if (vel.y < -4) events.push({ type: 'bounce', speed: -vel.y });
    vel.y = -vel.y * BALL.bounce;
  } else {
    vel.y = 0;
  }
}

export function collideBall(ball, events) {
  floor(ball, events);
  hitFrame(ball, events);
  walls(ball, events);
}
