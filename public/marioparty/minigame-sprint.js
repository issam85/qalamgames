// Minigame 1: Sprint. Snel drukken om vooruit te komen.
import { drawCharacter } from './characters.js';
import { loadImage, getImage } from './assets.js';

const BG_URL = 'img/bg-track.jpg';
const FINISH = 40;
const SPRITE_H = 64;
const LANE_H = 80;
const LANE_TOP = 20;
const TRACK_X = 60;
const COUNTDOWN_MS = 3000;
const GRACE_MS = 4000;
const KEYS = { 'Speler 1': 'Space', 'Speler 2': 'ArrowUp' };
export const KEY_LABELS = { 'Speler 1': 'SPATIE', 'Speler 2': 'PIJL OMHOOG' };

let race = null;

export function loadSprintAssets() {
  return loadImage(BG_URL);
}

function cpuDelay() {
  return 120 + Math.random() * 120;
}

function press(idx) {
  if (race.progress[idx] >= FINISH) return;
  race.progress[idx] += 1;
  if (race.progress[idx] < FINISH) return;
  race.order.push(race.players[idx]);
  if (race.firstFinish === null) race.firstFinish = performance.now();
}

function onKey(e) {
  if (!race) return;
  const idx = race.players.findIndex((p) => KEYS[p.control] === e.code);
  if (idx === -1) return;
  e.preventDefault();
  if (race.phase === 'running' && !e.repeat) press(idx);
}

function tickCpu(now) {
  race.players.forEach((p, i) => {
    if (p.control !== 'CPU' || now < race.cpuNext[i]) return;
    press(i);
    race.cpuNext[i] = now + cpuDelay();
  });
}

function drawFinish(ctx, x, y) {
  const size = LANE_H / 8;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 2; col++) {
      ctx.fillStyle = (row + col) % 2 ? '#222' : '#fff';
      ctx.fillRect(x + col * size, y + row * size, size, size);
    }
  }
}

function drawLane(ctx, i, width) {
  const y = LANE_TOP + i * LANE_H;
  ctx.fillStyle = i % 2 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(0, y, width, LANE_H);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 12]);
  ctx.beginPath();
  ctx.moveTo(0, y + LANE_H);
  ctx.lineTo(width, y + LANE_H);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawLabel(ctx, text, x, y) {
  ctx.font = '700 16px Fredoka, sans-serif';
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = '#fff';
  ctx.fillText(text, x, y);
}

function draw() {
  const { canvas, players, progress, phase } = race;
  const ctx = canvas.getContext('2d');
  const trackW = canvas.width - TRACK_X * 2;
  ctx.drawImage(getImage(BG_URL), 0, 0, canvas.width, canvas.height);
  players.forEach((p, i) => {
    const y = LANE_TOP + i * LANE_H;
    drawLane(ctx, i, canvas.width);
    drawFinish(ctx, TRACK_X + trackW, y);
    const x = TRACK_X + (progress[i] / FINISH) * trackW;
    // wippen bij elke druk zolang de race loopt
    const bob = phase === 'running' && progress[i] < FINISH ? Math.abs(Math.sin(progress[i] * 2.2)) * 8 : 0;
    drawCharacter(ctx, p.character, x, y + LANE_H - 6 - bob, SPRITE_H);
    drawLabel(ctx, `${p.character.name} (${p.control})`, 10, y + 22);
  });
}

function finish() {
  race.phase = 'done';
  const progressOf = (p) => race.progress[race.players.indexOf(p)];
  const rest = race.players
    .filter((p) => !race.order.includes(p))
    .sort((a, b) => progressOf(b) - progressOf(a));
  const ranking = [...race.order, ...rest];
  const { onFinish } = race;
  draw();
  stopSprint();
  onFinish(ranking);
}

function frame(now) {
  const elapsed = now - race.t0;
  if (race.phase === 'countdown') {
    const left = Math.ceil((COUNTDOWN_MS - elapsed) / 1000);
    race.statusEl.textContent = left > 0 ? String(left) : 'GO!';
    if (elapsed >= COUNTDOWN_MS) {
      race.phase = 'running';
      race.cpuNext = race.players.map(() => now + cpuDelay());
    }
  } else if (race.phase === 'running') {
    tickCpu(now);
    const allDone = race.order.length === race.players.length;
    const timeUp = race.firstFinish !== null && now - race.firstFinish > GRACE_MS;
    if (allDone || timeUp) {
      finish();
      return;
    }
  }
  draw();
  race.raf = requestAnimationFrame(frame);
}

export function startSprint(canvas, statusEl, players, onFinish) {
  stopSprint();
  race = {
    canvas,
    statusEl,
    players,
    onFinish,
    progress: players.map(() => 0),
    cpuNext: players.map(() => 0),
    order: [],
    firstFinish: null,
    phase: 'countdown',
    t0: performance.now(),
    raf: 0,
  };
  if (document.activeElement) document.activeElement.blur();
  window.focus();
  window.addEventListener('keydown', onKey);
  race.raf = requestAnimationFrame(frame);
}

export function stopSprint() {
  if (!race) return;
  cancelAnimationFrame(race.raf);
  window.removeEventListener('keydown', onKey);
  race = null;
}
