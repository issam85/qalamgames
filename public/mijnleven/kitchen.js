// De keuken: kies een recept, doe de ingrediënten in de goede volgorde in de kom
// (tikken), roer rondjes met de lepel (slepen) en haal het op tijd van het vuur
// (tikken als de pijl in het groen staat). Is het gerecht klaar, dan staat het meteen
// bij het gezin. Het paneel zit in kitchen-panel.js.
import { RECIPES } from './recipes.js';
import { BAKE_MS, WIDER, freshCook, recipeOf, phase, add, stir, judge } from './cook.js';
import { kitchenSvg } from './cook-scene.js';
import { renderKitchenPanel, kitchenMeter } from './kitchen-panel.js';
import { trackPointer, onFrame } from './pointer.js';
import { cursorSvg, pulse } from './ui.js';

const screenEl = document.getElementById('screen-keuken');
const stageEl = document.getElementById('keuken-stage');
const hintEl = document.getElementById('keuken-hint');
const SPOON = '<rect x="-4" y="-4" width="8" height="52" rx="4" fill="#b5793a"/><ellipse cx="0" cy="-14" rx="12" ry="16" fill="#d9a066" stroke="#b5793a" stroke-width="2"/>';
const HINTS = {
  kom: 'Lees het recept en doe alles in de goede volgorde in de kom.',
  roeren: 'Alles zit erin! Roer nu rondjes in de kom met de lepel.',
  klaar: 'Het eten is klaar en staat bij je gezin! Tik op Klaar!',
};
const MISSES = 3; // na zoveel keer mis bij het vuur wordt het groen breder

let api = null; // { setMeal(recept) }
let cook = freshCook(RECIPES[0].key);
let pointer = null; // plek van muis of vinger in het vak van de tekening
let fireStart = 0; // wanneer deze beurt op het vuur begon
let burning = false; // loopt de klok van het vuur?
let misses = 0; // hoe vaak je bij het vuur te vroeg of te laat was

const say = (text) => { hintEl.textContent = text; };
const heat = () => (phase(cook) === 'vuur' ? Math.min(1, (performance.now() - fireStart) / BAKE_MS) : 0);
const wider = () => (misses >= MISSES ? WIDER : 0);

function draw() {
  const spoon = phase(cook) === 'roeren' ? cursorSvg(SPOON, pointer, 20) : '';
  stageEl.innerHTML = kitchenSvg(cook, heat(), spoon, wider());
}
const redraw = onFrame(draw);

// de klok van het vuur: de pijl loopt, en wie te lang wacht begint opnieuw
function burn() {
  burning = phase(cook) === 'vuur' && screenEl.classList.contains('active');
  if (!burning) return;
  if (heat() >= 1) {
    misses += 1;
    say(`${recipeOf(cook).late} Probeer het nog eens.`);
    fireStart = performance.now();
  }
  draw();
  requestAnimationFrame(burn);
}

function light() {
  fireStart = performance.now();
  say(recipeOf(cook).fire);
  if (!burning) burn();
}

// de knop bij het vuur (of een tik op de pan)
function flip() {
  const recipe = recipeOf(cook);
  const verdict = judge(heat(), wider());
  if (verdict === 'good') cook = { ...cook, round: cook.round + 1 };
  else misses += 1;
  fireStart = performance.now();
  if (phase(cook) === 'klaar') {
    api.setMeal(cook.recipe);
    say(HINTS.klaar);
  } else say(verdict === 'good' ? `${recipe.good} Nu de volgende.` : `${recipe[verdict]} Probeer het nog eens.`);
  render();
}

// welke knop je nu nodig hebt: het volgende ingrediënt, of 'vuur' ('' = geen knop)
export function nextKey() {
  if (phase(cook) === 'kom') return recipeOf(cook).need[cook.added.length];
  return phase(cook) === 'vuur' ? 'vuur' : '';
}

function pick(key) {
  const next = add(cook, key);
  if (!next) {
    say(recipeOf(cook).need.includes(key) ? 'Dat is nog niet aan de beurt. Kijk op het recept.' : 'Dat hoort niet in dit recept.');
    pulse(screenEl.querySelector(`#keuken-items [data-key="${nextKey()}"]`));
    return;
  }
  cook = next;
  say(phase(cook) === 'roeren' ? HINTS.roeren : 'Goed zo! Wat komt er nu?');
  render();
}

function choose(recipe) {
  cook = freshCook(recipe.key);
  misses = 0;
  say(HINTS.kom);
  render();
}

function render() {
  renderKitchenPanel(cook, { choose, pick, flip });
  draw();
}

function onMove(p, pressed) {
  const from = pointer || p;
  pointer = p;
  if (p && pressed && phase(cook) === 'roeren') {
    cook = stir(cook, from, p);
    if (phase(cook) === 'vuur') {
      light();
      render();
    } else kitchenMeter(cook);
  }
  redraw();
}

export function initKitchen(kitchenApi) {
  api = kitchenApi;
  trackPointer(stageEl, {
    down: (p) => {
      pointer = p;
      if (phase(cook) === 'vuur') flip();
      else draw();
    },
    move: onMove,
    up: () => {},
  });
  document.getElementById('keuken-reset').addEventListener('click', () => choose(recipeOf(cook)));
}

// het gerecht dat klaar is ('' als je nog bezig bent)
export const cookedMeal = () => (phase(cook) === 'klaar' ? cook.recipe : '');

// bij het binnenkomen: een gerecht dat af was begint opnieuw, de rest gaat verder
export function showKitchen() {
  pointer = null;
  if (phase(cook) === 'klaar') {
    cook = freshCook(cook.recipe);
    misses = 0;
  }
  if (phase(cook) === 'vuur') light();
  else say(HINTS[phase(cook)]);
  render();
}
