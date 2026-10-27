// Minigame 1: Sprint. Snel drukken om vooruit te komen.
import { createSprite, play, update } from './sprites.js';
import { createParticles, dust, confetti, updateParticles } from './effects.js';
import { createView, renderView, disposeView, toScreen, laneOf, shotFor } from './sprint-view.js';
import { TRACK_LEN } from './sprint-track.js';
import { createInput } from './sprint-input.js';

export { KEY_LABELS } from './sprint-input.js';

const FINISH = 40;
const COUNTDOWN_MS = 3000;
const GRACE_MS = 4000;
// zonder druk binnen deze tijd (s) staat een loper stil
const IDLE_AFTER = 0.45;
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
  if (r.progress >= FINISH) return;
  r.progress += 1;
  r.lastPress = race.time;
  r.presses.push(race.time);
  if (r.progress % 2 === 0) {
    const p = toScreen(race.view, r.x - 0.5, 0.15, laneOf(race.view, idx));
    dust(race.particles, p.x, p.y);
  }
  if (r.progress < FINISH) return;
  race.order.push(race.players[idx]);
  play(r.sprite, 'cheer');
  const p = toScreen(race.view, TRACK_LEN, 2, laneOf(race.view, idx));
  confetti(race.particles, p.x, p.y, 30);
  if (race.firstFinish === null) {
    race.firstFinish = performance.now();
    race.focus = idx;
    race.shake = 10;
  }
}

// beweegt de loper soepel naar zijn plek; hoe sneller er gedrukt wordt,
// hoe sneller de renanimatie
function updateRunner(r, dt) {
  // finishers lopen door tot net voorbij de finishvlag
  const target = r.progress >= FINISH ? TRACK_LEN + 2.5 : (r.progress / FINISH) * TRACK_LEN;
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
    if (allDone || timeUp) finish();
  }
  race.runners.forEach((r) => updateRunner(r, dt));
  updateParticles(race.particles, dt);
  race.shake = Math.max(0, race.shake - dt * 30);
  renderView(race.view, race, realDt, shotFor(race, now, elapsed / COUNTDOWN_MS));
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
      sprite: createSprite(p.character.key), progress: 0, x: 0, lastPress: -1, presses: [],
    })),
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
  race = null;
}
