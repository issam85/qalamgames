// De kapper: kies gereedschap en gebruik het op het haar. Borstel en kam sleep je
// over de knopen; puntkam, schaar, hoed en hoofddoek werken met een tik; de föhn
// sleep je tot het haar glanst. Alles wordt bewaard.
import { STYLES, HAIR_COLORS, SPOTS, VIEW, bustSvg, knotsLeft, freshHair, newDay } from './hair.js';
import { TOOLS, toolSvg } from './salon-tools.js';
import { onHair, untangle, tapHair } from './salon-actions.js';
import { button, swatch, today } from './ui.js';

const toolsEl = document.getElementById('kapper-tools');
const stageEl = document.getElementById('kapper-doll');
const stylesEl = document.getElementById('kapper-styles');
const colorsEl = document.getElementById('kapper-colors');
const meterEl = document.getElementById('kapper-meter');
const labelEl = document.getElementById('kapper-label');
const hintEl = document.getElementById('kapper-hint');
const DRY_STEPS = 40; // zo lang föhnen tot het glanst

let api = null; // { getOutfit(), getHair(), setHair(hair) }
let tool = TOOLS[0];
let pointer = null; // plek van muis of vinger in het vak van de tekening
let down = false;
let dry = 0;
const inside = new Set(); // knopen waar het gereedschap nu overheen gaat

const hair = () => api.getHair();
const setHair = (patch) => api.setHair({ ...hair(), ...patch });
const say = (text) => { hintEl.textContent = text; };
const draw = () => { stageEl.innerHTML = bustSvg(api.getOutfit(), hair(), toolSvg(tool.key, pointer)); };

function renderPanel() {
  const h = hair();
  const left = knotsLeft(h);
  toolsEl.replaceChildren(...TOOLS.map((t) => button('cat', t.label, t === tool, () => {
    tool = t;
    say(t.hint);
    renderPanel();
  })));
  stylesEl.replaceChildren(...STYLES.map(([label, text], i) => button('item', label, h.style === i && !h.hijab, () => {
    setHair({ style: i, hijab: false });
    say(text);
    render();
  })));
  colorsEl.replaceChildren(...HAIR_COLORS.map(([hex, name]) => swatch(hex, name, h.color === hex, () => {
    setHair({ color: hex });
    render();
  })));
  labelEl.textContent = left === 0 ? 'Helemaal glad!' : `${left} ${left === 1 ? 'knoop' : 'knopen'}`;
  meterEl.style.width = `${100 - (left / SPOTS.length) * 100}%`;
}

function render() {
  renderPanel();
  draw();
}

function toView(e) {
  const box = stageEl.querySelector('svg').getBoundingClientRect();
  return {
    x: VIEW.x + ((e.clientX - box.left) / box.width) * VIEW.w,
    y: VIEW.y + ((e.clientY - box.top) / box.height) * VIEW.h,
  };
}

function brush(p) {
  const knots = untangle(hair().knots, p, tool.power, inside);
  if (!knots) return;
  setHair({ knots });
  if (knotsLeft(hair()) === 0) say('Helemaal glad! Kies nu een kapsel.');
  renderPanel();
}

function tap(p) {
  if (!onHair(p)) return;
  const { patch, text } = tapHair(tool.key, hair());
  if (patch) setHair(patch);
  if (text) say(text);
  if (patch) renderPanel();
}

function drag(p) {
  if (hair().hijab) return;
  if (tool.power) brush(p);
  else if (tool.key === 'fohn' && onHair(p) && !hair().shine) {
    dry += 1;
    if (dry < DRY_STEPS) return;
    setHair({ shine: true });
    say('Wat glanst je haar mooi!');
  }
}

function onDown(e) {
  e.preventDefault();
  down = true;
  pointer = toView(e);
  tap(pointer);
  drag(pointer);
  draw();
}

function onMove(e) {
  pointer = toView(e);
  if (down) drag(pointer);
  draw();
}

function onUp() {
  down = false;
  inside.clear();
}

export function initSalon(salonApi) {
  api = salonApi;
  stageEl.addEventListener('pointerdown', onDown);
  stageEl.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  stageEl.addEventListener('pointerleave', () => {
    pointer = null;
    draw();
  });
  document.getElementById('kapper-reset').addEventListener('click', () => {
    api.setHair({ ...freshHair(), color: hair().color, day: today() });
    dry = 0;
    say('Opnieuw! Je haar zit weer in de knoop.');
    render();
  });
}

// bij het binnenkomen: op een nieuwe dag zit je haar weer in de knoop
export function showSalon() {
  api.setHair(newDay(hair(), today()));
  tool = TOOLS[0];
  dry = 0;
  pointer = null;
  say(knotsLeft(hair()) ? tool.hint : 'Je haar is al glad. Kies een kapsel!');
  render();
}
