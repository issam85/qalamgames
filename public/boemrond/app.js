// Schermen en spellus van Boem Rond!
import { startRound, step, press } from './game.js';
import { createGame } from './game-setup.js';
import { resultOf } from './result.js';
import { createScene } from './scene.js';
import { bindInput, keyGlyph, isTouch } from './input.js';

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const canvas = $('canvas');
const c = canvas.getContext('2d');
const menu = $('menu');
const end = $('end');
const scene = createScene(keyGlyph);

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
}

function handle(e) {
  if (e.type === 'over') showEnd();
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const t = now / 1000;
  step(game, dt);
  game.events.splice(0).forEach(handle);
  scene.update(game, dt);
  const k = canvas.width / scene.view.w;
  c.setTransform(k, 0, 0, k, 0, 0);
  scene.draw(c, game, t);
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

bindInput(stage, () => humans, (who) => press(game, who));
addEventListener('resize', fit);
fit();
document.querySelector('[data-players="1"]').click();
requestAnimationFrame(frame);

// Voor het testen in de browser.
window.boemrond = { get game() { return game; } };
