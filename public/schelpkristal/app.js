// Zoek Schelp Kristal: het beginscherm (prinses kiezen) en het wisselen van scherm.
// Houdt het spel bij: welke prinses, wat ze aanheeft, wat ze gevonden heeft
// (schelpen en kristallen op het strand, parels in de zee).
import { loadGame, saveGame } from './storage.js';
import { PRINCESSES } from './data.js';
import { princessSvg, setLooks } from './princess.js';
import { initDressing, showDressing } from './dressing.js';
import { decorate } from './pictures.js';
import { BACK_ARROW } from './icons.js';
import { initBeach, showBeach, hideBeach } from './beach.js';
import { initShower, showShower } from './shower-room.js';
import { initSea, showSea, hideSea } from './sea.js';
import { initBack, backFor, goBack } from './back.js';

const game = loadGame();
setLooks(game.looks);
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
    btn.setAttribute('aria-label', pr.name);
    btn.innerHTML = `${princessSvg(i, game.outfit, pr.name, '50 20 200 280').replace(' role="img"', ' aria-hidden="true"')}<b>${pr.name}</b>`;
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
  backFor(id);
  SHOW[id](arg);
}

// plaatjes op de knoppen, voor wie nog niet leest
[['to-strand', 'strand'], ['to-douche', 'douche'], ['to-zee', 'zee'], ['to-kleed', 'kleed'], ['kleed-done', 'klaar'], ['kleed-surprise', 'verras'],
  ['douche-reset', 'opnieuw'], ['douche-done', 'kleed'], ['strand-again', 'opnieuw'], ['zee-again', 'opnieuw']]
  .forEach(([id, name]) => decorate(document.getElementById(id), name));
document.querySelectorAll('.end-back').forEach((b) => decorate(b, 'terug'));
document.getElementById('back-btn').innerHTML = BACK_ARROW;

// één stap terug per scherm (de knop linksboven, Esc en Terug op de eindschermen)
initBack({
  'screen-kleed': () => show('screen-start'),
  'screen-strand': () => show('screen-start'),
  'screen-douche': () => show('screen-start'),
  'screen-zee': () => show('screen-kleed', true),
});
initDressing({ game, save, counters, go: (id) => show(id) });
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
document.querySelectorAll('.end-back').forEach((b) => b.addEventListener('click', goBack));
show('screen-start');
