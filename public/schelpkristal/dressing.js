// Het kleedhokje: soort kiezen (jurk, kroon, ketting, schoenen), dan wat en welke
// kleur. Elke keuze is meteen te zien op de prinses en wordt bewaard. Wat nog op slot
// zit, speel je vrij met schelpen en kristallen van het strand en parels uit de zee.
// Bij Zwemkleding zie je de prinses in haar burkini en gaat de groene knop naar de zee.
import { CATS, SWATCHES, MATCH, randomOutfit, hasItem } from './data.js';
import { princessSvg, swimSvg } from './princess.js';
import { button, swatch } from './ui.js';

const catsEl = document.getElementById('kleed-cats');
const itemsEl = document.getElementById('kleed-items');
const swatchesEl = document.getElementById('kleed-swatches');
const titleEl = document.getElementById('kleed-title');
const dollEl = document.getElementById('kleed-doll');
const noteEl = document.getElementById('kleed-note');
const doneEl = document.getElementById('kleed-done');
const COST = [['shells', 'shell', 'schelp', 'schelpen'], ['crystals', 'crystal', 'kristal', 'kristallen'], ['pearls', 'pearl', 'parel', 'parels']];

let cat = CATS[0].key;
let api = null; // { game, save(), counters() }
const say = (text) => { noteEl.textContent = text; };
// price = [schelpen, kristallen, parels]
const priceText = (price) => COST.map(([, , one, many], k) => price[k] && `${price[k]} ${price[k] === 1 ? one : many}`).filter(Boolean).join(' + ');
const priceIcons = (price) => COST.map(([, ico], k) => price[k] && `<span class="ico ${ico}"></span>${price[k]}`).filter(Boolean).join(' ');

// op een soort tikken die nog op slot zit: vrijspelen als je genoeg hebt
function unlock(i) {
  const { game } = api;
  const current = CATS.find((c) => c.key === cat);
  const price = current.prices[i];
  const label = current.items[i];
  const need = COST.map(([key], k) => Math.max(0, (price[k] || 0) - game[key]));
  if (need.some(Boolean)) {
    say(`Voor ${label} heb je nog ${priceText(need)} nodig. ${need[2] ? 'Parels vind je in de zee!' : 'Zoek ze op het strand!'}`);
    return;
  }
  COST.forEach(([key], k) => { game[key] -= price[k] || 0; });
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
  small.innerHTML = priceIcons(price);
  small.setAttribute('aria-label', priceText(price));
  btn.append(small);
  return btn;
}

function change(patch) {
  const { outfit } = api.game;
  api.game.outfit = {
    choice: { ...outfit.choice, ...(patch.choice || {}) },
    color: { ...outfit.color, ...(patch.color || {}) },
    hood: patch.hood ?? outfit.hood,
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
  const items = current.items.map(itemButton);
  if (cat === 'zwem') items.push(button('item', outfit.hood ? 'Capuchon: aan' : 'Capuchon: uit', outfit.hood, () => change({ hood: !outfit.hood })));
  itemsEl.replaceChildren(...items);
  const colors = SWATCHES.map(([hex, name]) => swatch(hex, name, outfit.color[cat] === hex, () => change({ color: { [cat]: hex } })));
  if (cat === 'ketting') colors.unshift(swatch(null, 'Past bij je jurk', outfit.color.ketting === MATCH, () => change({ color: { ketting: MATCH } })));
  swatchesEl.replaceChildren(...colors);
  dollEl.innerHTML = cat === 'zwem' ? swimSvg(princess, outfit) : princessSvg(princess, outfit);
  doneEl.textContent = cat === 'zwem' ? 'Naar de zee!' : 'Klaar!';
  doneEl.dataset.go = cat === 'zwem' ? 'screen-zee' : 'screen-start';
}

export function initDressing(dressingApi) {
  api = dressingApi;
  document.getElementById('kleed-surprise').addEventListener('click', () => {
    api.game.outfit = randomOutfit(api.game.owned, api.game.outfit.hood);
    api.save();
    render();
  });
}

// swim = meteen bij Zwemkleding beginnen (vanaf de knop Zwemmen)
export function showDressing(swim = false) {
  if (swim) cat = 'zwem';
  else if (cat === 'zwem') cat = CATS[0].key;
  say(swim ? 'Kies je burkini en ga dan naar de zee!' : '');
  render();
}
