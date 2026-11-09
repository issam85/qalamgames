// De keuken: kies een recept, doe de ingrediënten in de goede volgorde in de kom
// (tikken), roer rondjes met de lepel (slepen) en haal het op tijd van het vuur
// (tikken als de pijl in het groen staat).
import { RECIPES, INGREDIENTS } from './recipes.js';
import { BAKE_MS, freshCook, recipeOf, phase, progress, add, stir, judge } from './cook.js';
import { kitchenSvg } from './cook-scene.js';
import { trackPointer } from './pointer.js';
import { roomScreen } from './screen.js';
import { button, cursorSvg } from './ui.js';

roomScreen({ room: 'keuken', title: 'Keuken', nav: 'Recept', stage: 'cook-stage', extra: '<div id="keuken-items" class="items"></div>' });
const screenEl = document.getElementById('screen-keuken');
const recipesEl = document.getElementById('keuken-nav');
const stageEl = document.getElementById('keuken-stage');
const titleEl = document.getElementById('keuken-title');
const meterEl = document.getElementById('keuken-meter');
const labelEl = document.getElementById('keuken-label');
const hintEl = document.getElementById('keuken-hint');
const itemsEl = document.getElementById('keuken-items');
const SPOON = '<rect x="-4" y="-4" width="8" height="52" rx="4" fill="#b5793a"/><ellipse cx="0" cy="-14" rx="12" ry="16" fill="#d9a066" stroke="#b5793a" stroke-width="2"/>';
const HINTS = {
  kom: 'Lees het recept en doe alles in de goede volgorde in de kom.',
  roeren: 'Alles zit erin! Roer nu rondjes in de kom met de lepel.',
  klaar: 'Het eten is klaar! Tik op Klaar! en breng het naar je gezin.',
};

let cook = freshCook(RECIPES[0].key);
let pointer = null; // plek van muis of vinger in het vak van de tekening
let fireStart = 0; // wanneer deze beurt op het vuur begon
let burning = false; // loopt de klok van het vuur?

const say = (text) => { hintEl.textContent = text; };
const heat = () => (phase(cook) === 'vuur' ? Math.min(1, (performance.now() - fireStart) / BAKE_MS) : 0);

function draw() {
  const spoon = phase(cook) === 'roeren' ? cursorSvg(SPOON, pointer, 20) : '';
  stageEl.innerHTML = kitchenSvg(cook, heat(), spoon);
}

// de klok van het vuur: de pijl loopt, en wie te lang wacht begint opnieuw
function burn() {
  burning = phase(cook) === 'vuur' && screenEl.classList.contains('active');
  if (!burning) return;
  if (heat() >= 1) {
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
  const verdict = judge(heat());
  if (verdict === 'good') cook = { ...cook, round: cook.round + 1 };
  fireStart = performance.now();
  if (phase(cook) === 'klaar') say(HINTS.klaar);
  else say(verdict === 'good' ? `${recipe.good} Nu de volgende.` : `${recipe[verdict]} Probeer het nog eens.`);
  render();
}

function pick(key) {
  const next = add(cook, key);
  if (!next) {
    say(recipeOf(cook).need.includes(key) ? 'Dat is nog niet aan de beurt. Kijk op het recept.' : 'Dat hoort niet in dit recept.');
    return;
  }
  cook = next;
  say(phase(cook) === 'roeren' ? HINTS.roeren : 'Goed zo! Wat komt er nu?');
  render();
}

function choose(recipe) {
  cook = freshCook(recipe.key);
  say(HINTS.kom);
  render();
}

function renderPanel() {
  const recipe = recipeOf(cook);
  const step = phase(cook);
  const part = progress(cook);
  recipesEl.replaceChildren(...RECIPES.map((r) => button('cat', r.label, r === recipe, () => choose(r))));
  titleEl.textContent = recipe.label;
  labelEl.textContent = step === 'klaar' ? 'Klaar!' : `${Math.round(part * 100)}%`;
  meterEl.style.width = `${part * 100}%`;
  if (step === 'kom') {
    itemsEl.replaceChildren(...recipe.shelf.map((key) => button('item', INGREDIENTS[key][0], cook.added.includes(key), () => pick(key))));
  } else itemsEl.replaceChildren(...(step === 'vuur' ? [button('btn gold', recipe.action, false, flip)] : []));
}

function render() {
  renderPanel();
  draw();
}

function onMove(p, pressed) {
  const from = pointer || p;
  pointer = p;
  if (p && pressed && phase(cook) === 'roeren') {
    cook = stir(cook, from, p);
    if (phase(cook) === 'vuur') {
      light();
      renderPanel();
    } else meterEl.style.width = `${progress(cook) * 100}%`;
  }
  draw();
}

export function initKitchen() {
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
  if (phase(cook) === 'klaar') cook = freshCook(cook.recipe);
  if (phase(cook) === 'vuur') light();
  else say(HINTS[phase(cook)]);
  render();
}
