// Minigame 1: Sprint. Snel drukken om vooruit te komen.
import { drawCharacter } from './characters.js';

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
      ctx.fillStyle = (row + col) % 2 ? '#000' : '#fff';
      ctx.fillRect(x + col * size, y + row * size, size, size);
    }
  }
}

function draw() {
  const { canvas, players, progress } = race;
  const ctx = canvas.getContext('2d');
  const trackW = canvas.width - TRACK_X * 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '10px "Press Start 2P", monospace';
  players.forEach((p, i) => {
    const y = LANE_TOP + i * LANE_H;
    ctx.fillStyle = i % 2 ? '#c98a4b' : '#b87a3f';
    ctx.fillRect(0, y, canvas.width, LANE_H);
    drawFinish(ctx, TRACK_X + trackW, y);
    const x = TRACK_X + (progress[i] / FINISH) * trackW;
    drawCharacter(ctx, p.character, x, y + LANE_H - 6, SPRITE_H);
    ctx.fillStyle = '#fff';
    ctx.fillText(`${p.character.name} (${p.control})`, 8, y + 16);
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
