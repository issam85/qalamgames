// Sterrenjacht: de vallende sterren, het lopen en vangen, en de CPU-spelers.
// Alle vier lopen op dezelfde grasheuvel en jagen op dezelfde sterren.
import { createSprite, play } from './sprites.js';
import { W } from './stage2d.js';

export const GROUND = 470;
export const SPEED = 330; // looptempo (px/s)
export const CATCH_H = 110; // zo hoog boven de grond kun je een ster vangen
const CATCH_W = 46;
const SPAWN_EVERY = 0.45;
const BIG_EVERY = 6; // elke zesde ster is een grote (3 punten)
const MARGIN = 60;

export function createHunter(player, i) {
  const cpu = player.control === 'CPU'
    ? { skill: 0.72 + Math.random() * 0.2, pause: 0, target: null }
    : null;
  return {
    player, cpu, x: 180 + i * 200, dir: 0, facing: 1, score: 0, lastCatch: 0,
    glow: 0, sprite: createSprite(player.character.key),
  };
}

export function spawnStar(stars, time, n) {
  const big = n % BIG_EVERY === BIG_EVERY - 1;
  stars.push({
    x: MARGIN + Math.random() * (W - MARGIN * 2), y: -40,
    vy: (big ? 110 : 130) + Math.random() * 70, vx: (Math.random() - 0.5) * 50,
    r: big ? 30 : 19, worth: big ? 3 : 1, rot: Math.random() * Math.PI, born: time,
  });
}

// de CPU kiest de ster die het snelst op de grond is en nog te halen valt, en loopt
// er met zijn eigen tempo heen; soms een korte pauze, en wie ver voorligt wordt trager.
// Een ster waar een andere CPU al op jaagt, laat hij liever liggen
function cpuDir(h, stars, dt, leadOnHumans, hunters) {
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

// dir: -1..1 (CPU's een eigen tempo); zet positie, richting en animatie
export function moveHunter(h, dir, dt) {
  h.dir = dir;
  h.x = Math.max(MARGIN, Math.min(W - MARGIN, h.x + dir * SPEED * dt));
  if (dir !== 0) h.facing = dir < 0 ? -1 : 1;
  play(h.sprite, dir !== 0 ? 'run' : 'idle');
  h.glow = Math.max(0, h.glow - dt * 2);
}

export function stepHunters(hunters, stars, input, dt) {
  const humans = hunters.filter((h) => !h.cpu).map((h) => h.score);
  const top = humans.length ? Math.max(...humans) : 0;
  hunters.forEach((h, i) => {
    const dir = h.cpu ? cpuDir(h, stars, dt, h.score - top, hunters) : input.dir(i);
    moveHunter(h, dir, dt);
  });
}

// laat de sterren vallen; gevangen sterren tellen voor de dichtstbijzijnde vanger.
// Geeft de vangsten terug ({ hunter, star }) en de sterren die op de grond vielen
export function stepStars(stars, hunters, dt, time) {
  const caught = [];
  const missed = [];
  for (let i = stars.length - 1; i >= 0; i--) {
    const s = stars[i];
    s.y += s.vy * dt;
    s.x += s.vx * dt;
    s.rot += dt * 2;
    if (s.y > GROUND - CATCH_H) {
      let best = null;
      hunters.forEach((h) => {
        const d = Math.abs(h.x - s.x);
        if (d < CATCH_W && (!best || d < Math.abs(best.x - s.x))) best = h;
      });
      if (best) {
        best.score += s.worth;
        best.lastCatch = time;
        best.glow = 1;
        caught.push({ hunter: best, star: s });
        stars.splice(i, 1);
        continue;
      }
    }
    if (s.y > GROUND - 10) {
      missed.push(s);
      stars.splice(i, 1);
    }
  }
  return { caught, missed };
}

export { SPAWN_EVERY };
