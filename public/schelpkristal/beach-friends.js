// De vrienden op het strand (zonder tekenen, zo te testen). Ze zoeken mee: elk loopt
// naar de dichtstbijzijnde schelp of het kristal waar nog geen ander vriendje heen
// gaat, en rust even na elke vondst. Wat zij vinden, telt mee voor iedereen. Is er
// niets meer te zoeken, dan lopen ze met de prinses mee.
import { WORLD } from './beach-world.js';

const SPEED = 95; // veel langzamer dan de prinses (260), zodat er voor haar genoeg overblijft
const REST = 4; // seconden rust na een vondst
const REACH = 40;
const SAY = 1.6; // zo lang staat "… vond een schelp!" boven het vriendje

// waar de vrienden beginnen: links en rechts van de prinses (die staat op x = 300)
const STARTS = [[150, WORLD.start - 60], [430, WORLD.start - 70], [500, WORLD.start + 30]];

// names = de namen van de vrienden
export function newFriends(names) {
  return names.map((name, k) => ({
    name, x: STARTS[k % 3][0], y: STARTS[k % 3][1], face: 1, moving: false, time: k * 0.7, rest: 1 + k, goal: null, said: -9,
  }));
}

function nearest(f, items, taken) {
  let best = null;
  items.forEach((it) => {
    if (it.got || taken.has(it)) return;
    if (!best || Math.hypot(it.x - f.x, it.y - f.y) < Math.hypot(best.x - f.x, best.y - f.y)) best = it;
  });
  return best;
}

// now = de tijd van de tocht (walk.time). Geeft terug wat er net is gevonden.
export function friendsStep(friends, walk, dt, now) {
  const found = [];
  friends.forEach((f, k) => {
    f.time += dt;
    f.moving = false;
    if (f.rest > 0) {
      f.rest -= dt;
      return;
    }
    if (!f.goal || f.goal.got) {
      const taken = new Set(friends.filter((o) => o !== f).map((o) => o.goal));
      f.goal = nearest(f, walk.items, taken);
    }
    // niets meer te zoeken: in een rijtje achter de prinses aan
    const to = f.goal || { x: walk.x - walk.face * (90 + k * 60), y: Math.min(WORLD.bottom, walk.y - 30 + k * 30) };
    const dx = to.x - f.x;
    const dy = to.y - f.y;
    const len = Math.hypot(dx, dy);
    if (len > 6) {
      const move = Math.min(SPEED * dt, len);
      f.x += (dx / len) * move;
      f.y = Math.max(WORLD.top, Math.min(WORLD.bottom, f.y + (dy / len) * move));
      f.moving = true;
      if (Math.abs(dx) > 1) f.face = dx > 0 ? 1 : -1;
    }
    if (f.goal && Math.hypot(f.goal.x - f.x, (f.goal.y - f.y) * 1.4) < REACH) {
      f.goal.got = now;
      f.goal.by = f.name;
      found.push(f.goal);
      f.goal = null;
      f.rest = REST;
      f.said = now;
    }
  });
  return found;
}

// wat er boven het vriendje staat, of '' als het niets zegt
export function saying(f, walk) {
  if (walk.time - f.said > SAY) return '';
  const it = walk.items.find((i) => i.by === f.name && i.got === f.said);
  return it ? `${f.name} vond ${it.kind === 'shell' ? 'een schelp' : 'een kristal'}!` : '';
}
