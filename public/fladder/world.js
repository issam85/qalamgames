// Spelregels zonder tekenen (zo te testen): musje, kaastorens, punten en botsen.
import { PHYS, TOWER, SPEED, GROUND } from './config.js';

export const birdX = (w) => Math.min(w * 0.28, 260);

// Opening van de n-de toren (0 = de eerste).
export function gapFor(n) {
  if (n < TOWER.easyTowers) return TOWER.firstGap;
  return Math.max(TOWER.minGap, TOWER.firstGap - (n - TOWER.easyTowers + 1) * TOWER.shrink);
}

export const speedFor = (score) => Math.min(SPEED.max, SPEED.start + score * SPEED.perPoint);

export function createWorld(w, h, rnd = Math.random) {
  const bird = { x: birdX(w), y: h * 0.42, vy: 0, flapAt: -1 };
  return {
    w, h, ground: h - GROUND, bird, rnd,
    towers: [], spawned: 0, score: 0, state: 'ready',
    time: 0, dist: 0, nextX: Math.max(w + 40, bird.x + 420), lastCenter: h * 0.45,
    baseY: bird.y,
  };
}

// Eén fladder. Op het klaarscherm begint het spel ermee.
export function flap(world) {
  if (world.state === 'ready') world.state = 'play';
  if (world.state !== 'play') return false;
  world.bird.vy = PHYS.flap;
  world.bird.flapAt = world.time;
  return true;
}

function spawn(world) {
  const gap = gapFor(world.spawned);
  const lo = TOWER.margin + gap / 2;
  const hi = world.ground - 40 - gap / 2;
  const wish = world.lastCenter + (world.rnd() * 2 - 1) * TOWER.maxShift;
  const center = Math.min(hi, Math.max(lo, wish));
  world.lastCenter = center;
  world.towers.push({
    x: world.nextX, top: center - gap / 2, bottom: center + gap / 2,
    passed: false, seed: world.rnd(),
  });
  world.spawned++;
  world.nextX += TOWER.spacing;
}

function circleHitsRect(cx, cy, r, x, y, w, h) {
  const nx = Math.max(x, Math.min(cx, x + w));
  const ny = Math.max(y, Math.min(cy, y + h));
  return (cx - nx) ** 2 + (cy - ny) ** 2 < r * r;
}

export function hitsTower(world, t) {
  const { x, y } = world.bird;
  const r = PHYS.radius * 0.85;
  const left = t.x - TOWER.width / 2;
  return circleHitsRect(x, y, r, left, -1000, TOWER.width, t.top + 1000)
    || circleHitsRect(x, y, r, left, t.bottom, TOWER.width, world.ground - t.bottom);
}

function fall(world, dt) {
  const b = world.bird;
  b.vy = Math.min(PHYS.maxFall, b.vy + PHYS.gravity * dt);
  b.y += b.vy * dt;
}

// Een stapje vooruit; wat er gebeurt (punt, botsing, landen) komt in `events`.
export function step(world, dt, events = []) {
  world.time += dt;
  const b = world.bird;
  if (world.state === 'ready') {
    world.dist += SPEED.start * dt;
    b.y = world.baseY + Math.sin(world.time * 4) * 8;
    return events;
  }
  if (world.state === 'play') {
    const move = speedFor(world.score) * dt;
    world.dist += move;
    world.nextX -= move;
    for (const t of world.towers) t.x -= move;
    while (world.nextX < world.w + TOWER.width) spawn(world);
    world.towers = world.towers.filter((t) => t.x > -TOWER.width);
    fall(world, dt);
    for (const t of world.towers) {
      if (!t.passed && t.x + TOWER.width / 2 < b.x) {
        t.passed = true;
        world.score++;
        events.push({ type: 'point', score: world.score });
      }
    }
    const crash = b.y - PHYS.radius < 0 || b.y + PHYS.radius > world.ground
      || world.towers.some((t) => hitsTower(world, t));
    if (crash) {
      world.state = 'fall';
      b.vy = Math.max(b.vy, -120);
      events.push({ type: 'hit' });
    }
    return events;
  }
  if (world.state === 'fall') {
    fall(world, dt);
    if (b.y + PHYS.radius >= world.ground) {
      b.y = world.ground - PHYS.radius;
      world.state = 'over';
      events.push({ type: 'land' });
    }
  }
  return events;
}
