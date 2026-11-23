// Schieten: kracht opladen, richting (met een beetje hulp naar het doel) en de bal wegtrappen.
import { FIELD, GOAL, SHOT, CONTROL, BALL, TRICK } from './config.js';
import { curl, airLift } from './tricks.js';

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// een schot dat net naast zou gaan, buigt een beetje naar binnen de palen (nooit naar het midden)
export function aimAt(player, ball, angle) {
  const dirX = Math.cos(angle);
  if (dirX * player.attack < 0.2) return angle;
  const goalX = player.attack * FIELD.halfL;
  const zHit = ball.pos.z - Math.sin(angle) * ((goalX - ball.pos.x) / dirX);
  const inside = GOAL.halfW - SHOT.inside;
  if (Math.abs(zHit) <= inside) return angle;
  const toPost = Math.atan2(-(Math.sign(zHit) * inside - ball.pos.z), goalX - ball.pos.x);
  const off = wrap(toPost - angle);
  if (Math.abs(off) > SHOT.assistCone) return angle;
  return angle + off * SHOT.assist;
}

// afstand van de voeten (vlak voor de speler) tot de bal
export function footDistance(player, ball) {
  const fx = player.pos.x + Math.cos(player.facing) * 0.35;
  const fz = player.pos.z - Math.sin(player.facing) * 0.35;
  return Math.hypot(ball.pos.x - fx, ball.pos.z - fz);
}

export function canKick(player, ball) {
  if (ball.owner === player) return true;
  if (ball.owner || ball.pos.y > 1.2) return false;
  return footDistance(player, ball) < SHOT.volley;
}

// de bal wegtrappen met een snelheid; type = 'kick', 'pass' of 'lob'
export function launch(player, ball, vel, type, events, extra = {}) {
  ball.owner = null;
  ball.noTouch = CONTROL.noTouch;
  ball.lastTouch = player;
  ball.pos.y = Math.max(ball.pos.y, BALL.radius + 0.01);
  Object.assign(ball.vel, vel);
  player.kickTime = 0.25;
  events.push({ type, player, ...extra });
}

// power 0..1; geeft true als de bal geraakt is
export function kick(player, ball, power, events) {
  if (!canKick(player, ball)) return false;
  let angle = aimAt(player, ball, player.aim);
  const flip = player.flip > 0; // flip reset = krulschot, harder en met een bocht
  const speed = (SHOT.min + (SHOT.max - SHOT.min) * power) * (flip ? TRICK.power : 1);
  const bent = flip ? curl(player, ball, angle) : null;
  if (bent) angle = bent.angle;
  const lift = SHOT.lift + (SHOT.liftMax - SHOT.lift) * power * power;
  launch(player, ball, {
    x: Math.cos(angle) * speed,
    z: -Math.sin(angle) * speed,
    y: player.y > 0.3 ? airLift(player, ball, speed) : lift,
  }, 'kick', events, { power, curl: flip });
  ball.curve = bent && bent.curve;
  player.flip = 0;
  return true;
}
