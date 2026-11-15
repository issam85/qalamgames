// De kledingkast: categorie kiezen, soort kiezen, kleur kiezen. Elke keuze is meteen
// te zien op het meisje en wordt bewaard. Sieraden kun je combineren: een tik zet
// er een aan of af, "Geen" doet alles af.
import { CATS, SWATCHES, randomOutfit, hasItem, toggleJewel } from './data.js';
import { renderDoll } from './doll.js';
import { itemThumb, catThumb } from './thumbs.js';
import { button, swatch } from './ui.js';

const catsEl = document.getElementById('kast-cats');
const itemsEl = document.getElementById('kast-items');
const swatchesEl = document.getElementById('kast-swatches');
const titleEl = document.getElementById('kast-title');
const dollEl = document.getElementById('kast-doll');

let cat = CATS[0].key;
let api = null; // { getOutfit(), setOutfit(outfit), getMakeup(), getOwned() }

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
  }, catThumb(c.key, outfit.color[c.key]))));
  const jewels = cat === 'sieraden';
  const worn = (i) => (jewels ? (i === 0 ? !outfit.choice.sieraden.length : outfit.choice.sieraden.includes(i)) : outfit.choice[cat] === i);
  const pick = (i) => change({ choice: { [cat]: jewels ? toggleJewel(outfit.choice.sieraden, i) : i } });
  // alleen wat je hebt: gratis, of gekocht in de winkel
  itemsEl.replaceChildren(...current.items.map((label, i) => (hasItem(api.getOwned(), cat, i)
    ? button('item', label, worn(i), () => pick(i), itemThumb(cat, i, outfit.color[cat])) : null)).filter(Boolean));
  swatchesEl.replaceChildren(...SWATCHES.map(([hex, name]) => swatch(
    hex, name, outfit.color[cat] === hex, () => change({ color: { [cat]: hex } }),
  )));
  renderDoll(dollEl, outfit, api.getMakeup());
}

export function initWardrobe(wardrobeApi) {
  api = wardrobeApi;
  document.getElementById('kast-surprise').addEventListener('click', () => {
    api.setOutfit(randomOutfit(api.getOwned()));
    render();
  });
}

// bij het openen van de kast
export function showWardrobe() {
  render();
}
