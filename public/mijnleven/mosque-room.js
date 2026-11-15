// Moskee en Mekka: links kies je wudu (de stappen in de goede volgorde tikken), het
// gebed (bij de lucht het goede gebed kiezen) of de reis naar Mekka (rondjes om de
// Kaaba slepen, Zamzam drinken, heen en weer lopen tussen Safa en Marwa). Het paneel
// zit in mosque-panel.js.
import {
  WUDU, PRAYERS, KAABA, SAFA_X, MARWA_X, freshMosque, newDay, wuduDone, prayersDone, askedPrayer,
  pickWudu, pickPrayer, journeyStep, onSquare, circle, walk, towardsMarwa,
} from './mosque.js';
import { wuduSvg, prayerSvg } from './mosque-scene.js';
import { meccaSvg } from './mecca-scene.js';
import { JOURNEY, intro } from './mosque-text.js';
import { renderMosquePanel, mosqueMeter } from './mosque-panel.js';
import { trackPointer, onFrame } from './pointer.js';
import { pulse, today } from './ui.js';

const el = (name) => document.getElementById(`moskee-${name}`);
let api = null; // { getMosque(), setMosque(mosque), journeyDone() }
let part = 'wudu';
let where = { x: KAABA.x + 76, y: KAABA.y }; // waar jij loopt op de reis
let lap = null; // waar de haal om de Kaaba nu is (null = er is geen haal op het plein)

const mosque = () => api.getMosque();
const say = (text) => { el('hint').textContent = text; };

function draw() {
  if (part === 'wudu') el('stage').innerHTML = wuduSvg(mosque());
  else el('stage').innerHTML = part === 'gebed' ? prayerSvg(mosque()) : meccaSvg(mosque(), where);
}
const redraw = onFrame(draw);

function change(next, text) {
  api.setMosque(next);
  say(text);
  render();
}

function tapWudu(index) {
  const next = pickWudu(mosque(), index);
  if (next) {
    change(next, wuduDone(next) ? 'Je wudu is klaar! Nu kun je bidden.' : 'Goed zo! Wat komt er nu?');
    return;
  }
  if (index < mosque().wudu) {
    say('Die stap heb je al gedaan.');
    return;
  }
  // een foute stap: de goede knop licht op
  say(`Nog niet. Eerst: ${WUDU[mosque().wudu].toLowerCase()}.`);
  pulse(el('items').querySelector(`[data-key="stap-${mosque().wudu}"]`));
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

const renderPanel = () => renderMosquePanel(mosque(), part, {
  part: (key) => {
    part = key;
    say(intro(mosque(), part));
    render();
  },
  wudu: tapWudu,
  prayer: tapPrayer,
  zamzam: () => travel({ ...mosque(), zamzam: true }),
});

function render() {
  renderPanel();
  draw();
}

// Slepen op de reis: rondjes om de Kaaba, of lopen tussen Safa en Marwa. Bij de tawaf
// telt alleen een haal op het plein: ga je eraf, dan begint de haal opnieuw waar je
// weer op het plein komt (een sprong over de Kaaba telt dus niet).
function onMove(p, pressed) {
  if (!p || !pressed || part !== 'mekka') return;
  const step = journeyStep(mosque());
  if (step === 'tawaf') {
    if (!onSquare(p)) lap = null;
    else {
      if (lap) travel(circle(mosque(), lap, p));
      lap = p;
      where = p;
      mosqueMeter(mosque(), part);
    }
  } else if (step === 'sai') {
    where = { x: Math.max(SAFA_X, Math.min(MARWA_X, p.x)), y: 0 };
    travel(walk(mosque(), where.x));
  }
  redraw();
}

export function initMosque(mosqueApi) {
  api = mosqueApi;
  trackPointer(el('stage'), {
    // bij Zamzam drink je met een tik
    down: (p) => {
      lap = null;
      if (part === 'mekka' && journeyStep(mosque()) === 'zamzam') {
        travel({ ...mosque(), zamzam: true });
        draw();
        return;
      }
      onMove(p, true);
    },
    move: onMove,
    up: () => { lap = null; },
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
