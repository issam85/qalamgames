// Spelregels zonder beeld: lopen, springen, vliegen, landen en botsen. Los te testen.
import { PHYS } from './config.js';
import { HAZARDS } from './hazards.js';

const HEIGHT = PHYS.half * 2;
const indexAt = (list, x) => {
  let i = 0;
  while (i + 1 < list.length && list[i + 1].x <= x) i++;
  return i;
};

// start = plek op de grond om te beginnen; in de oefenmodus het laatste checkpoint
export function createRun(level, start = 0) {
  const portal = indexAt(level.portals, start);
  return {
    level, x: start, y: 0, vy: 0, floor: 0, grounded: true, buffer: 0, ringBuffer: 0, cursor: 0,
    state: 'run', zone: indexAt(level.zones, start), portal, fly: level.portals[portal].mode === 'fly',
    used: new Set(), // al gebruikte ringen en veren (nieuwe Set per gebruik: te kopiëren)
    events: [], // voor beeld: jump, land, boost, zone, portal
  };
}

function launch(run, ob, power) {
  run.vy = power;
  run.grounded = false;
  run.buffer = 0;
  run.ringBuffer = 0;
  run.used = new Set(run.used).add(ob);
  run.events.push({ type: 'boost', kind: ob.type, x: run.x, y: run.y });
}

function tryBoost(run, ob, held) {
  if (run.fly || run.used.has(ob)) return;
  if (ob.type === 'pad') {
    if (run.vy <= 0 && run.y <= ob.y + ob.h + 0.05) launch(run, ob, PHYS.pad);
  } else if (run.y + HEIGHT > ob.y && run.y < ob.y + ob.h && (held || run.ringBuffer > 0)) {
    launch(run, ob, PHYS.ring);
  }
}

// een blok: erop staan of landen, met het tapijt langs de onderkant schuiven, of botsen
function touchBlock(run, ob, prevY, room) {
  const top = ob.y + ob.h;
  if (run.y >= top) room.floor = Math.max(room.floor, top);
  else if (run.y + HEIGHT <= ob.y) room.ceiling = Math.min(room.ceiling, ob.y);
  else if (prevY >= top - PHYS.landTolerance && run.vy <= 0) room.floor = Math.max(room.floor, top);
  else if (run.fly && prevY + HEIGHT <= ob.y + PHYS.landTolerance && run.vy >= 0) {
    room.ceiling = Math.min(room.ceiling, ob.y);
  } else run.state = 'dead';
}

// bekijkt alles dat de speler horizontaal raakt: steun eronder, plafond erboven, gevaar
function resolve(run, prevY, held) {
  const { obstacles } = run.level;
  const right = run.x + PHYS.half;
  const left = run.x - PHYS.half;
  const room = { floor: 0, ceiling: Infinity };
  while (run.cursor < obstacles.length && obstacles[run.cursor].x + obstacles[run.cursor].w < left) {
    run.cursor++;
  }
  for (let i = run.cursor; i < obstacles.length; i++) {
    const ob = obstacles[i];
    if (ob.x >= right) break;
    if (ob.x + ob.w <= left) continue;
    if (ob.type === 'block') touchBlock(run, ob, prevY, room);
    else if (HAZARDS[ob.type]) run.state = HAZARDS[ob.type](run, ob) ? 'dead' : run.state;
    else tryBoost(run, ob, held);
  }
  return room;
}

// elk stuk van het level heeft zijn eigen snelheid en kleur; poorten wisselen lopen en vliegen
function updatePlace(run) {
  const { zones, portals } = run.level;
  if (run.zone + 1 < zones.length && run.x >= zones[run.zone + 1].x) {
    run.zone++;
    run.events.push({ type: 'zone', title: zones[run.zone].title });
  }
  if (run.portal + 1 < portals.length && run.x >= portals[run.portal + 1].x) {
    run.portal++;
    run.fly = portals[run.portal].mode === 'fly';
    run.grounded = false;
    run.events.push({ type: 'portal', mode: portals[run.portal].mode, x: run.x, y: run.y });
  }
}

// vasthouden = omhoog, loslaten = zakken
function fly(run, held, dt) {
  const push = held ? PHYS.flyUp : -PHYS.flyDown;
  run.vy = Math.max(-PHYS.flyMax, Math.min(PHYS.flyMax, run.vy + push * dt));
  run.y += run.vy * dt;
}

function walk(run, held, dt) {
  if (run.grounded && (held || run.buffer > 0)) {
    run.vy = PHYS.jump;
    run.grounded = false;
    run.buffer = 0;
    run.events.push({ type: 'jump', x: run.x, y: run.y });
  }
  if (!run.grounded) {
    run.vy -= PHYS.gravity * dt;
    run.y += run.vy * dt;
  }
}

function settle(run, room) {
  if (run.fly) {
    if (run.y <= room.floor) [run.y, run.vy] = [room.floor, Math.max(0, run.vy)];
    if (run.y + HEIGHT >= room.ceiling) [run.y, run.vy] = [room.ceiling - HEIGHT, Math.min(0, run.vy)];
  } else if (!run.grounded && run.vy <= 0 && run.y <= room.floor) {
    run.y = room.floor;
    run.vy = 0;
    run.grounded = true;
    run.events.push({ type: 'land', x: run.x, y: run.y });
  } else if (run.grounded && run.y > room.floor) {
    run.grounded = false;
    run.vy = 0;
  }
}

export function stepRun(run, held, pressed) {
  const dt = PHYS.step;
  run.buffer = pressed ? PHYS.buffer : Math.max(0, run.buffer - dt);
  // alleen een druk in de lucht telt voor een ring; een sprong vanaf de grond niet
  run.ringBuffer = pressed && !run.grounded ? PHYS.ringBuffer : Math.max(0, run.ringBuffer - dt);
  run.x += run.level.zones[run.zone].speed * dt;
  updatePlace(run);
  const prevY = run.y;
  if (run.fly) fly(run, held, dt);
  else walk(run, held, dt);
  const room = resolve(run, prevY, held);
  run.floor = room.floor;
  if (run.state === 'dead') return;
  settle(run, room);
  if (run.x >= run.level.length) run.state = 'won';
}
