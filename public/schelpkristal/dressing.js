// Het kleedhokje: soort kiezen (jurk, kroon, ketting, schoenen), dan wat en welke
// kleur. Elke keuze is meteen te zien op de prinses en wordt bewaard. Wat nog op slot
// zit, speel je vrij met schelpen en kristallen van het strand.
import { CATS, SWATCHES, MATCH, randomOutfit, hasItem } from './data.js';
import { princessSvg } from './princess.js';
import { button, swatch } from './ui.js';

const catsEl = document.getElementById('kleed-cats');
const itemsEl = document.getElementById('kleed-items');
const swatchesEl = document.getElementById('kleed-swatches');
const titleEl = document.getElementById('kleed-title');
const dollEl = document.getElementById('kleed-doll');
const noteEl = document.getElementById('kleed-note');

let cat = CATS[0].key;
let api = null; // { game, save(), counters() }
const say = (text) => { noteEl.textContent = text; };
const priceText = ([shells, crystals]) => [
  shells && `${shells} ${shells === 1 ? 'schelp' : 'schelpen'}`,
  crystals && `${crystals} ${crystals === 1 ? 'kristal' : 'kristallen'}`,
].filter(Boolean).join(' + ');

// op een soort tikken die nog op slot zit: vrijspelen als je genoeg hebt
function unlock(i) {
  const { game } = api;
  const current = CATS.find((c) => c.key === cat);
  const [shells, crystals] = current.prices[i];
  const label = current.items[i];
  if (game.shells < shells || game.crystals < crystals) {
    const need = [Math.max(0, shells - game.shells), Math.max(0, crystals - game.crystals)];
    say(`Voor ${label} heb je nog ${priceText(need)} nodig. Zoek ze op het strand!`);
    return;
  }
  game.shells -= shells;
  game.crystals -= crystals;
  game.owned = [...game.owned, `${cat}:${i}`];
  api.counters();
  say(`Joepie! ${label} is nu van jou.`);
  change({ choice: { [cat]: i } });
}

function itemButton(label, i) {
  const { game } = api;
  if (hasItem(game.owned, cat, i)) return button('item', label, game.outfit.choice[cat] === i, () => change({ choice: { [cat]: i } }));
  const price = CATS.find((c) => c.key === cat).prices[i];
  const btn = button('item locked', label, false, () => unlock(i));
  const small = document.createElement('small');
  small.innerHTML = [price[0] && `<span class="ico shell"></span>${price[0]}`, price[1] && `<span class="ico crystal"></span>${price[1]}`].filter(Boolean).join(' ');
  small.setAttribute('aria-label', priceText(price));
  btn.append(small);
  return btn;
}

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
    say('');
    render();
  })));
  itemsEl.replaceChildren(...current.items.map(itemButton));
  const colors = SWATCHES.map(([hex, name]) => swatch(hex, name, outfit.color[cat] === hex, () => change({ color: { [cat]: hex } })));
  if (cat === 'ketting') colors.unshift(swatch(null, 'Past bij je jurk', outfit.color.ketting === MATCH, () => change({ color: { ketting: MATCH } })));
  swatchesEl.replaceChildren(...colors);
  dollEl.innerHTML = princessSvg(princess, outfit);
}

export function initDressing(dressingApi) {
  api = dressingApi;
  document.getElementById('kleed-surprise').addEventListener('click', () => {
    api.game.outfit = randomOutfit(api.game.owned);
    api.save();
    render();
  });
}

export function showDressing() {
  say('');
  render();
}
