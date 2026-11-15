// De winkel: kies links kleren, make-up of haarspullen, tik op iets om het te passen
// en koop het met je sterren. Wat je koopt zie je meteen terug in de kast, de
// badkamer en bij de kapper.
import { GROUPS, ITEMS, owns, buy, parseKey } from './shop.js';
import { shopSvg } from './shop-scene.js';
import { roomScreen } from './screen.js';
import { itemThumb, catThumb } from './thumbs.js';
import { hatThumb } from './thumbs-hair.js';
import { TOOLS as MAKEUP_TOOLS, toolIcon } from './bath-tools.js';
import { MAKEUP } from './makeup.js';
import { button } from './ui.js';

roomScreen({
  room: 'winkel', title: 'Winkel', nav: 'Wat wil je bekijken', stage: 'cook-stage', heading: 'Sterren', doneLabel: 'Kopen',
  reset: false, extra: '<div id="winkel-items" class="items"></div>',
});
const el = (name) => document.getElementById(`winkel-${name}`);
const MOST = Math.max(...ITEMS.map((item) => item.price));

let api = null; // { getStars(), getOwned(), getLook() → { outfit, hair, makeup }, purchase(item) }
let group = GROUPS[0][0];
let item = null; // wat je bekijkt

const say = (text) => { el('hint').textContent = text; };
const lipstick = (kind, hex) => toolIcon(MAKEUP_TOOLS.find((t) => t.key === kind), hex);

// het plaatje van iets uit de winkel: de kleding in jouw kleur, de make-up in zijn
// kleur, of het haarspul op een hoofd
function iconOf(item) {
  const [kind, index] = parseKey(item.key);
  if (item.group === 'kleren') return itemThumb(kind, index, api.getLook().outfit.color[kind]);
  return item.group === 'makeup' ? lipstick(kind, MAKEUP[kind][index][0]) : hatThumb(index);
}
const GROUP_ICONS = {
  kleren: () => catThumb('jurk', api.getLook().outfit.color.jurk), makeup: () => lipstick('lips', '#e0245e'), haar: () => hatThumb(3),
};
const owned = () => api.getOwned();

function draw() {
  el('stage').innerHTML = shopSvg(item, api.getLook(), item ? owns(owned(), item.key) : false);
}

function look(next) {
  item = next;
  if (owns(owned(), next.key)) say(`${next.label}: die heb je al. Veel plezier ermee!`);
  else if (api.getStars() < next.price) say(`${next.label} kost ${next.price} sterren. Je hebt er ${api.getStars()}; verdien er meer in de kamers.`);
  else say(`${next.label} kost ${next.price} sterren. Mooi hè? Tik op Kopen.`);
  render();
}

function renderPanel() {
  const stars = api.getStars();
  el('nav').replaceChildren(...GROUPS.map(([key, label]) => button('cat', label, key === group, () => {
    group = key;
    item = null;
    say('Tik op iets om het te passen.');
    render();
  }, GROUP_ICONS[key]())));
  el('label').textContent = `${stars} ${stars === 1 ? 'ster' : 'sterren'}`;
  el('meter').style.width = `${Math.min(1, stars / MOST) * 100}%`;
  el('items').replaceChildren(...ITEMS.filter((i) => i.group === group).map((i) => {
    const mine = owns(owned(), i.key);
    return button('item', mine ? `${i.label} ✓` : `${i.label} · ${i.price} ★`, i === item, () => look(i), iconOf(i));
  }));
  // Kopen is grijs als er niets te kopen is: niets gekozen, al van jou of te weinig sterren
  el('done').classList.toggle('is-off', !item || owns(owned(), item.key) || stars < item.price);
}

function render() {
  renderPanel();
  draw();
}

// de groene knop: kopen wat je bekijkt
function purchase() {
  if (!item) {
    say('Tik eerst op iets om het te passen.');
    return;
  }
  const result = buy(owned(), api.getStars(), item);
  if (!result) {
    say(owns(owned(), item.key) ? 'Die heb je al!' : `Je hebt ${item.price - api.getStars()} sterren te weinig. Verdien ze in de kamers.`);
    return;
  }
  api.purchase(item, result);
  say(`Gekocht! ${item.label} is nu van jou. ${item.group === 'haar' ? 'Je vindt het bij de kapper.' : 'Je draagt het meteen.'}`);
  render();
}

export function initShop(shopApi) {
  api = shopApi;
  el('done').addEventListener('click', purchase);
}

export function showShop() {
  item = null;
  say('Welkom in de winkel! Tik op iets om het te passen.');
  render();
}
