// De winkel zonder scherm: wat er te koop is en wat kopen doet. Een sleutel is
// '<categorie>:<nummer>' (kleren, zie data.js), '<soort>:<nummer>' (make-upkleur,
// zie makeup.js) of 'hat:<nummer>' (haarspullen, zie HATS in hair.js).
import { CATS } from './data.js';
import { MAKEUP } from './makeup.js';
import { HATS } from './hair.js';

export const GROUPS = [['kleren', 'Kleren'], ['makeup', 'Make-up'], ['haar', 'Haarspullen']];
const MAKEUP_NAMES = { lips: 'Lippenstift', blush: 'Blush', eyes: 'Oogschaduw' };

const clothes = (cat, index, price) => ({
  key: `${cat}:${index}`, group: 'kleren', label: CATS.find((c) => c.key === cat).items[index], price,
});
const color = (kind, index, price) => ({
  key: `${kind}:${index}`, group: 'makeup', label: `${MAKEUP_NAMES[kind]} ${MAKEUP[kind][index][1]}`, price,
});
const hat = (index, price) => ({ key: `hat:${index}`, group: 'haar', label: HATS[index][0], price });

export const ITEMS = [
  clothes('jurk', 6, 8), clothes('hoofddoek', 6, 6), clothes('schoenen', 6, 5), clothes('tas', 6, 5),
  clothes('sieraden', 6, 4), clothes('extra', 6, 4),
  color('lips', 5, 3), color('lips', 6, 3), color('blush', 5, 3), color('blush', 6, 3), color('eyes', 5, 3), color('eyes', 6, 3),
  hat(2, 4), hat(3, 4), hat(4, 5), hat(5, 6),
];

export const owns = (owned, key) => owned.includes(key);

// kopen: geeft { owned, stars } terug, of null als je te weinig sterren hebt of het al hebt
export function buy(owned, stars, item) {
  if (owns(owned, item.key) || stars < item.price) return null;
  return { owned: [...owned, item.key], stars: stars - item.price };
}

// de soort en het nummer uit een sleutel: 'jurk:6' → ['jurk', 6]
export function parseKey(key) {
  const [kind, index] = key.split(':');
  return [kind, Number(index)];
}
