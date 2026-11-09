// Spelregels zonder beeld: lopen, springen, landen en botsen. Los te testen.
import { PHYS, SPIKE_HIT } from './config.js';

export function createRun(level) {
  return { level, x: 0, y: 0, vy: 0, floor: 0, grounded: true, buffer: 0, cursor: 0, state: 'run' };
}

function hitsSpike(run, ob) {
  const left = ob.x + SPIKE_HIT.inset;
  const right = ob.x + ob.w - SPIKE_HIT.inset;
  return run.x + PHYS.half > left && run.x - PHYS.half < right
    && run.y < ob.y + SPIKE_HIT.height && run.y + PHYS.half * 2 > ob.y;
}

// bekijkt alles dat de speler horizontaal raakt en zoekt de hoogste steun eronder
function resolve(run, prevY) {
  const { obstacles } = run.level;
  const right = run.x + PHYS.half;
  const left = run.x - PHYS.half;
  let floor = 0;
  while (run.cursor < obstacles.length && obstacles[run.cursor].x + obstacles[run.cursor].w < left) {
    run.cursor++;
  }
  for (let i = run.cursor; i < obstacles.length; i++) {
    const ob = obstacles[i];
    if (ob.x >= right) break;
    if (ob.x + ob.w <= left) continue;
    if (ob.type === 'spike') {
      if (hitsSpike(run, ob)) run.state = 'dead';
      continue;
    }
    const top = ob.y + ob.h;
    if (run.y >= top) {
      floor = Math.max(floor, top);
    } else if (run.y + PHYS.half * 2 > ob.y) {
      if (prevY >= top - PHYS.landTolerance && run.vy <= 0) floor = Math.max(floor, top);
      else run.state = 'dead';
    }
  }
  return floor;
}

export function stepRun(run, held, pressed) {
  const dt = PHYS.step;
  run.buffer = pressed ? PHYS.buffer : Math.max(0, run.buffer - dt);
  run.x += PHYS.speed * dt;
  if (run.grounded && (held || run.buffer > 0)) {
    run.vy = PHYS.jump;
    run.grounded = false;
    run.buffer = 0;
  }
  const prevY = run.y;
  if (!run.grounded) {
    run.vy -= PHYS.gravity * dt;
    run.y += run.vy * dt;
  }
  run.floor = resolve(run, prevY);
  if (run.state === 'dead') return;
  if (!run.grounded && run.vy <= 0 && run.y <= run.floor) {
    run.y = run.floor;
    run.vy = 0;
    run.grounded = true;
  } else if (run.grounded && run.y > run.floor) {
    run.grounded = false;
    run.vy = 0;
  }
  if (run.x >= run.level.length) run.state = 'won';
}
