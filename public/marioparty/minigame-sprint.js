// Minigame 1: Sprint. Snel drukken om vooruit te komen.
import { createSprite, play, update } from './sprites.js';
import { createParticles, dust, confetti, updateParticles } from './effects.js';
import { drawRace, loadTrack, laneFootY, trackX, finishX } from './sprint-draw.js';

const FINISH = 40;
const COUNTDOWN_MS = 3000;
const GRACE_MS = 4000;
// zonder druk binnen deze tijd (s) staat een loper stil
const IDLE_AFTER = 0.45;
const KEYS = { 'Speler 1': 'Space', 'Speler 2': 'ArrowUp' };
export const KEY_LABELS = { 'Speler 1': 'SPATIE', 'Speler 2': 'PIJL OMHOOG' };

let race = null;

export function loadSprintAssets() {
  return loadTrack();
}

function cpuDelay() {
  return 120 + Math.random() * 120;
}

function setStatus(text) {
  const el = race.statusEl;
  if (el.textContent === text) return;
  el.textContent = text;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

function press(idx) {
  const r = race.runners[idx];
  if (r.progress >= FINISH) return;
  r.progress += 1;
  r.lastPress = race.time;
  r.presses.push(race.time);
  if (r.progress % 2 === 0) dust(race.particles, r.x - 16, laneFootY(idx) - 4);
  if (r.progress < FINISH) return;
  race.order.push(race.players[idx]);
  play(r.sprite, 'cheer');
  confetti(race.particles, finishX(race.canvas), laneFootY(idx) - 30, 30);
  if (race.firstFinish === null) {
    race.firstFinish = performance.now();
    race.shake = 10;
  }
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

// beweegt de loper soepel naar zijn plek; hoe sneller er gedrukt wordt,
// hoe sneller de renanimatie
function updateRunner(r, dt) {
  // finishers lopen door tot net voorbij de finishvlag
  const target = r.progress >= FINISH ? finishX(race.canvas) + 34 : trackX(race.canvas, r.progress / FINISH);
  r.x += (target - r.x) * Math.min(1, dt * 10);
  r.presses = r.presses.filter((t) => race.time - t < 0.6);
  if (race.phase === 'running' && r.progress < FINISH) {
    const moving = race.time - r.lastPress < IDLE_AFTER;
    play(r.sprite, moving ? 'run' : 'idle');
    r.sprite.speed = moving ? Math.min(2.4, 0.6 + r.presses.length * 0.25) : 1;
  } else {
    r.sprite.speed = 1;
  }
  update(r.sprite, dt);
}

function finish() {
  race.phase = 'done';
  const progressOf = (p) => race.runners[race.players.indexOf(p)].progress;
  const rest = race.players
    .filter((p) => !race.order.includes(p))
    .sort((a, b) => progressOf(b) - progressOf(a));
  const ranking = [...race.order, ...rest];
  ranking.forEach((p, place) => {
    play(race.runners[race.players.indexOf(p)].sprite, place < 2 ? 'cheer' : 'sad');
  });
  setStatus('Finish!');
  race.onFinish(ranking);
}

function frame(now) {
  const time = now / 1000;
  const dt = Math.min(0.05, time - race.time);
  race.time = time;
  const elapsed = now - race.t0;
  if (race.phase === 'countdown') {
    const left = Math.ceil((COUNTDOWN_MS - elapsed) / 1000);
    setStatus(left > 0 ? String(left) : 'GO!');
    if (elapsed >= COUNTDOWN_MS) {
      race.phase = 'running';
      race.cpuNext = race.players.map(() => now + cpuDelay());
    }
  } else if (race.phase === 'running') {
    tickCpu(now);
    const allDone = race.order.length === race.players.length;
    const timeUp = race.firstFinish !== null && now - race.firstFinish > GRACE_MS;
    if (allDone || timeUp) finish();
  }
  race.runners.forEach((r) => updateRunner(r, dt));
  updateParticles(race.particles, dt);
  race.shake = Math.max(0, race.shake - dt * 30);
  drawRace(race);
  race.raf = requestAnimationFrame(frame);
}

export function startSprint(canvas, statusEl, players, onFinish) {
  stopSprint();
  race = {
    canvas,
    statusEl,
    players,
    onFinish,
    runners: players.map((p) => ({
      sprite: createSprite(p.character.key), progress: 0, x: trackX(canvas, 0), lastPress: -1, presses: [],
    })),
    particles: createParticles(),
    cpuNext: players.map(() => 0),
    order: [],
    firstFinish: null,
    phase: 'countdown',
    shake: 0,
    t0: performance.now(),
    time: performance.now() / 1000,
    raf: 0,
  };
  statusEl.textContent = '';
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
