// De zee zonder tekenen (zo te testen): zwemmen, de oesters op de bodem die open en
// dicht gaan, en parels pakken. Logisch vak 960 × 540; de zee is breder dan het scherm.
// x, y = het midden van de prinses.
export const SEA = { w: 2400, surface: 170, top: 182, bottom: 452, bed: 492 };
export const OYSTERS = 8;
const SPEED = 220;
const REACH = 56; // zo dichtbij pak je een parel
const CYCLE = 5; // seconden: zo lang duurt open + dicht
const OPEN = 3; // zo lang daarvan is de oester open

export function newSwim(rand = Math.random) {
  const oysters = Array.from({ length: OYSTERS }, (_, i) => ({
    x: 360 + i * ((SEA.w - 520) / (OYSTERS - 1)) + (rand() - 0.5) * 120,
    y: SEA.bed,
    phase: rand() * CYCLE,
    got: 0,
  }));
  return { oysters, bubbles: [], x: 260, y: SEA.top + 20, face: 1, moving: false, time: 0, nextBubble: 0 };
}

// hoe ver de oester open is: 0 = dicht, 1 = open (met een korte overgang)
export function openness(oyster, time) {
  const t = (time + oyster.phase) % CYCLE;
  if (t > OPEN) return 0;
  return Math.min(1, t / 0.4, (OPEN - t) / 0.4);
}

export const pearlsLeft = (swim) => swim.oysters.filter((o) => !o.got).length;

// dir = { x, y } van de toetsen, of target = { x, y } waar de vinger is. Geeft terug
// welke oesters net hun parel kwijt zijn.
export function swimStep(swim, dir, target, dt) {
  let dx = dir.x;
  let dy = dir.y;
  if (target) {
    dx = target.x - swim.x;
    dy = target.y - swim.y;
    if (Math.hypot(dx, dy) < 8) dx = dy = 0;
  }
  const len = Math.hypot(dx, dy);
  swim.moving = len > 0;
  swim.time += dt;
  if (swim.moving) {
    const move = Math.min(SPEED * dt, target ? len : Infinity);
    swim.x = Math.max(80, Math.min(SEA.w - 80, swim.x + (dx / len) * move));
    swim.y = Math.max(SEA.top, Math.min(SEA.bottom, swim.y + (dy / len) * move));
    if (Math.abs(dx) > 1) swim.face = dx > 0 ? 1 : -1;
  }
  // belletjes onder water stijgen op tot het wateroppervlak
  if (swim.time > swim.nextBubble && swim.y > SEA.top + 20) {
    swim.bubbles.push({ x: swim.x + swim.face * 70, y: swim.y - 10, r: 3 + Math.random() * 4 });
    swim.nextBubble = swim.time + (swim.moving ? 0.25 : 0.7);
  }
  swim.bubbles.forEach((b) => { b.y -= 60 * dt; });
  swim.bubbles = swim.bubbles.filter((b) => b.y > SEA.surface);
  // een parel pak je bij de hand: iets vóór het midden van de prinses
  const hand = { x: swim.x + swim.face * 60, y: swim.y + 10 };
  const picked = swim.oysters.filter((o) => !o.got && openness(o, swim.time) > 0.5 && Math.hypot(o.x - hand.x, o.y - 20 - hand.y) < REACH);
  picked.forEach((o) => { o.got = swim.time; });
  return picked;
}
