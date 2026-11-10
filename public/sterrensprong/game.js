// Spelverloop: kiezen, spelen of oefenen, botsen en opnieuw, tot 100% en dan de volgende wereld.
import { PHYS, DEATH_PAUSE } from './config.js';
import { WORLDS } from './levels.js';
import { createRun, stepRun } from './physics.js';
import { createInput } from './input.js';
import { createView } from './view.js';
import { loadSkin, saveSkin } from './skins.js';
import { loadProgress, bestOf, recordPercent, completeWorld } from './progress.js';
import { createMenu } from './menu.js';
import { updateHud, percentOf, showWorldDone, hideOverlay, flash, showToast } from './hud.js';
import { createTries } from './tries.js';

const WIN_PAUSE = 0.7; // een tik vlak na de finish slaat het scherm niet over
const RESPAWN_PAUSE = 0.7; // even klaarstaan op het checkpoint
const view = createView(document.getElementById('view'));
const input = createInput(onPress);
const progress = loadProgress(WORLDS.length);
const tries = createTries();

let worldIndex = progress.unlocked - 1;
let level, run;
let mode = 'ready';
let pause = 0;
let spare = 0;
let last = performance.now();

function loadLevel(index) {
  worldIndex = index;
  level = WORLDS[index];
  view.load(level);
  run = createRun(level);
  tries.begin(level, false);
}

loadLevel(worldIndex);
const firstSkin = loadSkin();
view.setSkin(firstSkin);
const menu = createMenu({ skin: firstSkin, worlds: WORLDS, progress, selected: worldIndex }, {
  onSkin(skin) {
    view.setSkin(skin);
    saveSkin(skin);
  },
  onWorld: loadLevel,
  onStart: () => play(false),
  onPractice: () => play(true),
});

function clearRun() {
  run = createRun(level, tries.spawn());
  spare = 0;
  input.takePress();
  view.reset(tries.practice);
  hideOverlay();
}

function play(practice) {
  tries.begin(level, practice);
  clearRun();
  mode = 'run';
  menu.show(false);
  showToast(practice ? 'Oefenen' : level.zones[0].title);
}

function backToMenu() {
  tries.begin(level, false);
  clearRun();
  mode = 'ready';
  menu.update(worldIndex);
  menu.show(true);
}
document.getElementById('to-menu').addEventListener('click', backToMenu);

function finishWorld() {
  mode = 'won';
  pause = WIN_PAUSE;
  if (!tries.practice) completeWorld(progress, level, worldIndex, WORLDS.length);
  showWorldDone(level, WORLDS[worldIndex + 1], tries.practice);
}

function onPress() {
  if (mode === 'ready') {
    play(false);
  } else if (mode === 'won' && pause <= 0) {
    if (tries.practice || worldIndex === WORLDS.length - 1) return backToMenu();
    loadLevel(worldIndex + 1);
    play(false);
  }
  return undefined;
}

function crash() {
  mode = 'dead';
  pause = DEATH_PAUSE;
  view.crash(run);
  flash();
  tries.lose();
  const percent = percentOf(run);
  if (!tries.practice && recordPercent(progress, level, percent)) showToast(`Nieuw record: ${percent}%`);
}

function afterCrash() {
  const outOfLives = tries.respawn();
  clearRun();
  if (outOfLives) showToast('Geen levens meer: opnieuw!');
  mode = tries.reached < 0 ? 'run' : 'wait';
  pause = RESPAWN_PAUSE;
}

function passCheckpoint() {
  if (!tries.pass(run.x)) return;
  view.checkpoint(run);
  if (!tries.practice) showToast(`Checkpoint ${(tries.reached + 1) * 20}%`);
}

function simulate(dt) {
  spare += dt;
  let pressed = input.takePress();
  while (spare >= PHYS.step && run.state === 'run') {
    stepRun(run, input.held(), pressed);
    pressed = false;
    spare -= PHYS.step;
  }
  view.events(run);
  if (run.state === 'dead') {
    crash();
  } else if (run.state === 'won') {
    finishWorld();
  } else {
    passCheckpoint();
    view.trail(run, dt);
  }
}

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  pause -= dt;
  if (mode === 'run') simulate(dt);
  else if (mode === 'dead' && pause <= 0) afterCrash();
  else if (mode === 'wait' && pause <= 0) mode = 'run';
  else if (mode === 'won') view.finale(dt);
  view.draw(run, dt, mode === 'ready');
  updateHud(run, tries, bestOf(progress, level));
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
