// De bal: vliegen, stuiteren, rollen en wanneer hij helemaal over de doellijn is.
import { FIELD, GOAL, BALL } from './config.js';
import { collideBall } from './collide.js';
import { stepRebound, bend } from './tricks.js';

export function createBall() {
  return {
    pos: { x: 0, y: BALL.radius, z: 0 },
    vel: { x: 0, y: 0, z: 0 },
    owner: null, // de speler die dribbelt
    noTouch: 0, // even niet aan te nemen na een trap
    lastTouch: null,
    ownTime: 0, // zo lang heeft de huidige eigenaar de bal al
    rebound: null, // net tegen de rand gekaatst: { by, age }
    curve: null, // krulschot: { rate, time, by }
  };
}

export function placeBall(ball, x = 0, z = 0) {
  Object.assign(ball.pos, { x, y: BALL.radius, z });
  Object.assign(ball.vel, { x: 0, y: 0, z: 0 });
  Object.assign(ball, { owner: null, noTouch: 0, rebound: null, curve: null });
}

export function onGround(ball) {
  return ball.pos.y <= BALL.radius + 0.02;
}

function fly(ball, dt) {
  const { pos, vel } = ball;
  const drag = Math.exp(-BALL.airDrag * dt);
  vel.x *= drag;
  vel.z *= drag;
  if (onGround(ball) && Math.abs(vel.y) < 0.01) {
    const roll = Math.exp(-BALL.roll * dt);
    vel.x *= roll;
    vel.z *= roll;
    if (Math.hypot(vel.x, vel.z) < 0.05) vel.x = vel.z = 0;
  } else {
    vel.y -= BALL.gravity * dt;
  }
  pos.x += vel.x * dt;
  pos.y += vel.y * dt;
  pos.z += vel.z * dt;
}

// welk doel (-1 of 1) de bal net helemaal in ging, anders 0
export function goalSide(ball) {
  const { pos } = ball;
  if (Math.abs(pos.x) < FIELD.halfL + BALL.radius) return 0;
  if (Math.abs(pos.z) > GOAL.halfW || pos.y > GOAL.height) return 0;
  return Math.sign(pos.x);
}

// één tijdstap voor een losse bal; een gedribbelde bal beweegt met de speler mee
export function stepBall(ball, dt, events) {
  ball.noTouch = Math.max(0, ball.noTouch - dt);
  ball.ownTime = ball.owner ? ball.ownTime + dt : 0;
  stepRebound(ball, dt);
  if (ball.owner) return;
  bend(ball, dt);
  const sub = dt / BALL.substeps;
  for (let i = 0; i < BALL.substeps; i++) {
    fly(ball, sub);
    collideBall(ball, events);
  }
}
