// De stranddouche: na het strand zit er zand op de prinses. Eerst de spons (schuim),
// dan de douche (spoelen), dan de handdoek (afdrogen), steeds door te slepen. Sleep je
// met het verkeerde ding over een plek, dan licht de knop op van wat daar nodig is; is
// alles schoon, dan klopt de knop naar het kleedhokje.
import { TOOLS, showerSvg } from './shower-scene.js';
import { sandy, washed, progress, wash, stepDone, neededAt } from './shower.js';
import { trackPointer } from './pointer.js';
import { button, withPicture } from './ui.js';

const toolsEl = document.getElementById('douche-tools');
const stageEl = document.getElementById('douche-stage');
const meterEl = document.getElementById('douche-meter');
const labelEl = document.getElementById('douche-label');
const hintEl = document.getElementById('douche-hint');
const doneEl = document.getElementById('douche-done');
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
const draw = () => { stageEl.innerHTML = showerSvg(api.game.princess, api.game.outfit, spots, tool, pointer); };
const glyph = (t) => `<svg viewBox="-30 -50 60 100" aria-hidden="true">${t.glyph}</svg>`;

function renderPanel() {
  const part = progress(spots);
  toolsEl.replaceChildren(...TOOLS.map((t) => {
    const btn = withPicture(button('cat tool', t.label, t === tool, () => {
      tool = t;
      say(t.hint);
      render();
    }), glyph(t), t.label);
    btn.dataset.tool = t.key;
    return btn;
  }));
  labelEl.textContent = washed(spots) ? 'Helemaal schoon!' : `${Math.round(part * 100)}%`;
  meterEl.style.width = `${part * 100}%`;
  doneEl.classList.toggle('pulse', washed(spots));
}

function render() {
  renderPanel();
  draw();
}

// de knop van wat hier nodig is even laten oplichten
function nudge(key) {
  const btn = toolsEl.querySelector(`[data-tool="${key}"]`);
  if (!btn || btn.classList.contains('nudge')) return;
  btn.classList.add('nudge');
  setTimeout(() => btn.classList.remove('nudge'), 600);
}

function drag(p) {
  const next = wash(spots, p, tool.key);
  if (!next) {
    const need = neededAt(spots, p);
    if (need && need !== tool.key) nudge(need);
    return;
  }
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
