// De kapper: kies gereedschap en gebruik het op het haar. Borstel en kam sleep je
// over de knopen, de schaar sleep je door een lok, de föhn sleep je tot het haar
// glanst; puntkam, hoed en hoofddoek werken met een tik. Alles wordt bewaard.
import { bustSvg, shineSvg, knotsLeft, freshHair, newDay } from './hair.js';
import { clippingsSvg } from './hair-styles.js';
import { TOOLS, toolSvg } from './salon-tools.js';
import { DRY_STEPS, TAP_DRY, onHair, untangle, cut, tapHair } from './salon-actions.js';
import { renderSalonPanel } from './salon-panel.js';
import { trackPointer } from './pointer.js';
import { today } from './ui.js';

const stageEl = document.getElementById('kapper-stage');
const hintEl = document.getElementById('kapper-hint');

let api = null; // { getOutfit(), getMakeup(), getHair(), setHair(hair) }
let tool = TOOLS[0];
let pointer = null; // plek van muis of vinger in het vak van de tekening
let dry = 0;
const inside = new Set(); // knopen waar het gereedschap nu overheen gaat
let falling = []; // afgeknipte stukjes die nog vallen

const hair = () => api.getHair();
const setHair = (patch) => api.setHair({ ...hair(), ...patch });
const say = (text) => { hintEl.textContent = text; };

function draw() {
  const h = hair();
  const extra = (dry && !h.shine ? shineSvg(dry / DRY_STEPS) : '')
    + clippingsSvg(falling, h.color, performance.now()) + toolSvg(tool.key, pointer);
  stageEl.innerHTML = bustSvg(api.getOutfit(), h, api.getMakeup(), extra);
}

// laat de afgeknipte stukjes vallen tot ze weg zijn
function fall() {
  const now = performance.now();
  falling = falling.filter((piece) => now - piece.t < 700);
  draw();
  if (falling.length) requestAnimationFrame(fall);
}

// wat de knoppen in het paneel doen
const PANEL = {
  tool: (t) => {
    tool = t;
    say(t.hint);
    renderPanel();
  },
  style: (i, text) => {
    setHair({ style: i, hijab: false });
    say(text);
    render();
  },
  color: (hex) => {
    setHair({ color: hex });
    render();
  },
};
const renderPanel = () => renderSalonPanel(hair(), tool, PANEL);

function render() {
  renderPanel();
  draw();
}

function brush(p) {
  const knots = untangle(hair().knots, p, tool.power, inside);
  if (!knots) return;
  setHair({ knots });
  const left = knotsLeft(hair());
  say(left === 0 ? 'Helemaal glad! Kies nu een kapsel.' : `Goed zo! Nog ${left} ${left === 1 ? 'knoop' : 'knopen'}.`);
  renderPanel();
}

// knippen kan alleen in los haar: de schaar knipt elke lok af waar hij doorheen gaat
function snip(from, to) {
  if (hair().style !== 0) {
    if (!onHair(to)) return;
    setHair({ style: 0 });
    say('Je haar gaat los, dan kun je knippen.');
    renderPanel();
    return;
  }
  const result = cut(hair().ends, from, to);
  if (!result) return;
  setHair({ ends: result.ends });
  say('Knip, knip! Morgen is het weer een stukje gegroeid.');
  const now = performance.now();
  if (!falling.length) requestAnimationFrame(fall);
  falling.push(...result.pieces.map((piece) => ({ ...piece, t: now })));
}

function tap(p) {
  if (!onHair(p)) return;
  const { patch, text } = tapHair(tool.key, hair());
  if (patch) setHair(patch);
  if (text) say(text);
  if (patch) renderPanel();
}

// from = waar de muis of vinger net nog was
function drag(p, from) {
  if (hair().hijab) return;
  if (tool.power) brush(p);
  else if (tool.key === 'schaar') snip(from, p);
  else if (tool.key === 'fohn' && onHair(p) && !hair().shine) {
    dry += from === p ? TAP_DRY : 1;
    if (dry < DRY_STEPS) {
      say(`Föhnen... ${Math.round((dry / DRY_STEPS) * 100)}%`);
      return;
    }
    setHair({ shine: true });
    say('Wat glanst je haar mooi!');
  }
}

function onDown(p) {
  pointer = p;
  tap(p);
  drag(p, p);
  draw();
}

function onMove(p, pressed) {
  const from = pointer || p;
  pointer = p;
  if (p && pressed) drag(p, from);
  draw();
}

export function initSalon(salonApi) {
  api = salonApi;
  trackPointer(stageEl, { down: onDown, move: onMove, up: () => inside.clear() });
  document.getElementById('kapper-reset').addEventListener('click', () => {
    api.setHair({ ...freshHair(), color: hair().color, day: today() });
    dry = 0;
    say('Opnieuw! Je haar is weer lang en zit in de knoop.');
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
