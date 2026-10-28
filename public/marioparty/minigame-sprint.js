// Minigame 1: Sprint. Blijf drukken om momentum op te bouwen; wie het tempo vasthoudt,
// gaat in turbo. Eerste over de finish wint.
import { play } from './sprites.js';
import { spawnConfetti, updateParticles3d } from './sprint-particles.js';
import { createView, renderView, disposeView, shotFor } from './sprint-view.js';
import { TRACK_LEN, laneZ } from './sprint-track.js';
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
// "minder beweging": geen schudden, flits of slow motion
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// t = exacte speltijd (s sinds GO) waarop de loper de finish passeerde
function crossLine(r, idx, now, t) {
  r.finishTime = t;
  race.order.push(race.players[idx]);
  play(r.sprite, 'cheer');
  spawnConfetti(race.particles, TRACK_LEN, 2, laneZ(idx, race.players.length), 30);
  if (race.firstFinish === null) {
    race.firstFinish = now;
    race.focus = idx;
    race.shake = REDUCE ? 0 : 10;
    race.flash = REDUCE ? 0 : 1;
  }
}

function finishOf(player) {
  return race.runners[race.players.indexOf(player)].finishTime;
}

function finish() {
  race.phase = 'done';
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

function frame(now) {
  const time = now / 1000;
  const slow = !REDUCE && race.firstFinish !== null && now - race.firstFinish < SLOWMO_MS;
  const realDt = Math.min(0.1, time - race.time);
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
    if (allDone || timeUp) finish();
  }
  // speltijd loopt alleen tijdens de race, en ook langzamer tijdens de slow motion
  if (race.phase === 'running') race.clock += dt;
  const hadWinner = race.firstFinish !== null;
  race.runners.forEach((r, i) => {
    const t = moveRunner(race, r, i, dt);
    if (t !== null) crossLine(r, i, now, t);
  });
  // wie in hetzelfde frame finishen, krijgen de volgorde van hun exacte tijd
  race.order.sort((a, b) => finishOf(a) - finishOf(b));
  if (!hadWinner && race.firstFinish !== null) race.focus = race.players.indexOf(race.order[0]);
  updateParticles3d(race.particles, dt);
  race.shake = Math.max(0, race.shake - dt * 30);
  race.flash = Math.max(0, (race.flash || 0) - realDt * 3);
  updateHud(race.hud, race.runners, race.clock, race.phase === 'done');
  renderView(race.view, race, realDt, shotFor(race, now, REDUCE ? 1 : elapsed / COUNTDOWN_MS));
  race.raf = requestAnimationFrame(frame);
}

export function startSprint(canvas, statusEl, players, onFinish) {
  stopSprint();
  race = {
    statusEl, players, onFinish,
    runners: players.map(createRunner),
    particles: [],
    order: [],
    firstFinish: null,
    focus: null,
    phase: 'countdown',
    clock: 0,
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
  race.input = createInput(players, document.getElementById('sprint-stage'), press, () => race && race.phase === 'running');
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
