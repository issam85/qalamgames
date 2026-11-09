// Schermen en spellus van Boem Rond!
import { startRound, step, press } from './game.js';
import { createGame } from './game-setup.js';
import { resultOf } from './result.js';
import { createScene } from './scene.js';
import { bindInput, keyGlyph, isTouch } from './input.js';
import { createFx } from './fx.js';
import { sound, unlockSound, isMuted, setMuted } from './sound.js';

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const canvas = $('canvas');
const c = canvas.getContext('2d');
const menu = $('menu');
const end = $('end');
const scene = createScene(keyGlyph);
const fx = createFx();

let humans = 1;
let game = createGame(1);
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

function begin() {
  unlockSound();
  game = createGame(humans);
  menu.hidden = true;
  end.hidden = true;
  startRound(game);
}

function showEnd() {
  const r = resultOf(game);
  $('end-title').textContent = r.title;
  $('end-title').classList.toggle('won', r.won);
  $('end-text').textContent = r.text;
  end.hidden = false;
  if (r.won) sound.win();
  else sound.lose();
}

function handle(e) {
  const at = e.who === undefined ? null : scene.pos(e.who);
  if (e.type === 'tick') sound.tick(e.n);
  else if (e.type === 'throw') sound.toss();
  else if (e.type === 'go') sound.go();
  else if (e.type === 'over') showEnd();
  else if (e.type === 'early') fx.pop('Te vroeg!', at.x, at.y - 120, '#ffd43b');
  else if (e.type === 'drop') {
    sound.oops();
    fx.pop('Oeps!', at.x, at.y - 120, '#ff8a65');
  } else if (e.type === 'boom') {
    sound.boom();
    fx.boom(at.x, at.y - 44);
  }
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const t = now / 1000;
  step(game, dt);
  game.events.splice(0).forEach(handle);
  scene.update(game, dt);
  fx.update(dt);
  const k = canvas.width / scene.view.w;
  const [sx, sy] = fx.offset();
  c.setTransform(k, 0, 0, k, sx * k, sy * k);
  scene.draw(c, game, t);
  fx.draw(c, scene.view);
  scene.drawBanners(c, game, isTouch());
  requestAnimationFrame(frame);
}

document.querySelectorAll('[data-players]').forEach((btn) => {
  btn.addEventListener('click', () => {
    humans = Number(btn.dataset.players);
    document.querySelectorAll('[data-players]').forEach((b) => b.classList.toggle('on', b === btn));
    $('how-keys').textContent = isTouch()
      ? (humans === 1 ? 'Tik op het scherm om door te geven.' : 'Speler 1 tikt links, speler 2 tikt rechts.')
      : (humans === 1 ? 'Geef door met pijltje naar rechts.' : 'Speler 1 geeft door met D, speler 2 met pijltje naar rechts.');
  });
});
$('start').addEventListener('click', begin);
$('again').addEventListener('click', begin);
$('back').addEventListener('click', () => {
  end.hidden = true;
  menu.hidden = false;
  game = createGame(humans);
});

function showMute() {
  $('mute').textContent = isMuted() ? 'Geluid: uit' : 'Geluid: aan';
}
$('mute').addEventListener('click', () => {
  unlockSound();
  setMuted(!isMuted());
  showMute();
});
showMute();

bindInput(stage, () => humans, (who) => press(game, who));
addEventListener('resize', fit);
fit();
document.querySelector('[data-players="1"]').click();
requestAnimationFrame(frame);
