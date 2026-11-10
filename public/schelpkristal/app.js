// Zoek Schelp Kristal: het beginscherm (prinses kiezen) en het wisselen van scherm.
// Houdt het spel bij: welke prinses, wat ze aanheeft, wat ze gevonden heeft
// (schelpen en kristallen op het strand, parels in de zee).
import { loadGame, saveGame } from './storage.js';
import { PRINCESSES } from './data.js';
import { princessSvg } from './princess.js';
import { initDressing, showDressing } from './dressing.js';
import { initBeach, showBeach, hideBeach } from './beach.js';
import { initShower, showShower } from './shower-room.js';
import { initSea, showSea, hideSea } from './sea.js';

const game = loadGame();
const save = () => saveGame(game);

function counters() {
  document.querySelectorAll('.shells').forEach((el) => { el.textContent = game.shells; });
  document.querySelectorAll('.crystals').forEach((el) => { el.textContent = game.crystals; });
  document.querySelectorAll('.pearls').forEach((el) => { el.textContent = game.pearls; });
}

function renderStart() {
  document.getElementById('start-doll').innerHTML = princessSvg(game.princess, game.outfit);
  document.getElementById('start-pick').replaceChildren(...PRINCESSES.map((pr, i) => {
    const btn = document.createElement('button');
    btn.className = 'princess';
    btn.setAttribute('aria-pressed', String(game.princess === i));
    btn.innerHTML = `${princessSvg(i, game.outfit, pr.name, '50 20 200 280')}<b>${pr.name}</b>`;
    btn.addEventListener('click', () => {
      game.princess = i;
      save();
      renderStart();
    });
    return btn;
  }));
}

const SHOW = {
  'screen-start': renderStart,
  'screen-kleed': showDressing,
  'screen-strand': showBeach,
  'screen-douche': showShower,
  'screen-zee': showSea,
};

// arg = extra voor het scherm (bij het kleedhokje: meteen bij Zwemkleding)
function show(id, arg) {
  hideBeach();
  hideSea();
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
  counters();
  SHOW[id](arg);
}

initDressing({ game, save, counters });
initBeach({ game, save, counters });
initShower({ game });
initSea({ game, save, counters });
// eerst omkleden in het kleedhokje, dan met "Naar de zee!" het water in
document.getElementById('to-zee').addEventListener('click', () => show('screen-kleed', true));
document.getElementById('to-douche').addEventListener('click', () => show('screen-douche'));
document.getElementById('douche-done').addEventListener('click', () => show('screen-kleed'));
document.getElementById('to-strand').addEventListener('click', () => show('screen-strand'));
document.getElementById('to-kleed').addEventListener('click', () => show('screen-kleed'));
document.getElementById('kleed-done').addEventListener('click', (e) => show(e.currentTarget.dataset.go || 'screen-start'));
document.querySelectorAll('.back').forEach((b) => b.addEventListener('click', () => show('screen-start')));
show('screen-start');
