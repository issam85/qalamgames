// De kledingkast: categorie kiezen, soort kiezen, kleur kiezen. Elke keuze is meteen
// te zien op het meisje en wordt bewaard.
import { CATS, SWATCHES, randomOutfit } from './data.js';
import { renderDoll } from './doll.js';
import { button, swatch } from './ui.js';

const catsEl = document.getElementById('kast-cats');
const itemsEl = document.getElementById('kast-items');
const swatchesEl = document.getElementById('kast-swatches');
const titleEl = document.getElementById('kast-title');
const dollEl = document.getElementById('kast-doll');

let cat = CATS[0].key;
let api = null; // { getOutfit(), setOutfit(outfit) }

function change(patch) {
  const outfit = api.getOutfit();
  api.setOutfit({
    choice: { ...outfit.choice, ...(patch.choice || {}) },
    color: { ...outfit.color, ...(patch.color || {}) },
  });
  render();
}

function render() {
  const outfit = api.getOutfit();
  const current = CATS.find((c) => c.key === cat);
  titleEl.textContent = current.label;
  catsEl.replaceChildren(...CATS.map((c) => button('cat', c.label, c.key === cat, () => {
    cat = c.key;
    render();
  })));
  itemsEl.replaceChildren(...current.items.map((label, i) => button(
    'item', label, outfit.choice[cat] === i, () => change({ choice: { [cat]: i } }),
  )));
  swatchesEl.replaceChildren(...SWATCHES.map(([hex, name]) => swatch(
    hex, name, outfit.color[cat] === hex, () => change({ color: { [cat]: hex } }),
  )));
  renderDoll(dollEl, outfit);
}

export function initWardrobe(wardrobeApi) {
  api = wardrobeApi;
  document.getElementById('kast-surprise').addEventListener('click', () => {
    api.setOutfit(randomOutfit());
    render();
  });
}

// bij het openen van de kast
export function showWardrobe() {
  render();
}
