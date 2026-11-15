// Bewegen: lopen en springen (ook ondersteboven), vliegen, en neerkomen na een stap.
import { PHYS } from './config.js';

const HEIGHT = PHYS.half * 2;
const LOST = 12; // ondersteboven boven deze hoogte = weggevallen

// vasthouden = omhoog, loslaten = zakken
export function fly(run, held, dt) {
  const push = held ? PHYS.flyUp : -PHYS.flyDown;
  run.vy = Math.max(-PHYS.flyMax, Math.min(PHYS.flyMax, run.vy + push * dt));
  run.y += run.vy * dt;
}

// ondersteboven werkt alles andersom: springen gaat omlaag, vallen gaat omhoog
export function walk(run, held, dt) {
  const dir = run.flip ? -1 : 1;
  if (run.grounded && (held || run.buffer > 0)) {
    run.vy = PHYS.jump * dir;
    run.grounded = false;
    run.buffer = 0;
    run.events.push({ type: 'jump', x: run.x, y: run.y });
  }
  if (!run.grounded) {
    run.vy -= PHYS.gravity * dt * dir;
    run.y += run.vy * dt;
  }
}

function land(run, y, contact) {
  run.y = y;
  run.vy = 0;
  run.grounded = true;
  run.events.push({ type: 'land', x: run.x, y: contact });
}

// ondersteboven: je staat onder het plafond; de vloer is alleen iets om tegen te botsen
function settleFlipped(run, room) {
  if (run.y <= room.floor) [run.y, run.vy] = [room.floor, Math.max(0, run.vy)];
  if (!run.grounded && run.vy >= 0 && run.y + HEIGHT >= room.ceiling) {
    land(run, room.ceiling - HEIGHT, room.ceiling);
  } else if (run.grounded && run.y + HEIGHT < room.ceiling) {
    run.grounded = false; // van de rand van het plafond af: omhoog vallen
    run.vy = 0;
  }
  if (run.y > LOST) run.state = 'dead';
}

export function settle(run, room) {
  if (run.fly) {
    if (run.y <= room.floor) [run.y, run.vy] = [room.floor, Math.max(0, run.vy)];
    if (run.y + HEIGHT >= room.ceiling) [run.y, run.vy] = [room.ceiling - HEIGHT, Math.min(0, run.vy)];
  } else if (run.flip) {
    settleFlipped(run, room);
  } else if (!run.grounded && run.vy <= 0 && run.y <= room.floor) {
    land(run, room.floor, room.floor);
  } else if (run.grounded && run.y > room.floor) {
    run.grounded = false;
    run.vy = 0;
  }
}
