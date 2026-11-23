// Trucs na een kaatsbal: schiet de bal tegen de rand en neem hem zelf weer aan.
// Flip reset: schiet binnen 3 s = een krulschot. Jezusloop: Lob = springen en 5 s door de lucht lopen.
import { TRICK, BALL, FIELD } from './config.js';

// de bal kaatst hard tegen de rand (aangeroepen vanuit collide.js)
export function markRebound(ball) {
  const by = ball.lastTouch;
  if (by && !by.keeper) ball.rebound = { by, age: 0 };
}

// de kaatsbal telt maar even, en niet meer als een ander hem heeft
export function stepRebound(ball, dt) {
  const r = ball.rebound;
  if (!r) return;
  r.age += dt;
  if (r.age > TRICK.catchTime || (ball.owner && ball.owner !== r.by)) ball.rebound = null;
}

// je neemt je eigen kaatsbal aan: de flip reset begint
export function onControl(player, ball, events) {
  const r = ball.rebound;
  ball.rebound = null;
  if (!r || r.by !== player || player.air > 0) return;
  player.flip = TRICK.flip;
  events.push({ type: 'flip', player });
}

// Lob na een kaatsbal: springen, de bal pakken en door de lucht lopen (één keer per wedstrijd)
export function tryJesus(player, ball, events) {
  if (player.jesusUsed || player.air > 0) return false;
  const r = ball.rebound;
  const near = Math.hypot(ball.pos.x - player.pos.x, ball.pos.z - player.pos.z) < TRICK.reach;
  const loose = !ball.owner && r && r.by === player && near && ball.pos.y < 3;
  if (!(ball.owner === player && player.flip > 0) && !loose) return false;
  Object.assign(ball, { owner: player, lastTouch: player, ownTime: 0, rebound: null });
  Object.assign(player, { flip: 0, air: TRICK.air, jesusUsed: true });
  events.push({ type: 'jesus', player });
  return true;
}

// elke stap: tijden aftellen en omhoog of omlaag zweven
export function stepTricks(player, ball, dt) {
  if (ball.owner !== player && !player.charging) player.flip = 0;
  else if (!player.charging) player.flip = Math.max(0, player.flip - dt);
  if (player.air > 0) {
    player.air = ball.owner === player ? Math.max(0, player.air - dt) : 0; // bal weg = landen
  }
  const want = player.air > 0 ? TRICK.height : 0;
  player.y += (want - player.y) * Math.min(1, dt * 8);
  if (player.y < 0.01) player.y = 0;
}

// waar een schot in richting angle de doellijn raakt
function zAt(player, ball, angle) {
  const goalX = player.attack * FIELD.halfL;
  return ball.pos.z - Math.sin(angle) * ((goalX - ball.pos.x) / Math.cos(angle));
}

// krulschot: eerst naar buiten, dan draait de bal terug naar waar je op mikte
export function curl(player, ball, angle) {
  const goalX = player.attack * FIELD.halfL;
  const toGoal = Math.cos(angle) * player.attack > 0.2;
  const d = TRICK.curl;
  let side = 1;
  if (toGoal) side = Math.abs(zAt(player, ball, angle + d)) > Math.abs(zAt(player, ball, angle - d)) ? 1 : -1;
  const length = Math.max(2, Math.abs(goalX - ball.pos.x) / Math.max(0.3, Math.abs(Math.cos(angle))));
  return { angle: angle + side * d, curve: { perMeter: (-2 * side * d) / length, left: length, by: player } };
}

// schieten vanuit de lucht: omlaag, zodat de bal op heuphoogte bij het doel is
export function airLift(player, ball, speed) {
  const goalX = player.attack * FIELD.halfL;
  const t = Math.max(0.15, Math.abs(goalX - ball.pos.x) / speed);
  const vy = (TRICK.airAim - ball.pos.y + (BALL.gravity / 2) * t * t) / t;
  return Math.max(-6, Math.min(6, vy));
}

// de krul: de richting van een vliegende bal draait per meter een stukje
export function bend(ball, dt) {
  const c = ball.curve;
  if (!c) return;
  if (ball.owner || ball.lastTouch !== c.by || c.left <= 0) {
    ball.curve = null;
    return;
  }
  const s = Math.hypot(ball.vel.x, ball.vel.z);
  const step = Math.min(c.left, s * dt);
  c.left -= step;
  const a = Math.atan2(-ball.vel.z, ball.vel.x) + c.perMeter * step;
  ball.vel.x = Math.cos(a) * s;
  ball.vel.z = -Math.sin(a) * s;
}
