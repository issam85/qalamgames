// De winkel: kies links kleren, make-up of haarspullen, tik op iets om het te passen
// en koop het met je sterren. Wat je koopt zie je meteen terug in de kast, de
// badkamer en bij de kapper.
import { GROUPS, ITEMS, owns, buy } from './shop.js';
import { shopSvg } from './shop-scene.js';
import { roomScreen } from './screen.js';
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
  })));
  el('label').textContent = `${stars} ${stars === 1 ? 'ster' : 'sterren'}`;
  el('meter').style.width = `${Math.min(1, stars / MOST) * 100}%`;
  el('items').replaceChildren(...ITEMS.filter((i) => i.group === group).map((i) => {
    const mine = owns(owned(), i.key);
    return button('item', mine ? `${i.label} ✓` : `${i.label} · ${i.price} ★`, i === item, () => look(i));
  }));
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
  say(`Gekocht! ${item.label} is nu van jou. Je draagt het meteen.`);
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
