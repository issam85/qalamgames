// Minigame 1: Sprint. Blijf drukken om momentum op te bouwen; wie het tempo vasthoudt,
// gaat in turbo. Eerste over de finish wint.
import { play } from './sprites.js';
import { createParticles, confetti, updateParticles } from './effects.js';
import { createView, renderView, disposeView, toScreen, laneOf, shotFor } from './sprint-view.js';
import { TRACK_LEN } from './sprint-track.js';
import { createInput } from './sprint-input.js';
import { boost } from './sprint-momentum.js';
import { createRunner, moveRunner } from './sprint-runners.js';
import { createHud, updateHud, removeHud } from './sprint-hud.js';

export { KEY_LABELS } from './sprint-input.js';

const COUNTDOWN_MS = 3000;
const GRACE_MS = 4000;
// bij de eerste finisher: even slow motion en de camera op de winnaar
const SLOWMO_MS = 1300;

let race = null;

export function loadSprintAssets() {
  return Promise.resolve();
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
  if (r.finishTime === undefined) boost(r.momentum);
}

// seconden sinds GO
function raceTime(now) {
  return Math.max(0, (now - race.t0 - COUNTDOWN_MS) / 1000);
}

function crossLine(r, idx, now) {
  r.finishTime = raceTime(now);
  race.order.push(race.players[idx]);
  play(r.sprite, 'cheer');
  const p = toScreen(race.view, TRACK_LEN, 2, laneOf(race.view, idx));
  confetti(race.particles, p.x, p.y, 30);
  if (race.firstFinish === null) {
    race.firstFinish = now;
    race.focus = idx;
    race.shake = 10;
  }
}

function finish(now) {
  race.phase = 'done';
  race.doneTime = raceTime(now);
  const xOf = (p) => race.runners[race.players.indexOf(p)].x;
  const rest = race.players
    .filter((p) => !race.order.includes(p))
    .sort((a, b) => xOf(b) - xOf(a));
  const ranking = [...race.order, ...rest];
  ranking.forEach((p, place) => {
    play(race.runners[race.players.indexOf(p)].sprite, place < 2 ? 'cheer' : 'sad');
  });
  setStatus('Finish!');
  race.onFinish(ranking);
}

function hudTime(now) {
  if (race.phase === 'countdown') return 0;
  return race.phase === 'done' ? race.doneTime : raceTime(now);
}

function frame(now) {
  const time = now / 1000;
  const slow = race.firstFinish !== null && now - race.firstFinish < SLOWMO_MS;
  const realDt = Math.min(0.05, time - race.time);
  const dt = realDt * (slow ? 0.3 : 1);
  race.time = time;
  const elapsed = now - race.t0;
  if (race.phase === 'countdown') {
    const left = Math.ceil((COUNTDOWN_MS - elapsed) / 1000);
    setStatus(left > 0 ? String(left) : 'GO!');
    if (elapsed >= COUNTDOWN_MS) {
      race.phase = 'running';
      race.input.start(now);
    }
  } else if (race.phase === 'running') {
    if (elapsed > COUNTDOWN_MS + 900 && race.firstFinish === null) setStatus('');
    race.input.tick(now);
    const allDone = race.order.length === race.players.length;
    const timeUp = race.firstFinish !== null && now - race.firstFinish > GRACE_MS;
    if (allDone || timeUp) finish(now);
  }
  race.runners.forEach((r, i) => {
    if (moveRunner(race, r, i, dt)) crossLine(r, i, now);
  });
  updateParticles(race.particles, dt);
  race.shake = Math.max(0, race.shake - dt * 30);
  updateHud(race.hud, race.runners, hudTime(now), race.phase === 'done');
  renderView(race.view, race, realDt, shotFor(race, now, elapsed / COUNTDOWN_MS));
  race.raf = requestAnimationFrame(frame);
}

export function startSprint(canvas, statusEl, players, onFinish) {
  stopSprint();
  race = {
    canvas, statusEl, players, onFinish,
    runners: players.map(createRunner),
    particles: createParticles(),
    order: [],
    firstFinish: null,
    focus: null,
    phase: 'countdown',
    shake: 0,
    t0: performance.now(),
    time: performance.now() / 1000,
    raf: 0,
  };
  race.view = createView(canvas, document.getElementById('sprint3d'), players, race.runners);
  race.hud = createHud(document.getElementById('sprint-stage'), players);
  statusEl.textContent = '';
  if (document.activeElement) document.activeElement.blur();
  window.focus();
  race.input = createInput(players, press, () => race && race.phase === 'running');
  race.input.attach();
  race.raf = requestAnimationFrame(frame);
}

export function stopSprint() {
  if (!race) return;
  cancelAnimationFrame(race.raf);
  race.input.detach();
  disposeView(race.view);
  removeHud(race.hud);
  race = null;
}
