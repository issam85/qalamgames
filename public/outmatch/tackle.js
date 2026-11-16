// Tackelen: een korte uitval naar voren. Raak je de bal, dan schiet hij los; mis = even struikelen.
import { TACKLE, CONTROL } from './config.js';
import { footDistance } from './kick.js';

export function startTackle(player, ball) {
  if (player.tackle > 0 || player.stumble > 0 || player.tackleCool > 0) return false;
  if (ball.owner === player) return false; // met de bal tackel je niet
  player.tackle = TACKLE.time;
  player.tackleCool = TACKLE.cool;
  player.tackleHit = false;
  player.vel.x = Math.cos(player.aim) * TACKLE.speed;
  player.vel.z = -Math.sin(player.aim) * TACKLE.speed;
  player.facing = player.aim;
  return true;
}

// tijdens de uitval: bal in de buurt (los of bij een tegenstander) = wegtikken
export function stepTackle(player, ball, dt, events) {
  player.tackleCool = Math.max(0, player.tackleCool - dt);
  if (player.stumble > 0) {
    player.stumble = Math.max(0, player.stumble - dt);
    return true;
  }
  if (player.tackle <= 0) return false;
  player.tackle -= dt;
  const keeperHolds = ball.owner && ball.owner.keeper;
  const mate = ball.owner && ball.owner.team === player.team;
  if (!player.tackleHit && !keeperHolds && !mate && ball.pos.y < 1 && footDistance(player, ball) < TACKLE.reach) {
    const victim = ball.owner;
    ball.owner = null;
    ball.noTouch = CONTROL.noTouch * 0.5;
    ball.lastTouch = player;
    ball.vel.x = Math.cos(player.facing) * TACKLE.poke + (Math.random() - 0.5) * 2;
    ball.vel.z = -Math.sin(player.facing) * TACKLE.poke + (Math.random() - 0.5) * 2;
    ball.vel.y = 1;
    player.tackleHit = true;
    if (victim) victim.stumble = TACKLE.stumble * 0.6;
    events.push({ type: 'tackle', player, victim });
  }
  if (player.tackle <= 0 && !player.tackleHit) {
    player.stumble = TACKLE.stumble;
    events.push({ type: 'stumble', player });
  }
  return true;
}
