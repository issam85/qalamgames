// Sterrenjacht: de CPU-spelers. Ze kiezen een ster, lopen er met hun eigen tempo
// heen, springen soms naar een hoge ster, doen af en toe een salto en geven af en toe
// een duw aan wie naast ze staat.
import { GROUND, SPEED, CATCH_H, jump } from './sterren-world.js';
import { push, canPush } from './sterren-push.js';

// geeft de geduwde terug, of null
export function cpuPush(h, hunters, stars, dt) {
  if (!canPush(h) || Math.random() > dt * 0.5) return null;
  const near = hunters.some((o) => o !== h && o.jumpT < 0 && Math.abs(o.x - h.x) < 70);
  if (!near) return null;
  const o = hunters.find((o) => o !== h && Math.abs(o.x - h.x) < 70);
  h.facing = o.x < h.x ? -1 : 1;
  return push(h, hunters, stars);
}

// de CPU kiest de ster die het snelst op de grond is en nog te halen valt, en loopt
// er met zijn eigen tempo heen; soms een korte pauze, en wie ver voorligt wordt trager.
// Een ster waar een andere CPU al op jaagt, laat hij liever liggen
export function cpuDir(h, stars, dt, leadOnHumans, hunters) {
  const c = h.cpu;
  c.pause = Math.max(0, c.pause - dt);
  if (c.pause > 0) return 0;
  if (!c.target || !stars.includes(c.target)) {
    const claimed = hunters.filter((o) => o !== h && o.cpu).map((o) => o.cpu.target);
    let best = null;
    let bestT = Infinity;
    stars.forEach((s) => {
      const t = (GROUND - CATCH_H - s.y) / s.vy + (claimed.includes(s) ? 2 : 0);
      if (t < 0 || t > bestT) return;
      const reach = Math.abs(s.x + s.vx * t - h.x) / (SPEED * c.skill);
      if (reach < t + 0.3) {
        best = s;
        bestT = t;
      }
    });
    c.target = best;
    if (Math.random() < 0.08) c.pause = 0.25 + Math.random() * 0.3;
  }
  if (!c.target) return 0;
  const dx = c.target.x - h.x;
  if (Math.abs(dx) < 8) return 0;
  const slow = leadOnHumans >= 4 ? 0.6 : 1;
  return Math.sign(dx) * c.skill * slow;
}

// de CPU springt soms naar een ster die hoog boven hem hangt, af en toe met salto
export function cpuJump(h) {
  const t = h.cpu.target;
  if (!t || h.jumpT >= 0 || Math.abs(t.x - h.x) > 30) return;
  if (t.y < GROUND - 300 || t.y > GROUND - 190 || Math.random() > 0.08) return;
  jump(h);
  h.cpu.wantTrick = Math.random() < 0.4;
}
