// Spelverloop: starten, spelen, botsen en meteen opnieuw, finish.
import { PHYS, DEATH_PAUSE } from './config.js';
import { TEST_LEVEL } from './levels.js';
import { createRun, stepRun } from './physics.js';
import { createInput } from './input.js';
import { createWorld } from './world.js';
import { buildObstacles } from './obstacles3d.js';
import { createPlayer } from './player3d.js';
import { createShatter } from './shatter.js';

const $ = (id) => document.getElementById(id);
const level = TEST_LEVEL;
const world = createWorld($('view'), level);
buildObstacles(world.scene, level);
const player = createPlayer(world.scene);
const shatter = createShatter(world.scene);
const input = createInput(onPress);

let run = createRun(level);
let mode = 'ready';
let attempt = 1;
let pause = 0;
let spare = 0;
let last = performance.now();

function showOverlay(title, text) {
  $('overlay-title').textContent = title;
  $('overlay-text').textContent = text;
  $('overlay').hidden = false;
}

function updateHud() {
  const percent = Math.min(100, Math.floor((run.x / level.length) * 100));
  $('bar-fill').style.width = `${percent}%`;
  $('percent').textContent = `${percent}%`;
  $('attempt').textContent = `Poging ${attempt}`;
}

function restart() {
  run = createRun(level);
  mode = 'run';
  spare = 0;
  input.takePress();
  player.reset();
  player.setVisible(true);
  shatter.hide();
  $('overlay').hidden = true;
}

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
  const flash = $('flash');
  flash.classList.remove('on');
  void flash.offsetWidth; // laat de animatie opnieuw beginnen
  flash.classList.add('on');
}

function simulate(dt) {
  spare += dt;
  let pressed = input.takePress();
  while (spare >= PHYS.step && run.state === 'run') {
    stepRun(run, input.held(), pressed);
    pressed = false;
    spare -= PHYS.step;
  }
  if (run.state === 'dead') crash();
  if (run.state === 'won') {
    mode = 'won';
    showOverlay('Gehaald!', 'Druk op spatie of tik om nog een keer te spelen');
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
  }
  player.update(run, dt);
  shatter.update(dt);
  world.follow(run, dt);
  world.render();
  updateHud();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
