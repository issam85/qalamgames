// Spelverloop: kleuren kiezen, spelen, botsen en meteen opnieuw, tot 100% en dan de volgende wereld.
import { PHYS, DEATH_PAUSE } from './config.js';
import { WORLDS } from './levels.js';
import { createRun, stepRun } from './physics.js';
import { createInput } from './input.js';
import { createWorld } from './world.js';
import { buildObstacles } from './obstacles3d.js';
import { createBoosts } from './boosts3d.js';
import { createPlayer } from './player3d.js';
import { createShatter } from './shatter.js';
import { createFx } from './fx.js';
import { loadSkin, saveSkin } from './skins.js';
import { createMenu } from './menu.js';
import { updateHud, showWorldDone, hideOverlay, flash, showToast } from './hud.js';
import { playEvents } from './events.js';

const WIN_PAUSE = 0.7; // een tik vlak na de finish slaat het scherm niet over
const world = createWorld(document.getElementById('view'));
const player = createPlayer(world.scene);
const shatter = createShatter(world.scene);
const fx = createFx(world.scene);
const input = createInput(onPress);

let worldIndex = Math.min(WORLDS.length - 1, Math.max(0, (Number(new URLSearchParams(location.search).get('wereld')) || 1) - 1));
let level, boosts, run;
let mode = 'ready';
let attempt = 1;
let pause = 0;
let spare = 0;
let last = performance.now();

function loadLevel(index) {
  worldIndex = index;
  level = WORLDS[index];
  const stage = world.load(level);
  buildObstacles(stage, level);
  boosts = createBoosts(stage, level);
  run = createRun(level);
  attempt = 1;
}

function applySkin(skin) {
  player.setSkin(skin);
  shatter.setColor(skin.body);
  fx.setSpark(skin.body);
}

loadLevel(worldIndex);
const firstSkin = loadSkin();
applySkin(firstSkin);
const menu = createMenu(firstSkin, {
  onChange(skin) {
    applySkin(skin);
    saveSkin(skin);
  },
  onStart: restart,
});
menu.show(true);

function clearRun() {
  run = createRun(level);
  spare = 0;
  input.takePress();
  player.reset();
  player.setVisible(true);
  shatter.hide();
  hideOverlay();
}

function restart() {
  clearRun();
  mode = 'run';
  menu.show(false);
  showToast(level.zones[0].title);
}

function backToMenu() {
  clearRun();
  mode = 'ready';
  attempt = 1;
  menu.show(true);
}
document.getElementById('to-menu').addEventListener('click', backToMenu);

function finishWorld() {
  mode = 'won';
  pause = WIN_PAUSE;
  showWorldDone(level, WORLDS[worldIndex + 1]);
}

function onPress() {
  if (mode === 'ready') {
    restart();
  } else if (mode === 'won' && pause <= 0) {
    loadLevel((worldIndex + 1) % WORLDS.length);
    restart();
  }
}

function crash() {
  mode = 'dead';
  pause = DEATH_PAUSE;
  player.setVisible(false);
  shatter.burst(run.x, run.y);
  world.kick(0.55);
  flash();
}

function simulate(dt) {
  spare += dt;
  let pressed = input.takePress();
  while (spare >= PHYS.step && run.state === 'run') {
    stepRun(run, input.held(), pressed);
    pressed = false;
    spare -= PHYS.step;
  }
  playEvents(run, fx, world);
  if (run.state === 'dead') crash();
  else if (run.state === 'won') finishWorld();
  else fx.trail(run, dt);
}

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  pause -= dt;
  if (mode === 'run') {
    simulate(dt);
  } else if (mode === 'dead' && pause <= 0) {
    attempt++;
    restart();
  } else if (mode === 'won') {
    fx.finale(level.length, dt);
  }
  const inMenu = mode === 'ready';
  player.update(run, dt, inMenu);
  boosts.update(run, dt);
  shatter.update(dt);
  fx.update(dt);
  world.follow(run, dt, inMenu);
  world.render();
  updateHud(run, attempt);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
