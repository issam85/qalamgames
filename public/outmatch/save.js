// De keeper tegen de bal: inschatten waar een schot aankomt, duiken, vangen of wegslaan.
import { BALL, GOAL, KEEPER } from './config.js';

// waar en wanneer de bal de lijn van de keeper kruist (null als hij niet op hem af komt)
export function predict(keeper, ball) {
  const vx = ball.vel.x * keeper.side;
  if (ball.owner || vx < 3) return null;
  const t = ((keeper.pos.x - ball.pos.x) * keeper.side) / vx;
  if (t < 0 || t > 1.4) return null;
  const z = ball.pos.z + ball.vel.z * t;
  const y = Math.max(BALL.radius, ball.pos.y + ball.vel.y * t - 0.5 * BALL.gravity * t * t);
  return { t, z, y };
}

// een schot dat op het doel afkomt: na de reactietijd kiezen of de keeper stapt of duikt
export function readShot(keeper, ball, level, dt) {
  const shot = predict(keeper, ball);
  if (!shot || Math.abs(shot.z) > GOAL.halfW + 0.6) {
    keeper.threat = 0;
    return null;
  }
  if (!keeper.threat) keeper.guess = (Math.random() - 0.5) * 2 * level.error; // eenmaal per schot
  keeper.threat += dt;
  if (keeper.threat < level.react) return null;
  return { ...shot, z: shot.z + keeper.guess };
}

export function startDive(keeper, toZ) {
  keeper.state = 'dive';
  keeper.timer = KEEPER.diveTime + KEEPER.windup;
  keeper.diveDir = Math.sign(toZ - keeper.pos.z) || 1;
  keeper.diveHigh = 0;
}

// dichtstbijzijnde afstand van de bal tot het lijf (staand: rechtop, duikend: plat in de lucht)
function reachOf(keeper, ball) {
  const { pos } = ball;
  const dx = Math.abs(pos.x - keeper.pos.x);
  if (keeper.state === 'dive' && keeper.timer < KEEPER.diveTime) {
    const dz = Math.max(0, Math.abs(pos.z - (keeper.pos.z + keeper.diveDir * 0.2)) - KEEPER.diveReach);
    const dy = Math.max(0, Math.abs(pos.y - (0.55 + keeper.diveHigh)) - 0.45);
    return Math.hypot(dx, dy, dz) - BALL.radius;
  }
  const dz = Math.abs(pos.z - keeper.pos.z);
  const dy = Math.max(0, pos.y - 2.05);
  return Math.hypot(dx, dy, Math.max(0, dz - KEEPER.reach)) - BALL.radius;
}

// raakt de bal de keeper: zacht = vangen, hard = wegslaan van het doel af
export function touchBall(keeper, ball, level, events) {
  if (keeper.cool > 0 || ball.owner || keeper.state === 'down' || keeper.state === 'hold') return;
  if (reachOf(keeper, ball) > 0) return;
  const speed = Math.hypot(ball.vel.x, ball.vel.y, ball.vel.z);
  if (speed < level.catch) {
    ball.owner = keeper;
    ball.lastTouch = keeper;
    keeper.state = 'hold';
    keeper.timer = KEEPER.hold;
    events.push({ type: 'save', keeper, caught: true });
    return;
  }
  const away = -keeper.side;
  ball.vel.x = away * Math.max(4, Math.abs(ball.vel.x) * 0.35);
  ball.vel.z = ball.vel.z * 0.3 + (Math.random() - 0.5) * 6;
  ball.vel.y = 3 + Math.random() * 2;
  ball.lastTouch = keeper;
  keeper.cool = 0.4;
  events.push({ type: 'save', keeper, caught: false });
}
