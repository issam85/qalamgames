// Het kleedhokje: soort kiezen (jurk, kroon, ketting, schoenen), dan wat en welke
// kleur. Elke keuze is meteen te zien op de prinses en wordt bewaard.
import { CATS, SWATCHES, MATCH, randomOutfit } from './data.js';
import { princessSvg } from './princess.js';
import { button, swatch } from './ui.js';

const catsEl = document.getElementById('kleed-cats');
const itemsEl = document.getElementById('kleed-items');
const swatchesEl = document.getElementById('kleed-swatches');
const titleEl = document.getElementById('kleed-title');
const dollEl = document.getElementById('kleed-doll');

let cat = CATS[0].key;
let api = null; // { game, save() }

function change(patch) {
  const { outfit } = api.game;
  api.game.outfit = {
    choice: { ...outfit.choice, ...(patch.choice || {}) },
    color: { ...outfit.color, ...(patch.color || {}) },
  };
  api.save();
  render();
}

function render() {
  const { outfit, princess } = api.game;
  const current = CATS.find((c) => c.key === cat);
  titleEl.textContent = current.label;
  catsEl.replaceChildren(...CATS.map((c) => button('cat', c.label, c.key === cat, () => {
    cat = c.key;
    render();
  })));
  itemsEl.replaceChildren(...current.items.map((label, i) => button(
    'item', label, outfit.choice[cat] === i, () => change({ choice: { [cat]: i } }),
  )));
  const colors = SWATCHES.map(([hex, name]) => swatch(hex, name, outfit.color[cat] === hex, () => change({ color: { [cat]: hex } })));
  if (cat === 'ketting') colors.unshift(swatch(null, 'Past bij je jurk', outfit.color.ketting === MATCH, () => change({ color: { ketting: MATCH } })));
  swatchesEl.replaceChildren(...colors);
  dollEl.innerHTML = princessSvg(princess, outfit);
}

export function initDressing(dressingApi) {
  api = dressingApi;
  document.getElementById('kleed-surprise').addEventListener('click', () => {
    api.game.outfit = randomOutfit();
    api.save();
    render();
  });
}

export const showDressing = () => render();
