// De badkamer: onder de douche was je je met spons, douche en handdoek (slepen); voor
// de spiegel poets je je tanden (slepen) en doe je make-up op (kleur kiezen, tikken).
import { TOOLS, toolSvg } from './bath-tools.js';
import { MAKEUP, freshMakeup } from './makeup.js';
import { BRUSH_STEPS, freshBath, newDay, washed, progress, wash, stepDone, onFace, onMouth } from './bath.js';
import { showerSvg, mirrorSvg } from './bath-scene.js';
import { trackPointer } from './pointer.js';
import { roomScreen } from './screen.js';
import { button, swatch, today } from './ui.js';

roomScreen({
  room: 'bad', title: 'Badkamer', nav: 'Spullen in de badkamer', stage: 'salon-stage', heading: 'Schoon',
  extra: '<ul id="bad-list" class="todo"></ul><div id="bad-colors" class="swatches" aria-label="Kleur van de make-up"></div>',
});
const toolsEl = document.getElementById('bad-nav');
const stageEl = document.getElementById('bad-stage');
const meterEl = document.getElementById('bad-meter');
const labelEl = document.getElementById('bad-label');
const hintEl = document.getElementById('bad-hint');
const listEl = document.getElementById('bad-list');
const colorsEl = document.getElementById('bad-colors');
// na elke stap onder de douche: wat je daarna pakt
const NEXT = {
  spons: 'Helemaal onder het schuim! Pak nu de douche.',
  douche: 'Het schuim is weg. Pak nu de handdoek.',
  handdoek: 'Lekker schoon! Poets nu je tanden bij de spiegel.',
};

let api = null; // { getHair(), getBath(), setBath(bath), getMakeup(), setMakeup(makeup) }
let tool = TOOLS[0];
let pointer = null; // plek van muis of vinger in het vak van de tekening
let brushed = 0;
// de gekozen kleur per soort make-up
const pick = Object.fromEntries(Object.entries(MAKEUP).map(([kind, colors]) => [kind, colors[0][0]]));

const bath = () => api.getBath();
const setBath = (patch) => api.setBath({ ...bath(), ...patch });
const setMakeup = (patch) => api.setMakeup({ ...api.getMakeup(), ...patch });
const say = (text) => { hintEl.textContent = text; };

function draw() {
  const cursor = toolSvg(tool, pointer, pick[tool.key]);
  stageEl.innerHTML = tool.scene === 'douche'
    ? showerSvg(api.getHair(), bath(), api.getMakeup(), cursor)
    : mirrorSvg(api.getMakeup(), { open: tool.key === 'tanden', clean: bath().teeth, foam: brushed > 0 && !bath().teeth }, cursor);
}

function check(label, ok) {
  const li = document.createElement('li');
  li.textContent = label;
  li.classList.toggle('is-done', ok);
  return li;
}

function renderPanel() {
  const b = bath();
  const part = progress(b);
  toolsEl.replaceChildren(...TOOLS.map((t) => button('cat', t.label, t === tool, () => {
    tool = t;
    say(t.hint);
    render();
  })));
  labelEl.textContent = part === 1 ? 'Helemaal schoon!' : `${Math.round(part * 100)}%`;
  meterEl.style.width = `${part * 100}%`;
  listEl.replaceChildren(check('Douchen', washed(b)), check('Tanden poetsen', b.teeth));
  colorsEl.replaceChildren(...(MAKEUP[tool.key] || []).map(([hex, name]) => swatch(hex, name, pick[tool.key] === hex, () => {
    pick[tool.key] = hex;
    setMakeup({ [tool.key]: hex });
    render();
  })));
}

function render() {
  renderPanel();
  draw();
}

function tap(p) {
  if (!onFace(p)) return;
  if (MAKEUP[tool.key]) setMakeup({ [tool.key]: pick[tool.key] });
  else if (tool.key === 'watje') {
    api.setMakeup(freshMakeup());
    say('Je make-up is eraf.');
  }
}

function drag(p) {
  if (tool.scene === 'douche') {
    const spots = wash(bath().spots, p, tool.key);
    if (!spots) return;
    setBath({ spots });
    if (stepDone(spots, tool.key)) say(NEXT[tool.key]);
    renderPanel();
  } else if (tool.key === 'tanden' && onMouth(p) && !bath().teeth) {
    brushed += 1;
    if (brushed < BRUSH_STEPS) return;
    setBath({ teeth: true });
    say('Je tanden blinken!');
    renderPanel();
  }
}

export function initBathroom(bathApi) {
  api = bathApi;
  trackPointer(stageEl, {
    down: (p) => {
      pointer = p;
      tap(p);
      drag(p);
      draw();
    },
    move: (p, pressed) => {
      pointer = p;
      if (p && pressed) drag(p);
      draw();
    },
    up: () => {},
  });
  document.getElementById('bad-reset').addEventListener('click', () => {
    api.setBath({ ...freshBath(), day: today() });
    brushed = 0;
    tool = TOOLS[0];
    say('Opnieuw! Pak de spons.');
    render();
  });
}

// bij het binnenkomen: op een nieuwe dag moet je je weer wassen
export function showBathroom() {
  api.setBath(newDay(bath(), today()));
  tool = TOOLS[0];
  brushed = 0;
  pointer = null;
  say(washed(bath()) ? 'Je bent al gewassen. Poets je tanden of doe make-up op bij de spiegel.' : tool.hint);
  render();
}
