// Animatie van het trapscherm: winnaars springen trede voor trede omhoog,
// verliezers kijken sip en zakken een trede, de ster gloeit en twinkelt.
import { STEPS, CENTER, STAR_POS, footY, spriteHeight, drawScene, drawStar } from './board.js';
import { createSprite, play, update, drawSprite } from './sprites.js';
import { createParticles, puff, sparkle, confetti, updateParticles, drawParticles } from './effects.js';

const START = 0.6;
const HOP = 0.45;
const CROUCH = 0.2;
const DROP_DELAY = 0.9;
const DROP = 0.5;
const ARC = 28;

let board = null;

const lerp = (a, b, f) => a + (b - a) * f;

// spelers op dezelfde trede staan naast elkaar
function slots(entries, key) {
  const xs = new Map();
  for (let step = 0; step <= STEPS; step++) {
    const group = entries.filter((e) => e[key] === step);
    const w = spriteHeight(step) * 0.95;
    group.forEach((e, k) => xs.set(e, CENTER + (k - (group.length - 1) / 2) * w));
  }
  return xs;
}

// eerst door de knieën, dan een boog met uitrekken in de lucht
function hopShape(f) {
  if (f < CROUCH) return { g: 0, lift: 0, sx: 1 + 0.08 * Math.sin(Math.PI * f / CROUCH), sy: 1 - 0.14 * Math.sin(Math.PI * f / CROUCH) };
  const a = (f - CROUCH) / (1 - CROUCH);
  return { g: a, lift: Math.sin(Math.PI * a) * ARC, sx: 1 - 0.06 * Math.sin(Math.PI * a), sy: 1 + 0.1 * Math.sin(Math.PI * a) };
}

// positie op tijdstip t: trede (eventueel tussen twee in), x, hoogte en squash
function pose(e, t) {
  const climb = e.to - e.from;
  const rest = { step: e.to, x: e.x1, lift: 0, sx: 1, sy: 1, hops: Math.abs(climb), done: true };
  if (climb > 0) {
    const local = t - START;
    if (local <= 0) return { ...rest, step: e.from, x: e.x0, hops: 0, done: false };
    const k = Math.floor(local / HOP);
    if (k >= climb) return rest;
    const h = hopShape((local - k * HOP) / HOP);
    const p = (k + h.g) / climb;
    return { step: lerp(e.from, e.to, p), x: lerp(e.x0, e.x1, p), lift: h.lift, sx: h.sx, sy: h.sy, hops: k, done: false };
  }
  if (climb < 0) {
    const local = t - START - DROP_DELAY;
    if (local <= 0) return { ...rest, step: e.from, x: e.x0, hops: 0, done: false };
    if (local >= DROP) return rest;
    const h = hopShape(local / DROP);
    return { step: lerp(e.from, e.to, h.g), x: lerp(e.x0, e.x1, h.g), lift: h.lift * 0.4, sx: h.sx, sy: h.sy, hops: 0, done: false };
  }
  return rest;
}

// reageert op wat er net gebeurd is: landingen, juichen, sip kijken
function react(e, p, t) {
  if (t >= START && !e.started) {
    e.started = true;
    if (e.place !== null && e.place >= 2) play(e.sprite, 'sad');
    if (e.place !== null && e.place < 2 && e.to === e.from) play(e.sprite, 'cheer');
  }
  if (p.hops > e.hops && !p.done) {
    e.hops = p.hops;
    puff(board.particles, p.x, footY(p.step), 0.7);
  }
  if (p.done && !e.done && e.to !== e.from) {
    e.done = true;
    puff(board.particles, p.x, footY(p.step), 1);
    if (e.place !== null && e.place < 2) play(e.sprite, 'cheer');
    if (e.place === 0) confetti(board.particles, p.x, footY(p.step) - 60, 36);
  }
}

function drawEntry(ctx, e, p) {
  const h = spriteHeight(p.step);
  const y = footY(p.step);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(p.x, y - 2, h * 0.3 * (1 - p.lift / 90), h * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.translate(p.x, y - p.lift);
  ctx.scale(p.sx, p.sy);
  drawSprite(ctx, e.sprite, 0, 0, h, false);
  ctx.restore();
}

function frame(now) {
  const time = now / 1000;
  const dt = Math.min(0.05, time - board.time);
  board.time = time;
  const t = time - board.t0;
  const ctx = board.canvas.getContext('2d');
  drawScene(ctx, board.canvas);
  drawStar(ctx, t);
  if (Math.random() < dt * 8) {
    const a = Math.random() * Math.PI * 2;
    const r = 34 + Math.random() * 30;
    sparkle(board.particles, STAR_POS.x + Math.cos(a) * r, STAR_POS.y + Math.sin(a) * r);
  }
  const poses = board.entries.map((e) => [e, pose(e, t)]);
  poses.forEach(([e, p]) => {
    react(e, p, t);
    update(e.sprite, dt);
  });
  poses.sort((a, b) => b[1].step - a[1].step).forEach(([e, p]) => drawEntry(ctx, e, p));
  updateParticles(board.particles, dt);
  drawParticles(ctx, board.particles);
  board.raf = requestAnimationFrame(frame);
}

// moves: per speler { player, from, to, place } van de laatste ronde, of leeg
export function startBoard(canvas, players, moves = []) {
  stopBoard();
  const entries = players.map((player) => {
    const m = moves.find((mv) => mv.player === player);
    return {
      player, sprite: createSprite(player.character.key),
      from: m ? m.from : player.step, to: player.step, place: m ? m.place : null,
      hops: 0, started: false, done: false,
    };
  });
  const before = slots(entries, 'from');
  const after = slots(entries, 'to');
  entries.forEach((e) => {
    e.x0 = before.get(e);
    e.x1 = after.get(e);
  });
  const now = performance.now() / 1000;
  board = { canvas, entries, particles: createParticles(), t0: now, time: now, raf: 0 };
  board.raf = requestAnimationFrame(frame);
}

export function stopBoard() {
  if (!board) return;
  cancelAnimationFrame(board.raf);
  board = null;
}
