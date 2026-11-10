// De stranddouche: na het strand zit er zand op de prinses. Eerst de spons (schuim),
// dan de douche (spoelen), dan de handdoek (afdrogen), steeds door te slepen.
import { TOOLS, showerSvg } from './shower-scene.js';
import { sandy, washed, progress, wash, stepDone } from './shower.js';
import { trackPointer } from './pointer.js';
import { button } from './ui.js';

const toolsEl = document.getElementById('douche-tools');
const stageEl = document.getElementById('douche-stage');
const meterEl = document.getElementById('douche-meter');
const labelEl = document.getElementById('douche-label');
const hintEl = document.getElementById('douche-hint');
const NEXT = {
  spons: 'Helemaal onder het schuim! Pak nu de douche.',
  douche: 'Het zand is weg. Pak nu de handdoek.',
  handdoek: 'Lekker schoon! Ga je aankleden in het kleedhokje.',
};

let api = null; // { game }
let tool = TOOLS[0];
let spots = sandy();
let pointer = null;

const say = (text) => { hintEl.textContent = text; };
const draw = () => { stageEl.innerHTML = showerSvg(api.game.princess, spots, tool, pointer); };

function renderPanel() {
  const part = progress(spots);
  toolsEl.replaceChildren(...TOOLS.map((t) => button('cat', t.label, t === tool, () => {
    tool = t;
    say(t.hint);
    render();
  })));
  labelEl.textContent = washed(spots) ? 'Helemaal schoon!' : `${Math.round(part * 100)}%`;
  meterEl.style.width = `${part * 100}%`;
}

function render() {
  renderPanel();
  draw();
}

function drag(p) {
  const next = wash(spots, p, tool.key);
  if (!next) return;
  spots = next;
  if (stepDone(spots, tool.key)) {
    say(NEXT[tool.key]);
    tool = TOOLS[TOOLS.indexOf(tool) + 1] || tool;
  }
  renderPanel();
}

function reset() {
  spots = sandy();
  tool = TOOLS[0];
  pointer = null;
  say(tool.hint);
  render();
}

export function initShower(showerApi) {
  api = showerApi;
  trackPointer(stageEl, {
    down: (p) => {
      pointer = p;
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
  document.getElementById('douche-reset').addEventListener('click', reset);
}

// elke keer dat je gaat douchen, zit er weer zand op
export const showShower = reset;
