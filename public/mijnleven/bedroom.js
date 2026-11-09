// De slaapkamer: trek je pyjama aan (soort en kleur kiezen), speel op het
// muziekdoosje (tik op de toetsen of kies een liedje) en ga slapen. Slapen begint
// een nieuwe dag, en kan pas als je moe bent (genoeg gedaan in huis).
import { SWATCHES } from './data.js';
import { PYJAMAS, bedroomSvg, musicSvg, keyAt } from './bedroom-scene.js';
import { TUNES, playKey, playTune, stopTune } from './tunes.js';
import { trackPointer } from './pointer.js';
import { roomScreen } from './screen.js';
import { button, swatch, today } from './ui.js';

roomScreen({
  room: 'slaap', title: 'Slaapkamer', nav: 'Wat ga je doen', stage: 'cook-stage', heading: 'Moe', doneLabel: 'Slapen',
  extra: '<div id="slaap-items" class="items"></div><div id="slaap-colors" class="swatches" aria-label="Kleur van je pyjama"></div>',
});
const el = (name) => document.getElementById(`slaap-${name}`);
const PARTS = [['pyjama', 'Pyjama', 'Kies een pyjama en een kleur.'], ['muziek', 'Muziekdoosje', 'Tik op de toetsen en maak je eigen liedje, of kies er een.']];
const NIGHT_MS = 2600; // zo lang duurt de nacht

let api = null; // { getPyjama(), setPyjama(pyjama), getOutfit(), getHair(), getMakeup(), tired() → { done, need } }
let part = 'pyjama';
let lit = -1; // de toets die nu klinkt
let night = false;
let litTimer = 0;

const say = (text) => { el('hint').textContent = text; };
export const inPyjama = (pyjama) => pyjama.day === today();

function draw() {
  const pyjama = api.getPyjama();
  el('stage').innerHTML = part === 'muziek' && !night
    ? musicSvg(lit)
    : bedroomSvg({ outfit: api.getOutfit(), makeup: api.getMakeup(), hair: api.getHair(), pyjama, inPyjama: inPyjama(pyjama), night });
}

// laat een toets even oplichten
function light(key) {
  lit = key;
  draw();
  clearTimeout(litTimer);
  litTimer = setTimeout(() => {
    lit = -1;
    draw();
  }, 260);
}

function wear(patch) {
  api.setPyjama({ ...api.getPyjama(), ...patch, day: today() });
  say('Wat een fijne pyjama! Ben je moe? Tik dan op Slapen.');
  render();
}

function items() {
  const pyjama = api.getPyjama();
  if (part === 'pyjama') return PYJAMAS.map((label, i) => button('item', label, inPyjama(pyjama) && pyjama.kind === i, () => wear({ kind: i })));
  return TUNES.map(([label, steps]) => button('item', label, false, () => {
    say(`Je hoort ${label}.`);
    playTune(steps, light, () => say(PARTS[1][2]));
  }));
}

function renderPanel() {
  const pyjama = api.getPyjama();
  const { done, need } = api.tired();
  el('nav').replaceChildren(...PARTS.map(([key, label, hint]) => button('cat', label, key === part, () => {
    part = key;
    stopTune();
    say(hint);
    render();
  })));
  el('label').textContent = done >= need ? 'Je bent moe' : `${done} van ${need} dingen gedaan`;
  el('meter').style.width = `${Math.min(1, done / need) * 100}%`;
  el('items').replaceChildren(...items());
  el('colors').replaceChildren(...(part === 'pyjama' ? SWATCHES : []).map(([hex, name]) => swatch(
    hex, name, inPyjama(pyjama) && pyjama.color === hex, () => wear({ color: hex }),
  )));
}

function render() {
  renderPanel();
  draw();
}

// het wordt nacht: je ligt in bed, en daarna roept onMorning() de nieuwe dag
export function fallAsleep(onMorning) {
  stopTune();
  night = true;
  part = 'pyjama';
  say('Welterusten! Slaap lekker...');
  render();
  setTimeout(() => {
    night = false;
    onMorning();
  }, NIGHT_MS);
}

export function initBedroom(bedroomApi) {
  api = bedroomApi;
  trackPointer(el('stage'), {
    down: (p) => {
      const key = part === 'muziek' ? keyAt(p) : -1;
      if (key < 0) return;
      stopTune();
      playKey(key);
      light(key);
    },
    move: () => {},
    up: () => {},
  });
  el('reset').addEventListener('click', () => {
    stopTune();
    api.setPyjama({ ...api.getPyjama(), day: '' });
    say('Je pyjama is weer uit.');
    render();
  });
}

export function showBedroom() {
  part = 'pyjama';
  const { done, need } = api.tired();
  say(done >= need ? 'Je bent moe. Trek je pyjama aan en ga slapen.' : `Je bent nog niet moe. Doe eerst nog ${need - done} ${need - done === 1 ? 'ding' : 'dingen'} in huis.`);
  render();
}
