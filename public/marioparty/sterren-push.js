// Sterrenjacht: duwen. Een zet in de kijkrichting; wie dichtbij staat vliegt opzij,
// is even duizelig (kan niet lopen, springen of vangen) en laat één ster vallen.
import { play } from './sprites.js';
import { W } from './stage2d.js';

const RANGE = 80; // zo ver reikt een duw
const COOLDOWN = 1.2; // wachttijd tussen twee duwen (s)
const DAZE = 0.6; // duizelig (s)
const KNOCK = 150; // zo ver vlieg je opzij (px)
const KNOCK_T = 0.35;
const MARGIN = 60;

export function canPush(h) {
  return h.jumpT < 0 && h.cool <= 0 && h.daze <= 0;
}

// geeft de geduwde terug, of null; stars krijgt de gevallen ster erbij
export function push(h, hunters, stars) {
  if (!canPush(h)) return null;
  h.cool = COOLDOWN;
  h.shove = 0.25;
  let target = null;
  hunters.forEach((o) => {
    if (o === h || o.jumpT >= 0 || o.daze > 0) return;
    const dx = o.x - h.x;
    if (dx * h.facing <= 0 || Math.abs(dx) > RANGE) return;
    if (!target || Math.abs(dx) < Math.abs(target.x - h.x)) target = o;
  });
  if (!target) return null;
  target.daze = DAZE;
  target.knock = { vx: (h.facing * KNOCK) / KNOCK_T, t: KNOCK_T };
  target.jumpT = -1;
  play(target.sprite, 'sad', true);
  if (target.score > 0) {
    target.score -= 1;
    stars.push({
      x: target.x + h.facing * 30, y: 330, vy: 70, vx: h.facing * 40,
      r: 19, worth: 1, rot: 0, born: 0,
    });
  }
  return target;
}

// wachttijd, duw-beweging, duizeligheid en wegvliegen bijwerken
export function stepPush(h, dt) {
  h.cool = Math.max(0, h.cool - dt);
  h.shove = Math.max(0, h.shove - dt);
  h.daze = Math.max(0, h.daze - dt);
  if (h.knock) {
    h.x = Math.max(MARGIN, Math.min(W - MARGIN, h.x + h.knock.vx * dt));
    h.knock.t -= dt;
    if (h.knock.t <= 0) h.knock = null;
  }
}
