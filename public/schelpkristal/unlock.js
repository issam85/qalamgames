// Vrijspelen in het kleedhokje. Tik je op iets met een slotje, dan past de prinses het eerst
// (zonder te bewaren). In het notitievak staat dan het plaatje met een gouden knop met de
// prijs; pas die knop koopt het. Heb je te weinig, dan zie je wat je nog nodig hebt en een
// knop naar het strand (schelpen, kristallen) of de zee (parels).
import { BUTTON_ICONS } from './icons.js';
import { pictureNote, countPart } from './pictures.js';

// [veld in game, icoon, één, meer]
export const COST = [['shells', 'shell', 'schelp', 'schelpen'], ['crystals', 'crystal', 'kristal', 'kristallen'], ['pearls', 'pearl', 'parel', 'parels']];
// price = [schelpen, kristallen, parels]
export const priceText = (price) => COST.map(([, , one, many], k) => price[k] && `${price[k]} ${price[k] === 1 ? one : many}`).filter(Boolean).join(' + ');
export const priceIcons = (price) => COST.map(([, ico], k) => price[k] && countPart(ico, price[k])).filter(Boolean).join(' ');
// wat je nog mist (per soort, 0 = genoeg)
export const missing = (game, price) => COST.map(([key], k) => Math.max(0, (price[k] || 0) - game[key]));

// betalen en het ding is van jou (game.owned = ['jurk:4', ...])
export function buy(game, cat, i, price) {
  COST.forEach(([key], k) => { game[key] -= price[k] || 0; });
  game.owned = [...game.owned, `${cat}:${i}`];
}

function goButton(name, label, go) {
  const btn = document.createElement('button');
  btn.className = 'btn blue go with-pic';
  btn.innerHTML = `<span class="pic">${BUTTON_ICONS[name]}</span>`;
  btn.setAttribute('aria-label', label);
  btn.addEventListener('click', go);
  return btn;
}

// Het notitievak bij passen. item = { picture, label, price }; onBuy() koopt het, go(id)
// gaat naar een ander scherm.
export function tryNote(noteEl, game, item, onBuy, go) {
  const need = missing(game, item.price);
  if (need.some(Boolean)) {
    const parts = [item.picture, BUTTON_ICONS.nee, ...COST.map(([, ico], k) => need[k] && countPart(ico, need[k])).filter(Boolean)];
    if (need[0] || need[1]) parts.push(goButton('strand', 'Naar het strand', () => go('screen-strand')));
    if (need[2]) parts.push(goButton('zee', 'Naar de zee', () => go('screen-zee')));
    pictureNote(noteEl, parts, `Voor ${item.label} heb je nog ${priceText(need)} nodig.`);
    return;
  }
  const btn = document.createElement('button');
  btn.className = 'btn gold buy';
  btn.innerHTML = priceIcons(item.price);
  btn.setAttribute('aria-label', `${item.label} kopen voor ${priceText(item.price)}`);
  btn.addEventListener('click', onBuy);
  pictureNote(noteEl, [item.picture, btn], `Pas je ${item.label}? Kopen voor ${priceText(item.price)}.`);
}

// na het kopen: het plaatje met een vinkje
export const boughtNote = (noteEl, item) => pictureNote(noteEl, [item.picture, BUTTON_ICONS.ja], `Joepie! ${item.label} is nu van jou.`);
