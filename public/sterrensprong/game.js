// Spelverloop: kiezen, spelen of oefenen, botsen en opnieuw, pauze, tot 100% en dan de volgende wereld.
import { WORLDS } from './levels.js';
import { createRun } from './physics.js';
import { createInput } from './input.js';
import { createView } from './view.js';
import { loadSkin, saveSkin } from './skins.js';
import { loadProgress, bestOf } from './progress.js';
import { createMenu } from './menu.js';
import { updateHud, setOverlayReady, hideOverlay } from './hud.js';
import { showToast, clearToasts } from './toast.js';
import { ICONS } from './icons.js';
import { createTries } from './tries.js';
import { createTutorial } from './tutorial.js';
import { createRound } from './round.js';
import { createPause } from './pause.js';
import { showCount } from './countdown.js';

const view = createView(document.getElementById('view'));
const input = createInput(onPress);
const progress = loadProgress(WORLDS.length);
const tries = createTries();
const tutorial = createTutorial();

// de toestand, gedeeld met round.js en pause.js. mode: ready, run, wait, dead, won, paused
const g = { mode: 'ready', resumeTo: 'run', counting: false, pause: 0, spare: 0, worldIndex: 0, level: null, run: null };
let last = performance.now();

function loadLevel(index) {
  g.worldIndex = index;
  g.level = WORLDS[index];
  view.load(g.level);
  tutorial.load(g.level);
  g.run = createRun(g.level);
  tries.begin(g.level, false);
}

loadLevel(progress.unlocked - 1);
const firstSkin = loadSkin();
view.setSkin(firstSkin);
const menu = createMenu({ skin: firstSkin, worlds: WORLDS, progress, selected: g.worldIndex }, {
  onSkin(skin) {
    view.setSkin(skin);
    saveSkin(skin);
  },
  onWorld: loadLevel,
  onStart: () => play(false),
  onPractice: () => play(true),
});

function clearRun() {
  g.run = createRun(g.level, tries.spawn());
  g.spare = 0;
  input.requireRelease(); // een vinger die nog ligt, springt niet meteen weer
  input.takePress();
  view.reset(tries.practice);
  hideOverlay();
  clearToasts();
}

function play(practice) {
  tries.begin(g.level, practice);
  clearRun();
  g.mode = 'run';
  menu.show(false);
  if (practice) showToast('Oefenen', ICONS.infinity);
  else showToast(g.level.zones[0].title);
}

function backToMenu() {
  tries.begin(g.level, false);
  clearRun();
  g.mode = 'ready';
  menu.update(g.worldIndex);
  menu.show(true);
}

const round = createRound(g, { input, view, tries, progress, clearRun });
const pauser = createPause(g, { input, tries, play, backToMenu, loadLevel });

// een tik naast het menu start niets: alleen het toetsenbord of de knoppen
function onPress(source) {
  if (source !== 'key') return;
  if (g.mode === 'ready') play(false);
  else if (g.mode === 'won' || g.mode === 'paused') pauser.goOn();
}

function frame() {
  const now = performance.now(); // de tijd van requestAnimationFrame klopt niet in elke browser
  const dt = g.mode === 'paused' ? 0 : Math.max(0, Math.min((now - last) / 1000, 0.05));
  last = now;
  const wasWaiting = g.pause > 0;
  g.pause -= dt;
  if (g.mode === 'run') round.simulate(dt);
  else if (g.mode === 'dead' && g.pause <= 0) round.afterCrash();
  else if (g.mode === 'wait') {
    input.requireRelease(); // tikken en vasthouden tijdens het klaarstaan tellen niet
    input.takePress();
    if (g.pause <= 0) {
      g.mode = 'run';
      g.counting = false;
    }
  } else if (g.mode === 'won') {
    view.finale(dt);
    if (wasWaiting && g.pause <= 0) setOverlayReady(true);
  }
  showCount(g.mode === 'wait' && g.counting ? g.pause : 0);
  tutorial.update(g.mode === 'run' || g.mode === 'wait' ? g.run : null);
  view.draw(g.run, dt, g.mode === 'ready');
  updateHud(g.run, tries, bestOf(progress, g.level));
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
