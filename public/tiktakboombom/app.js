// Schermen en spellus van Tiktak Boom Bom
import { startRound, step } from './game.js';
import { createGame } from './game-setup.js';
import { resultOf } from './result.js';
import { createScene } from './scene.js';
import { bindInput, keyGlyph, keyName, isTouch } from './input.js';
import { createFx } from './fx.js';
import { sound, unlockSound, isMuted, setMuted } from './sound.js';
import { addDots, choosePlayers, showResult, showMute } from './menu.js';
import { createPresses } from './presses.js';

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const canvas = $('canvas');
const c = canvas.getContext('2d');
const scene = createScene(keyGlyph, keyName);
const fx = createFx();

let humans = 1;
let game = createGame(1);
let paused = false;
let last = performance.now();

function fit() {
  const box = stage.getBoundingClientRect();
  const v = scene.setPortrait(box.height > box.width * 1.05);
  const k = Math.min(box.width / v.w, box.height / v.h);
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.style.width = `${v.w * k}px`;
  canvas.style.height = `${v.h * k}px`;
  canvas.width = Math.round(v.w * k * ratio);
  canvas.height = Math.round(v.h * k * ratio);
}

// Welk scherm erover ligt; ← alleen tijdens het spelen, geluid alleen op de schermen.
function show(screen) {
  ['menu', 'end', 'pause'].forEach((id) => { $(id).hidden = id !== screen; });
  paused = screen === 'pause';
  $('to-menu').hidden = Boolean(screen);
  $('mute').hidden = !screen;
}

const playing = () => $('menu').hidden && $('end').hidden && !paused;

function begin() {
  unlockSound();
  document.activeElement?.blur(); // anders vangt de Start-knop de toetsen af
  game = createGame(humans);
  scene.reset();
  fx.clear();
  show(null);
  startRound(game);
}

function toMenu() {
  game = createGame(humans);
  scene.reset();
  fx.clear();
  show('menu');
}

// Pauze met ← of Escape; Escape in de pauze = verder.
function pause() {
  if (playing()) show('pause');
}

function resume() {
  show(null);
  document.activeElement?.blur();
}

function showEnd() {
  const r = resultOf(game);
  showResult(r);
  show('end');
  if (r.won) sound.win();
  else sound.lose();
}

function handle(e) {
  const at = e.who === undefined ? null : scene.pos(e.who);
  if (e.type === 'tick') sound.tick(e.n);
  else if (e.type === 'throw') sound.toss();
  else if (e.type === 'go') sound.go();
  else if (e.type === 'over') showEnd();
  else if (e.type === 'early') fx.pop('✋ Te vroeg!', at.x, at.y - 120, '#ffd43b');
  else if (e.type === 'drop') {
    sound.oops();
    fx.pop('😬 Oeps!', at.x, at.y - 120, '#ff8a65');
  } else if (e.type === 'boom') {
    sound.boom();
    fx.boom(at.x, at.y - 44);
  }
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const t = now / 1000;
  if (!paused) {
    step(game, dt);
    game.events.splice(0).forEach(handle);
    scene.update(game, dt);
    fx.update(dt);
  }
  const k = canvas.width / scene.view.w;
  const [sx, sy] = paused ? [0, 0] : fx.offset();
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.setTransform(k, 0, 0, k, sx * k, sy * k);
  scene.draw(c, game, t);
  fx.draw(c, scene.view);
  scene.drawBanners(c, game, isTouch());
  requestAnimationFrame(frame);
}

addDots();
document.querySelectorAll('[data-players]').forEach((btn) => {
  btn.addEventListener('click', () => {
    humans = Number(btn.dataset.players);
    choosePlayers(humans);
  });
});
$('start').addEventListener('click', begin);
$('again').addEventListener('click', begin);
$('back').addEventListener('click', toMenu);
$('to-menu').addEventListener('click', pause);
$('resume').addEventListener('click', resume);
$('pause-menu').addEventListener('click', toMenu);
$('mute').addEventListener('click', () => {
  unlockSound();
  setMuted(!isMuted());
  showMute();
  $('mute').blur();
});
showMute();

const presses = createPresses({ getGame: () => game, getHumans: () => humans, playing, scene, fx, canvas });
bindInput(stage, {
  getHumans: () => humans,
  playing,
  onKey: presses.onKey,
  onTap: presses.onTap,
  onEscape: () => (paused ? resume() : pause()),
  onActivity: unlockSound,
});
addEventListener('resize', fit);
fit();
choosePlayers(1);
show('menu');
requestAnimationFrame(frame);
