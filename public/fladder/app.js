// Fladder over Gouda: schermen, spellus en invoer.
import { fieldSize } from './config.js';
import { createWorld, flap, step } from './world.js';
import { createFx, addPoint, addCrash, updateFx } from './fx.js';
import { createSky, updateSky, drawScene } from './scene.js';
import { loadBest, saveBest } from './storage.js';
import { sound, unlockSound } from './sound.js';
import { bindControls } from './controls.js';

const $ = (id) => document.getElementById(id);
const canvas = $('canvas');
const ctx = canvas.getContext('2d');
const ui = { menu: $('menu'), pause: $('pause'), end: $('end'), back: $('to-menu') };

let world;
let fx = createFx();
let sky = createSky();
let mode = 'menu'; // menu, play, pause, end
let endAt = 0;
let best = loadBest();

function fit() {
  const scale = Math.max(0.1, Math.min(innerWidth / world.w, innerHeight / world.h));
  const dpr = Math.min(2, devicePixelRatio || 1);
  canvas.style.width = `${world.w * scale}px`;
  canvas.style.height = `${world.h * scale}px`;
  canvas.width = Math.round(world.w * scale * dpr);
  canvas.height = Math.round(world.h * scale * dpr);
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
}

function newWorld() {
  const { w, h } = fieldSize(innerWidth, innerHeight);
  world = createWorld(w, h);
  fx = createFx();
  sky = createSky();
  fit();
}

function show(name) {
  for (const key of ['menu', 'pause', 'end']) ui[key].hidden = key !== name;
  ui.back.hidden = name !== null;
}

function startGame() {
  unlockSound();
  newWorld();
  mode = 'play';
  show(null);
}

function endGame() {
  mode = 'end';
  endAt = performance.now();
  const record = world.score > best;
  if (record) {
    best = world.score;
    saveBest(best);
    sound.record();
  }
  $('end-score').textContent = world.score;
  $('end-best').textContent = best;
  $('end-record').hidden = !record;
  show('end');
}

function pause() {
  if (mode !== 'play') return;
  mode = 'pause';
  show('pause');
}

function resume() {
  mode = 'play';
  show(null);
}

function toMenu() {
  newWorld();
  mode = 'menu';
  $('menu-best').textContent = best;
  show('menu');
}

function handle(events) {
  for (const e of events) {
    if (e.type === 'point') {
      sound.point();
      addPoint(fx, world.bird.x + 30, world.bird.y - 30);
    } else if (e.type === 'hit') {
      sound.hit();
      addCrash(fx, world.bird.x, world.bird.y);
    } else if (e.type === 'land') {
      sound.land();
      setTimeout(() => mode === 'play' && endGame(), 600);
    }
  }
}

function press() {
  unlockSound();
  if (mode === 'play' && flap(world)) sound.flap();
  else if (mode === 'end' && performance.now() - endAt > 700) startGame();
}

// Tijd zelf meten: requestAnimationFrame geeft niet overal een tijd mee.
let last = performance.now();
function frame() {
  const now = performance.now();
  const total = Math.min(0.05, (now - last) / 1000);
  let dt = total;
  last = now;
  if (mode === 'play' || mode === 'menu') {
    const events = [];
    while (dt > 0) {
      const part = Math.min(dt, 1 / 120);
      step(world, part, events);
      updateFx(fx, part);
      dt -= part;
    }
    handle(events);
    updateSky(sky, world.score, total);
  }
  drawScene(ctx, world, fx, sky, mode !== 'menu');
  requestAnimationFrame(frame);
}

bindControls({
  press,
  start: () => mode === 'menu' && startGame(),
  togglePause: () => (mode === 'play' ? pause() : mode === 'pause' && resume()),
});
$('start').addEventListener('click', startGame);
$('again').addEventListener('click', startGame);
$('end-menu').addEventListener('click', toMenu);
$('resume').addEventListener('click', resume);
$('pause-menu').addEventListener('click', toMenu);
ui.back.addEventListener('click', pause);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') pause();
});
addEventListener('resize', () => (mode === 'menu' ? newWorld() : fit()));

toMenu();
requestAnimationFrame(frame);
