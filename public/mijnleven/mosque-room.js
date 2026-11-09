// Moskee en Mekka: links kies je wudu (de stappen in de goede volgorde tikken), het
// gebed (bij de lucht het goede gebed kiezen) of de reis naar Mekka (rondjes om de
// Kaaba slepen, Zamzam drinken, heen en weer lopen tussen Safa en Marwa).
import {
  WUDU, WUDU_SHELF, PRAYERS, KAABA, SAFA_X, MARWA_X, freshMosque, newDay, wuduDone, prayersDone, askedPrayer,
  pickWudu, pickPrayer, journeyStep, progress, onSquare, circle, walk, towardsMarwa,
} from './mosque.js';
import { wuduSvg, prayerSvg } from './mosque-scene.js';
import { meccaSvg } from './mecca-scene.js';
import { JOURNEY, intro } from './mosque-text.js';
import { trackPointer } from './pointer.js';
import { roomScreen } from './screen.js';
import { button, today } from './ui.js';

roomScreen({
  room: 'moskee', title: 'Moskee en Mekka', nav: 'Wat ga je doen', stage: 'cook-stage',
  extra: '<div id="moskee-items" class="items"></div>',
});
const el = (name) => document.getElementById(`moskee-${name}`);
const PARTS = [['wudu', 'Wudu'], ['gebed', 'Gebed'], ['mekka', 'Reis naar Mekka']];
let api = null; // { getMosque(), setMosque(mosque), journeyDone() }
let part = 'wudu';
let where = { x: KAABA.x + 76, y: KAABA.y }; // waar jij loopt op de reis

const mosque = () => api.getMosque();
const say = (text) => { el('hint').textContent = text; };

function draw() {
  if (part === 'wudu') el('stage').innerHTML = wuduSvg(mosque());
  else el('stage').innerHTML = part === 'gebed' ? prayerSvg(mosque()) : meccaSvg(mosque(), where);
}

function change(next, text) {
  api.setMosque(next);
  say(text);
  render();
}

function tapWudu(index) {
  const next = pickWudu(mosque(), index);
  if (!next) say(index < mosque().wudu ? 'Die stap heb je al gedaan.' : `Nog niet. Eerst: ${WUDU[mosque().wudu].toLowerCase()}.`);
  else change(next, wuduDone(next) ? 'Je wudu is klaar! Nu kun je bidden.' : 'Goed zo! Wat komt er nu?');
}

function tapPrayer(index) {
  const m = mosque();
  if (!wuduDone(m)) say('Doe eerst wudu voordat je gaat bidden.');
  else if (!pickPrayer(m, index)) say(`${PRAYERS[index].name} is het gebed van ${PRAYERS[index].when}. Kijk nog eens naar de lucht.`);
  else {
    const next = pickPrayer(m, index);
    change(next, `Goed! Je bidt ${PRAYERS[index].name}. ${prayersDone(next) ? 'Dat waren ze alle vijf!' : `${askedPrayer(next).sky} Welk gebed is het?`}`);
  }
}

// na elke stap van de reis: de volgende uitleg, en aan het eind de beloning
function travel(next) {
  const before = journeyStep(mosque());
  api.setMosque(next);
  if (journeyStep(next) === before) return;
  say(JOURNEY[journeyStep(next)]);
  if (journeyStep(next) === 'sai') where = { x: SAFA_X, y: 0 };
  if (journeyStep(next) === 'klaar') api.journeyDone();
  renderPanel();
}

function items() {
  const m = mosque();
  if (part === 'wudu') return WUDU_SHELF.map((i) => button('item', WUDU[i], i < m.wudu, () => tapWudu(i)));
  if (part === 'gebed') return PRAYERS.map((p, i) => button('item', p.name, false, () => tapPrayer(i)));
  if (journeyStep(m) === 'zamzam') return [button('btn gold', 'Drink Zamzam', false, () => travel({ ...m, zamzam: true }))];
  if (journeyStep(m) !== 'klaar') return [];
  const link = document.createElement('a');
  link.className = 'btn gold';
  link.href = '/#hajj';
  link.target = '_top';
  link.textContent = 'Speel het Hajj-spel';
  return [link];
}

function meter() {
  const amount = progress(mosque(), part);
  el('label').textContent = amount === 1 ? 'Klaar!' : `${Math.round(amount * 100)}%`;
  el('meter').style.width = `${amount * 100}%`;
}

function renderPanel() {
  const m = mosque();
  // een onderdeel dat af is krijgt een vinkje
  const ok = { wudu: wuduDone(m), gebed: prayersDone(m), mekka: journeyStep(m) === 'klaar' };
  el('nav').replaceChildren(...PARTS.map(([key, label]) => button('cat', ok[key] ? `${label} ✓` : label, key === part, () => {
    part = key;
    say(intro(mosque(), part));
    render();
  })));
  el('title').textContent = PARTS.find(([key]) => key === part)[1];
  meter();
  el('items').replaceChildren(...items());
}

function render() {
  renderPanel();
  draw();
}

// slepen op de reis: rondjes om de Kaaba, of lopen tussen Safa en Marwa
function onMove(p, pressed) {
  if (!p || !pressed || part !== 'mekka') return;
  const step = journeyStep(mosque());
  if (step === 'tawaf' && onSquare(p)) {
    travel(circle(mosque(), where, p));
    where = p;
    meter();
  } else if (step === 'sai') {
    where = { x: Math.max(SAFA_X, Math.min(MARWA_X, p.x)), y: 0 };
    travel(walk(mosque(), where.x));
  }
  draw();
}

export function initMosque(mosqueApi) {
  api = mosqueApi;
  trackPointer(el('stage'), {
    // bij de tawaf begint een nieuwe haal waar je neerkomt: een sprong telt niet mee;
    // bij Zamzam drink je met een tik
    down: (p) => {
      const step = part === 'mekka' ? journeyStep(mosque()) : '';
      if (step === 'tawaf' && onSquare(p)) where = p;
      if (step === 'zamzam') travel({ ...mosque(), zamzam: true });
      onMove(p, true);
    },
    move: onMove,
    up: () => {},
  });
  el('reset').addEventListener('click', () => {
    where = { x: KAABA.x + 76, y: KAABA.y };
    change({ ...freshMosque(), day: today() }, 'Opnieuw! Begin met wudu.');
  });
}

// bij het binnenkomen: elke dag opnieuw wudu, de gebeden en de reis
export function showMosque() {
  api.setMosque(newDay(mosque(), today()));
  if (journeyStep(mosque()) === 'sai') where = { x: towardsMarwa(mosque()) ? SAFA_X : MARWA_X, y: 0 };
  say(intro(mosque(), part));
  render();
}
