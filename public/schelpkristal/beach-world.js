// Het strand zonder tekenen (zo te testen): waar de schelpen en kristallen liggen, het
// lopen van de prinses en het oprapen. Logisch vak 960 × 540; het strand is breder dan
// het scherm. x, y = de voeten van de prinses.
export const WORLD = { w: 2600, top: 360, bottom: 515, start: 470 };
export const SHELLS = 10;
export const CRYSTALS = 5;
const SPEED = 260; // beeldpunten per seconde
const REACH = 42; // zo dichtbij raap je iets op
const GAP = 95; // zo ver liggen de dingen minstens uit elkaar
const FIRST = 520; // vóór het strandhuisje ligt niets

export const SHELL_COLORS = ['#ffb3c7', '#ffd8b0', '#fff1e0', '#f7a6a0', '#e6c3ff'];
export const CRYSTAL_COLORS = ['#b38bff', '#7fd8ff', '#ff8ad8', '#7dffcf', '#8aa2ff'];

function place(items, kind, count, colors, rand) {
  for (let n = 0; n < count; n += 1) {
    let spot;
    for (let tries = 0; tries < 200; tries += 1) {
      spot = { x: FIRST + rand() * (WORLD.w - FIRST - 60), y: WORLD.top + 10 + rand() * (WORLD.bottom - WORLD.top - 10) };
      if (items.every((it) => Math.hypot(it.x - spot.x, (it.y - spot.y) * 1.6) > GAP)) break;
    }
    items.push({ kind, ...spot, type: Math.floor(rand() * 3), color: colors[Math.floor(rand() * colors.length)], phase: rand() * 6.28, got: 0 });
  }
}

// een nieuwe tocht: alles opnieuw verstopt, de prinses bij het strandhuisje
export function newWalk(rand = Math.random) {
  const items = [];
  place(items, 'crystal', CRYSTALS, CRYSTAL_COLORS, rand);
  place(items, 'shell', SHELLS, SHELL_COLORS, rand);
  return { items, x: 300, y: WORLD.start, face: 1, moving: false, time: 0 };
}

export const left = (walk, kind) => walk.items.filter((it) => it.kind === kind && !it.got).length;
export const allFound = (walk) => walk.items.every((it) => it.got);

// Een stap: dir = { x, y } van de toetsen (-1, 0 of 1), of target = { x, y } waar de vinger
// is. Geeft terug wat er net is opgeraapt.
export function step(walk, dir, target, dt) {
  let dx = dir.x;
  let dy = dir.y;
  if (target) {
    dx = target.x - walk.x;
    dy = target.y - walk.y;
    if (Math.hypot(dx, dy) < 8) dx = dy = 0;
  }
  const len = Math.hypot(dx, dy);
  walk.moving = len > 0;
  walk.time += dt;
  if (walk.moving) {
    const move = Math.min(SPEED * dt, target ? len : Infinity);
    walk.x = Math.max(60, Math.min(WORLD.w - 60, walk.x + (dx / len) * move));
    walk.y = Math.max(WORLD.top, Math.min(WORLD.bottom, walk.y + (dy / len) * move * 0.7));
    if (Math.abs(dx) > 1) walk.face = dx > 0 ? 1 : -1;
  }
  const picked = walk.items.filter((it) => !it.got && Math.hypot(it.x - walk.x, (it.y - walk.y) * 1.4) < REACH);
  picked.forEach((it) => { it.got = walk.time; });
  return picked;
}
