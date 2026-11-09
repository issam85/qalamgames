// Spelregels zonder beeld: lopen, springen, landen en botsen. Los te testen.
import { PHYS, SPIKE_HIT, THORN_HIT } from './config.js';

// start = plek op de grond om te beginnen; in de oefenmodus het laatste checkpoint
export function createRun(level, start = 0) {
  let zone = 0;
  while (zone + 1 < level.zones.length && level.zones[zone + 1].x <= start) zone++;
  return {
    level, x: start, y: 0, vy: 0, floor: 0, grounded: true, buffer: 0, cursor: 0, state: 'run', zone,
    used: new Set(), // al gebruikte ringen en veren (nieuwe Set per gebruik: te kopiëren)
    events: [], // voor beeld en geluid: jump, land, boost
  };
}

function hitsHazard(run, ob, hit) {
  const left = ob.x + hit.inset;
  const right = ob.x + ob.w - hit.inset;
  return run.x + PHYS.half > left && run.x - PHYS.half < right
    && run.y < ob.y + hit.height && run.y + PHYS.half * 2 > ob.y;
}

function launch(run, ob, power) {
  run.vy = power;
  run.grounded = false;
  run.buffer = 0;
  run.used = new Set(run.used).add(ob);
  run.events.push({ type: 'boost', kind: ob.type, x: run.x, y: run.y });
}

function tryBoost(run, ob, held) {
  if (run.used.has(ob)) return;
  if (ob.type === 'pad') {
    if (run.vy <= 0 && run.y <= ob.y + ob.h + 0.05) launch(run, ob, PHYS.pad);
  } else if (run.y + PHYS.half * 2 > ob.y && run.y < ob.y + ob.h && (held || run.buffer > 0)) {
    launch(run, ob, PHYS.ring);
  }
}

// een blok: erop staan, erop landen, of ertegenaan botsen
function touchBlock(run, ob, prevY, floor) {
  const top = ob.y + ob.h;
  if (run.y >= top) return Math.max(floor, top);
  if (run.y + PHYS.half * 2 <= ob.y) return floor;
  if (prevY >= top - PHYS.landTolerance && run.vy <= 0) return Math.max(floor, top);
  run.state = 'dead';
  return floor;
}

// bekijkt alles dat de speler horizontaal raakt en zoekt de hoogste steun eronder
function resolve(run, prevY, held) {
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
    if (ob.type === 'block') floor = touchBlock(run, ob, prevY, floor);
    else if (ob.type === 'spike') run.state = hitsHazard(run, ob, SPIKE_HIT) ? 'dead' : run.state;
    else if (ob.type === 'thorn') run.state = hitsHazard(run, ob, THORN_HIT) ? 'dead' : run.state;
    else tryBoost(run, ob, held);
  }
  return floor;
}

// elk stuk van het level heeft zijn eigen snelheid en kleur
function updateZone(run) {
  const { zones } = run.level;
  if (run.zone + 1 < zones.length && run.x >= zones[run.zone + 1].x) {
    run.zone++;
    run.events.push({ type: 'zone', title: zones[run.zone].title });
  }
}

export function stepRun(run, held, pressed) {
  const dt = PHYS.step;
  run.buffer = pressed ? PHYS.buffer : Math.max(0, run.buffer - dt);
  run.x += run.level.zones[run.zone].speed * dt;
  updateZone(run);
  if (run.grounded && (held || run.buffer > 0)) {
    run.vy = PHYS.jump;
    run.grounded = false;
    run.buffer = 0;
    run.events.push({ type: 'jump', x: run.x, y: run.y });
  }
  const prevY = run.y;
  if (!run.grounded) {
    run.vy -= PHYS.gravity * dt;
    run.y += run.vy * dt;
  }
  run.floor = resolve(run, prevY, held);
  if (run.state === 'dead') return;
  if (!run.grounded && run.vy <= 0 && run.y <= run.floor) {
    run.y = run.floor;
    run.vy = 0;
    run.grounded = true;
    run.events.push({ type: 'land', x: run.x, y: run.y });
  } else if (run.grounded && run.y > run.floor) {
    run.grounded = false;
    run.vy = 0;
  }
  if (run.x >= run.level.length) run.state = 'won';
}
