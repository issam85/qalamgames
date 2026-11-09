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

const WIN_PAUSE = 0.7; // een tik vlak na de finish slaat het scherm niet over
const RESPAWN_PAUSE = 0.7; // in de oefenmodus even klaarstaan op het checkpoint
const view = createView(document.getElementById('view'));
const input = createInput(onPress);
const progress = loadProgress(WORLDS.length);

let worldIndex = progress.unlocked - 1;
let level, run;
let mode = 'ready';
let practice = false;
let checkpoint = -1; // laatst bereikte checkpoint in de oefenmodus
let attempt = 1;
let pause = 0;
let spare = 0;
let last = performance.now();

function loadLevel(index) {
  worldIndex = index;
  level = WORLDS[index];
  view.load(level);
  run = createRun(level);
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
  run = createRun(level, practice && checkpoint >= 0 ? level.checkpoints[checkpoint] : 0);
  spare = 0;
  input.takePress();
  view.reset(practice);
  hideOverlay();
}

function play(asPractice) {
  practice = asPractice;
  checkpoint = -1;
  attempt = 1;
  clearRun();
  mode = 'run';
  menu.show(false);
  showToast(practice ? 'Oefenen' : level.zones[0].title);
}

function backToMenu() {
  practice = false;
  clearRun();
  mode = 'ready';
  menu.update(worldIndex);
  menu.show(true);
}
document.getElementById('to-menu').addEventListener('click', backToMenu);

function finishWorld() {
  mode = 'won';
  pause = WIN_PAUSE;
  if (!practice) completeWorld(progress, level, worldIndex, WORLDS.length);
  showWorldDone(level, WORLDS[worldIndex + 1], practice);
}

function onPress() {
  if (mode === 'ready') {
    play(false);
  } else if (mode === 'won' && pause <= 0) {
    if (practice || worldIndex === WORLDS.length - 1) return backToMenu();
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
  const percent = percentOf(run);
  if (!practice && recordPercent(progress, level, percent)) showToast(`Nieuw record: ${percent}%`);
}

function afterCrash() {
  attempt++;
  clearRun();
  mode = practice ? 'wait' : 'run';
  pause = RESPAWN_PAUSE;
}

function passCheckpoints() {
  while (checkpoint + 1 < level.checkpoints.length && run.x >= level.checkpoints[checkpoint + 1]) {
    checkpoint++;
    view.checkpoint(run);
  }
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
    if (practice) passCheckpoints();
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
  updateHud(run, attempt, practice, bestOf(progress, level));
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
