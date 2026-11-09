// Het gezin: kies links wat je gaat doen en tik op papa of een dochter. Eten komt uit
// de keuken, thee is voor papa, de bal gooi je drie keer, voorlezen doe je door het
// boek over een dochter te slepen, en wie alle hartjes heeft mag naar bed.
import { MEMBERS, READ_STEPS, freshFamily, newDay, progress, allFed, memberAt, readTo, act } from './family.js';
import { familySvg } from './family-scene.js';
import { trackPointer } from './pointer.js';
import { roomScreen } from './screen.js';
import { button, cursorSvg, today } from './ui.js';

roomScreen({ room: 'gezin', title: 'Gezin', nav: 'Wat ga je doen', stage: 'salon-stage', heading: 'Gelukkig' });
const navEl = document.getElementById('gezin-nav');
const stageEl = document.getElementById('gezin-stage');
const meterEl = document.getElementById('gezin-meter');
const labelEl = document.getElementById('gezin-label');
const hintEl = document.getElementById('gezin-hint');
const TOOLS = [
  { key: 'eten', label: 'Eten geven', hint: 'Tik op wie je eten geeft. Het eten komt uit de keuken.',
    glyph: '<ellipse cx="0" cy="6" rx="24" ry="8" fill="#fff" stroke="#e6d6f5" stroke-width="2"/><path d="M-15 4 C-11 -14 11 -14 15 4 Z" fill="#f0cf7a" stroke="rgba(0,0,0,0.15)"/>' },
  { key: 'thee', label: 'Thee', hint: 'Tik op papa om hem een glaasje thee te brengen.',
    glyph: '<path d="M-10 -14 L10 -14 L7 14 L-7 14 Z" fill="#c98a2b" stroke="#fff" stroke-width="2"/><path d="M-4 -14 q4 -10 10 -6 q-2 8 -10 6z" fill="#43a047"/>' },
  { key: 'bal', label: 'Bal', hint: 'Tik drie keer op een dochter om de bal over te gooien.',
    glyph: '<circle r="15" fill="#ff7a59" stroke="#fff" stroke-width="2"/><path d="M-13 -6 Q0 4 13 -6" fill="none" stroke="#fff" stroke-width="3"/>' },
  { key: 'boek', label: 'Voorlezen', hint: 'Sleep het boek over een dochter om haar voor te lezen.',
    glyph: '<rect x="-20" y="-14" width="40" height="28" rx="4" fill="#7c3aed"/><rect x="-16" y="-11" width="15" height="22" fill="#fff"/><rect x="1" y="-11" width="15" height="22" fill="#fff"/>' },
  { key: 'bed', label: 'Naar bed', hint: 'Tik op een dochter met drie volle hartjes om haar naar bed te brengen.',
    glyph: '<path d="M6 -16 A16 16 0 1 0 6 16 A12 12 0 1 1 6 -16 Z" fill="#ffd43b" stroke="#c9a400" stroke-width="1.5"/>' },
];

let api = null; // { getFamily(), setFamily(family), getMeal(), eatMeal() }
let tool = TOOLS[0];
let pointer = null; // plek van muis of vinger in het vak van de tekening
let reading = MEMBERS.map(() => 0); // hoe ver je bent met voorlezen, per gezinslid

const family = () => api.getFamily();
const say = (text) => { hintEl.textContent = text; };
const draw = () => { stageEl.innerHTML = familySvg(family(), api.getMeal(), cursorSvg(tool.glyph, pointer, 0)); };

function renderPanel() {
  const part = progress(family());
  navEl.replaceChildren(...TOOLS.map((t) => button('cat', t.label, t === tool, () => {
    tool = t;
    say(t.hint);
    render();
  })));
  labelEl.textContent = part === 1 ? 'Iedereen is blij!' : `${Math.round(part * 100)}%`;
  meterEl.style.width = `${part * 100}%`;
}

function render() {
  renderPanel();
  draw();
}

function change(next) {
  api.setFamily(next);
  renderPanel();
}

function tap(p) {
  const i = memberAt(p);
  if (i < 0) return;
  const result = act(family(), tool.key, i, Boolean(api.getMeal()));
  if (result.text) say(result.text);
  if (!result.family) return;
  change(result.family);
  // als iedereen gegeten heeft, is het eten op
  if (tool.key === 'eten' && allFed(result.family)) api.eatMeal();
}

// voorlezen: het boek over een dochter slepen
function read(p) {
  const i = memberAt(p);
  if (i < 1 || family().read[i - 1] || family().bed[i - 1]) return;
  reading[i] += 1;
  if (reading[i] < READ_STEPS) {
    say(`Je leest ${MEMBERS[i].name} voor... ${Math.round((reading[i] / READ_STEPS) * 100)}%`);
    return;
  }
  change(readTo(family(), i));
  say(`${MEMBERS[i].name} vond het een mooi verhaal!`);
}

export function initFamily(familyApi) {
  api = familyApi;
  trackPointer(stageEl, {
    down: (p) => {
      pointer = p;
      if (tool.key === 'boek') read(p);
      else tap(p);
      draw();
    },
    move: (p, pressed) => {
      pointer = p;
      if (p && pressed && tool.key === 'boek') read(p);
      draw();
    },
    up: () => {},
  });
  document.getElementById('gezin-reset').addEventListener('click', () => {
    api.setFamily({ ...freshFamily(), day: today() });
    reading = MEMBERS.map(() => 0);
    say('Opnieuw! Iedereen heeft weer honger en zin om te spelen.');
    render();
  });
}

// bij het binnenkomen: op een nieuwe dag begint iedereen weer met lege hartjes
export function showFamily() {
  api.setFamily(newDay(family(), today()));
  tool = TOOLS[0];
  pointer = null;
  reading = MEMBERS.map(() => 0);
  if (progress(family()) === 1) say('Iedereen is blij en de meisjes slapen. Morgen willen ze weer spelen!');
  else say(api.getMeal() || allFed(family()) ? tool.hint : 'Er is nog geen eten. Kook iets in de keuken, of speel eerst met de meisjes.');
  render();
}
