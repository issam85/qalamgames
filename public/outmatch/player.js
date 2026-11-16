// Een voetballer: lopen, sprinten, draaien, de bal aannemen, dribbelen en schieten.
import { FIELD, PLAYER, CONTROL, SHOT, BALL } from './config.js';
import { kick, footDistance } from './kick.js';

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export function createPlayer({ id, team = 0, attack = 1, x = 0, z = 0 }) {
  return {
    id,
    team,
    attack, // 1 = scoort in het doel op +x
    pos: { x, z },
    vel: { x: 0, z: 0 },
    facing: attack > 0 ? 0 : Math.PI,
    aim: attack > 0 ? 0 : Math.PI,
    stamina: 1,
    tired: false,
    sprinting: false,
    charge: 0, // 0..1 terwijl je de schiettoets vasthoudt
    charging: false,
    kickTime: 0, // voor de animatie
  };
}

export function placePlayer(player, x, z) {
  Object.assign(player.pos, { x, z });
  Object.assign(player.vel, { x: 0, z: 0 });
  player.facing = player.aim = player.attack > 0 ? 0 : Math.PI;
  player.charge = 0;
  player.charging = false;
}

function stamina(player, wants, dt) {
  const moving = Math.hypot(player.vel.x, player.vel.z) > 1;
  player.sprinting = wants && moving && !player.tired && player.stamina > 0;
  if (player.sprinting) player.stamina = Math.max(0, player.stamina - PLAYER.drain * dt);
  else player.stamina = Math.min(1, player.stamina + PLAYER.regain * dt);
  if (player.stamina === 0) player.tired = true;
  if (player.tired && player.stamina >= PLAYER.rested) player.tired = false;
}

function move(player, intent, dt) {
  const { vel } = player;
  const len = Math.min(1, Math.hypot(intent.x, intent.z));
  stamina(player, intent.sprint, dt);
  const top = (player.sprinting ? PLAYER.sprint : PLAYER.run) * (player.charging ? 0.75 : 1);
  const tx = len ? (intent.x / Math.hypot(intent.x, intent.z)) * top * len : 0;
  const tz = len ? (intent.z / Math.hypot(intent.x, intent.z)) * top * len : 0;
  const dx = tx - vel.x, dz = tz - vel.z;
  const gap = Math.hypot(dx, dz);
  const rate = (len ? PLAYER.accel : PLAYER.brake) * dt;
  const f = gap > rate ? rate / gap : 1;
  vel.x += dx * f;
  vel.z += dz * f;
  player.pos.x += vel.x * dt;
  player.pos.z += vel.z * dt;
  const lx = FIELD.halfL - PLAYER.radius, lz = FIELD.halfW - PLAYER.radius;
  if (Math.abs(player.pos.x) > lx) { player.pos.x = Math.sign(player.pos.x) * lx; vel.x = 0; }
  if (Math.abs(player.pos.z) > lz) { player.pos.z = Math.sign(player.pos.z) * lz; vel.z = 0; }
  if (len > 0.2) {
    const want = Math.atan2(-intent.z, intent.x);
    player.aim = want;
    const off = wrap(want - player.facing);
    const turn = PLAYER.turn * dt;
    player.facing = wrap(player.facing + Math.max(-turn, Math.min(turn, off)));
  }
}

// de bal aannemen als hij dichtbij en laag genoeg is
function control(player, ball) {
  if (ball.owner === player) return;
  if (ball.owner || ball.noTouch > 0 || ball.pos.y > CONTROL.height) return;
  if (footDistance(player, ball) > CONTROL.reach) return;
  if (Math.hypot(ball.vel.x - player.vel.x, ball.vel.z - player.vel.z) > CONTROL.maxTrap) return;
  ball.owner = player;
  ball.lastTouch = player;
}

// de bal blijft vlak voor de voeten en rolt mee
function dribble(player, ball, dt) {
  if (ball.owner !== player) return;
  const tx = player.pos.x + Math.cos(player.facing) * CONTROL.hold;
  const tz = player.pos.z - Math.sin(player.facing) * CONTROL.hold;
  const f = Math.min(1, CONTROL.pull * dt);
  const nx = ball.pos.x + (tx - ball.pos.x) * f;
  const nz = ball.pos.z + (tz - ball.pos.z) * f;
  ball.vel.x = (nx - ball.pos.x) / dt;
  ball.vel.z = (nz - ball.pos.z) / dt;
  ball.vel.y = 0;
  ball.pos.x = nx;
  ball.pos.z = nz;
  ball.pos.y = BALL.radius;
}

// opladen zolang je vasthoudt, trappen bij loslaten
function shoot(player, ball, held, dt, events) {
  if (held) {
    player.charging = true;
    player.charge = Math.min(1, player.charge + dt / SHOT.charge);
    return;
  }
  if (!player.charging) return;
  player.charging = false;
  kick(player, ball, player.charge, events);
  player.charge = 0;
}

// intent: { x, z, sprint, shoot } uit de toetsen (of later de CPU)
export function stepPlayer(player, intent, ball, dt, events) {
  player.kickTime = Math.max(0, player.kickTime - dt);
  move(player, intent, dt);
  control(player, ball);
  shoot(player, ball, intent.shoot, dt, events);
  dribble(player, ball, dt);
}
