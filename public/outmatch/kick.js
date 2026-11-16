// Schieten: kracht opladen, richting (met een beetje hulp naar het doel) en de bal wegtrappen.
import { FIELD, SHOT, CONTROL, BALL } from './config.js';

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// stuurt een schot een beetje bij als je al ongeveer naar het doel van de tegenstander kijkt
export function aimAt(player, ball, angle) {
  const goalX = player.attack * FIELD.halfL;
  const toGoal = Math.atan2(-ball.pos.z, goalX - ball.pos.x);
  const off = wrap(toGoal - angle);
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

// power 0..1; geeft true als de bal geraakt is
export function kick(player, ball, power, events) {
  if (!canKick(player, ball)) return false;
  const angle = aimAt(player, ball, player.aim);
  const speed = SHOT.min + (SHOT.max - SHOT.min) * power;
  ball.owner = null;
  ball.noTouch = CONTROL.noTouch;
  ball.lastTouch = player;
  ball.pos.y = Math.max(ball.pos.y, BALL.radius + 0.01);
  ball.vel.x = Math.cos(angle) * speed;
  ball.vel.z = -Math.sin(angle) * speed;
  ball.vel.y = SHOT.lift + (SHOT.liftMax - SHOT.lift) * power * power;
  player.kickTime = 0.25;
  events.push({ type: 'kick', power, player });
  return true;
}
