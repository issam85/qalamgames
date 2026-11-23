// Een voetballer: lopen, sprinten, draaien, de bal aannemen en dribbelen.
import { FIELD, PLAYER, CONTROL, BALL } from './config.js';
import { footDistance } from './kick.js';
import { stepTackle } from './tackle.js';
import { doActions } from './actions.js';

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
    tackle: 0, // tijd over van een tackle
    tackleCool: 0,
    tackleHit: false,
    stumble: 0, // even niets kunnen na een gemiste tackle
    held: {}, // welke actietoetsen vorige stap ingedrukt waren
  };
}

export function placePlayer(player, x, z) {
  Object.assign(player.pos, { x, z });
  Object.assign(player.vel, { x: 0, z: 0 });
  player.facing = player.aim = player.attack > 0 ? 0 : Math.PI;
  player.charge = 0;
  player.charging = false;
  player.tackle = player.stumble = 0;
}

function clampToField(player) {
  const lx = FIELD.halfL - PLAYER.radius, lz = FIELD.halfW - PLAYER.radius;
  if (Math.abs(player.pos.x) > lx) { player.pos.x = Math.sign(player.pos.x) * lx; player.vel.x = 0; }
  if (Math.abs(player.pos.z) > lz) { player.pos.z = Math.sign(player.pos.z) * lz; player.vel.z = 0; }
}

// tijdens een tackle schuif je door, struikelend kom je tot stilstand
function slide(player, dt) {
  if (player.tackle <= 0) {
    const f = Math.exp(-6 * dt);
    player.vel.x *= f;
    player.vel.z *= f;
  }
  player.pos.x += player.vel.x * dt;
  player.pos.z += player.vel.z * dt;
  clampToField(player);
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
  clampToField(player);
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
  if (ball.owner || ball.noTouch > 0 || player.stumble > 0) return;
  const rel = Math.hypot(ball.vel.x - player.vel.x, ball.vel.z - player.vel.z);
  const high = rel < CONTROL.softSpeed ? CONTROL.softHeight : CONTROL.height; // zachte ballen ook hoger
  if (ball.pos.y > high || rel > CONTROL.maxTrap) return;
  if (footDistance(player, ball) > CONTROL.reach) return;
  ball.owner = player;
  ball.lastTouch = player;
  ball.ownTime = 0;
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

// intent: { x, z, sprint, shoot, pass, lob, tackle } uit de toetsen (of later de CPU)
export function stepPlayer(player, intent, ball, mates, dt, events) {
  player.kickTime = Math.max(0, player.kickTime - dt);
  if (stepTackle(player, ball, dt, events)) slide(player, dt);
  else move(player, intent, dt);
  control(player, ball);
  doActions(player, intent, ball, mates, dt, events);
  dribble(player, ball, dt);
}
