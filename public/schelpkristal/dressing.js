// Het kleedhokje: links de soorten (jurk, kroon, haar, gezicht, ketting, sieraden,
// schoenen, zwemkleding), in het midden de prinses, rechts wat je kiest en de kleuren.
// Elke keuze is meteen te zien op de prinses en wordt bewaard. Wat nog op slot zit, pas
// je eerst en koop je dan met schelpen, kristallen en parels (unlock.js). Bij Zwemkleding
// zie je de prinses in haar burkini en gaat de groene knop naar de zee.
import { CATS, randomOutfit } from './data.js';
import { HAIR_CAT, FACE_CAT, changeLook, lookChoices } from './hair-pick.js';
import { outfitChoices, catOf } from './outfit-pick.js';
import { tryNote, boughtNote, buy } from './unlock.js';
import { princessSvg, swimSvg } from './princess.js';
import { button, withPicture } from './ui.js';
import { itemPicture, pictureNote } from './pictures.js';
import { CAT_ICONS, BUTTON_ICONS } from './icons.js';
import { dollTouch, zoneAt } from './doll-touch.js';
import { ting } from './sound.js';

const catsEl = document.getElementById('kleed-cats');
const itemsEl = document.getElementById('kleed-items');
const swatchesEl = document.getElementById('kleed-swatches');
const titleEl = document.getElementById('kleed-title');
const dollEl = document.getElementById('kleed-doll');
const noteEl = document.getElementById('kleed-note');
const doneEl = document.getElementById('kleed-done');

// de soorten op het scherm; rows = de rijen uit CATS die erbij horen
const label = (key) => catOf(key).label;
const SCREEN_CATS = [
  { key: 'jurk', label: label('jurk'), rows: ['jurk', 'patroon'] },
  { key: 'kroon', label: label('kroon'), rows: ['kroon'] },
  { ...HAIR_CAT, look: true, rows: ['speld'] },
  { ...FACE_CAT, look: true, rows: [] },
  { key: 'ketting', label: label('ketting'), rows: ['ketting'] },
  { key: 'sieraden', label: 'Sieraden', rows: ['oorbellen', 'armband'] },
  { key: 'schoenen', label: label('schoenen'), rows: ['schoenen'] },
  { key: 'zwem', label: label('zwem'), rows: ['zwem'] },
];
let cat = 'jurk';
let trial = null; // { key, i }: iets met een slotje dat de prinses even past
let api = null; // { game, save(), counters(), go(id) }
const clearNote = () => noteEl.replaceChildren();

// de outfit zoals je hem ziet: met wat ze nu past
const shown = () => (trial ? { ...api.game.outfit, choice: { ...api.game.outfit.choice, [trial.key]: trial.i } } : api.game.outfit);

function change(patch) {
  const { outfit } = api.game;
  trial = null;
  clearNote();
  api.game.outfit = {
    choice: { ...outfit.choice, ...(patch.choice || {}) },
    color: { ...outfit.color, ...(patch.color || {}) },
    hood: patch.hood ?? outfit.hood,
  };
  api.save();
  render();
}

function pickLook(patch) {
  trial = null;
  clearNote();
  changeLook(api.game, patch);
  api.save();
  render();
}

// iets met een slotje: eerst passen, kopen met de gouden knop
function tryItem(key, i) {
  const { game } = api;
  const c = catOf(key);
  trial = { key, i };
  render();
  const item = { picture: itemPicture(key, i, game.princess, shown()), label: c.items[i], price: c.prices[i] };
  tryNote(noteEl, game, item, () => {
    buy(game, key, i, item.price);
    api.counters();
    ting(true);
    dollEl.parentElement.classList.remove('bought');
    requestAnimationFrame(() => dollEl.parentElement.classList.add('bought'));
    change({ choice: { [key]: i } });
    boughtNote(noteEl, item);
  }, api.go);
}

function colorRow({ icon, swatches }) {
  const row = document.createElement('div');
  row.className = 'color-row';
  const strip = document.createElement('div');
  strip.className = 'strip';
  strip.append(...swatches);
  row.innerHTML = `<span class="row-ico">${icon}</span>`;
  row.append(strip);
  return row;
}

function render() {
  const { game } = api;
  const current = SCREEN_CATS.find((c) => c.key === cat);
  titleEl.textContent = current.label;
  catsEl.replaceChildren(...SCREEN_CATS.map((c) => withPicture(button('cat', c.label, c.key === cat, () => {
    cat = c.key;
    trial = null;
    clearNote();
    render();
  }), CAT_ICONS[c.key], c.label)));
  const look = current.look ? lookChoices(cat, game, pickLook) : { tiles: [], colorRows: [] };
  const wear = outfitChoices(current.rows, game, shown(), { change, tryItem, trial });
  itemsEl.replaceChildren(...look.tiles, ...wear.tiles);
  swatchesEl.replaceChildren(...[...look.colorRows, ...wear.colorRows].map(colorRow));
  dollEl.innerHTML = cat === 'zwem' ? swimSvg(game.princess, shown()) : princessSvg(game.princess, shown());
  const swim = cat === 'zwem';
  const doneText = swim ? 'Naar de zee!' : 'Klaar!';
  (doneEl.querySelector('.name') || doneEl).textContent = doneText;
  const pic = doneEl.querySelector('.pic');
  if (pic) pic.innerHTML = BUTTON_ICONS[swim ? 'zee' : 'klaar'];
  doneEl.setAttribute('aria-label', doneText);
  doneEl.dataset.go = swim ? 'screen-zee' : 'screen-start';
}

export function initDressing(dressingApi) {
  api = dressingApi;
  // tik op de prinses: op haar kroon gaan de kronen open, op haar ketting de kettingen, …
  dollTouch(dollEl, (x, y) => {
    const zone = zoneAt(x, y, cat === 'zwem');
    if (!zone) return;
    cat = zone;
    trial = null;
    clearNote();
    render();
  });
  document.getElementById('kleed-surprise').addEventListener('click', () => {
    trial = null;
    clearNote();
    api.game.outfit = randomOutfit(api.game.owned, api.game.outfit.hood);
    api.save();
    render();
  });
}

// swim = meteen bij Zwemkleding beginnen (vanaf de knop Zwemmen)
export function showDressing(swim = false) {
  if (swim) cat = 'zwem';
  else if (cat === 'zwem') cat = CATS[0].key;
  trial = null;
  clearNote();
  if (swim) pictureNote(noteEl, [CAT_ICONS.zwem, BUTTON_ICONS.pijl, BUTTON_ICONS.zee], 'Kies je burkini en ga dan naar de zee!');
  render();
}
