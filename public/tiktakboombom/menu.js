// Wat in HTML staat: startscherm (stipjes, toetsen), eindscherm en de geluidsknop.
import { PLAYER_COLORS } from './data.js';
import { keyName, isTouch } from './input.js';
import { isMuted } from './sound.js';

const $ = (id) => document.getElementById(id);

function chip(text, color) {
  const span = document.createElement('span');
  span.textContent = text;
  span.style.background = color;
  return span;
}

// Onder elk cijfer evenveel stipjes als spelers, in hun kleuren.
export function addDots() {
  document.querySelectorAll('[data-players]').forEach((btn) => {
    const n = Number(btn.dataset.players);
    const dots = document.createElement('span');
    dots.className = 'dots';
    dots.setAttribute('aria-hidden', 'true');
    PLAYER_COLORS.slice(0, n).forEach((color) => {
      const dot = document.createElement('i');
      dot.style.background = color;
      dots.append(dot);
    });
    btn.append(dots);
    btn.setAttribute('aria-label', n === 1 ? '1 speler' : `${n} spelers`);
  });
}

export function choosePlayers(humans) {
  document.querySelectorAll('[data-players]').forEach((b) => {
    const on = Number(b.dataset.players) === humans;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  showControls(humans);
}

// Wie welke toets heeft (of op een tablet: tik bij je eigen poppetje).
function showControls(humans) {
  const box = $('how-keys');
  box.replaceChildren();
  if (humans === 1) {
    box.textContent = isTouch() ? 'Tik op het scherm om door te geven.' : 'Geef door met pijltje naar rechts.';
    return;
  }
  if (isTouch()) box.textContent = 'Tik bij je eigen poppetje.';
  const keys = document.createElement('div');
  keys.className = 'keys';
  PLAYER_COLORS.slice(0, humans).forEach((color, i) => {
    const key = keyName(i, humans);
    keys.append(chip(key ? `Speler ${i + 1}: ${key}` : `Speler ${i + 1}`, color));
  });
  box.append(keys);
}

export function showResult(r) {
  $('end-title').textContent = r.title;
  $('end-title').classList.toggle('won', r.won);
  $('end-text').textContent = r.text;
  $('end-text').hidden = !r.text;
  $('end-ranks').replaceChildren(...r.ranks.map((p) => chip(p.text, p.color)));
}

export function showMute() {
  const muted = isMuted();
  $('mute').textContent = muted ? '🔇' : '🔊';
  $('mute').setAttribute('aria-pressed', String(muted));
}
