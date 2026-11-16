// Wat een speler met de bal doet: schieten (opladen), passen, lobben en tackelen.
import { SHOT } from './config.js';
import { kick } from './kick.js';
import { pass, lob } from './pass.js';
import { startTackle } from './tackle.js';

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

// een toets telt één keer per indrukken
function pressed(player, intent, name) {
  const now = Boolean(intent[name]);
  const was = player.held[name];
  player.held[name] = now;
  return now && !was;
}

export function doActions(player, intent, ball, mates, dt, events) {
  const busy = player.tackle > 0 || player.stumble > 0;
  if (busy) {
    player.charging = false;
    player.charge = 0;
  } else {
    shoot(player, ball, intent.shoot, dt, events);
  }
  const p = pressed(player, intent, 'pass');
  const l = pressed(player, intent, 'lob');
  const t = pressed(player, intent, 'tackle');
  if (busy || player.charging) return;
  if (p) pass(player, ball, mates, events);
  else if (l) lob(player, ball, mates, events);
  else if (t) startTackle(player, ball);
}
