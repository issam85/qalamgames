// Spelverloop: kleuren kiezen, spelen, botsen en meteen opnieuw, finish.
import { PHYS, DEATH_PAUSE } from './config.js';
import { TEST_LEVEL } from './levels.js';
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
import { updateHud, showOverlay, hideOverlay, flash } from './hud.js';

const level = TEST_LEVEL;
const world = createWorld(document.getElementById('view'), level);
buildObstacles(world.scene, level);
const boosts = createBoosts(world.scene, level);
const player = createPlayer(world.scene);
const shatter = createShatter(world.scene);
const fx = createFx(world.scene);
const input = createInput(onPress);

let run = createRun(level);
let mode = 'ready';
let attempt = 1;
let pause = 0;
let spare = 0;
let last = performance.now();

function applySkin(skin) {
  player.setSkin(skin);
  shatter.setColor(skin.body);
  fx.setSpark(skin.body);
}

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
}

function backToMenu() {
  clearRun();
  mode = 'ready';
  attempt = 1;
  menu.show(true);
}
document.getElementById('to-menu').addEventListener('click', backToMenu);

function onPress() {
  if (mode === 'ready') {
    restart();
  } else if (mode === 'won') {
    attempt = 1;
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

function playEvents() {
  run.events.forEach((e) => {
    if (e.type === 'land') fx.dust(e.x, e.y);
    if (e.type === 'boost') {
      fx.burst(e.x, e.y + 0.45, e.kind === 'ring' ? '#5cf2d6' : '#ffd43b', 18, 8);
      world.kick(0.16);
    }
  });
  run.events.length = 0;
}

function simulate(dt) {
  spare += dt;
  let pressed = input.takePress();
  while (spare >= PHYS.step && run.state === 'run') {
    stepRun(run, input.held(), pressed);
    pressed = false;
    spare -= PHYS.step;
  }
  playEvents();
  if (run.state === 'dead') crash();
  if (run.state === 'won') {
    mode = 'won';
    showOverlay('Gehaald!', 'Druk op spatie of tik om nog een keer te spelen');
  } else if (run.state === 'run') {
    fx.trail(run, dt);
  }
}

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (mode === 'run') {
    simulate(dt);
  } else if (mode === 'dead') {
    pause -= dt;
    if (pause <= 0) {
      attempt++;
      restart();
    }
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
