// Tik op de prinses in het kleedhokje: op haar kroon gaan de kronen open, op haar haar de
// kapsels, op haar gezicht het gezicht, op haar oor of pols de sieraden, enzovoort. Zo hoef
// je niet te kunnen lezen om te kiezen. Een wijzend handje laat zien dat het kan, tot er een
// keer op de prinses is getikt.
import { HAND } from './icons.js';

// welke soort hoort bij deze plek op de prinses (vak 300 × 520); null = naast de prinses
export function zoneAt(x, y, swimming) {
  if (x < 60 || x > 240 || y < 0 || y > 515) return null;
  if (swimming) return 'zwem';
  if (Math.abs(Math.abs(x - 150) - 42) < 10 && y > 130 && y < 168) return 'sieraden'; // oorbellen
  if (y > 92 && ((x - 150) / 40) ** 2 + ((y - 118) / 46) ** 2 < 1) return 'gezicht';
  if (y < 92) return 'kroon';
  if (y < 175) return 'haar';
  if (y < 228 && x > 110 && x < 190) return 'ketting';
  if (y > 300 && y < 345 && (x < 106 || x > 194)) return 'sieraden'; // armband om de pols
  if (y < 380 && (x < 98 || x > 202)) return 'haar'; // lange lokken langs het lijf
  if (y > 452) return 'schoenen';
  return 'jurk';
}

export function dollTouch(dollEl, pick) {
  const hand = document.createElement('div');
  hand.className = 'tap-hand';
  hand.setAttribute('aria-hidden', 'true');
  hand.innerHTML = HAND;
  dollEl.parentElement.append(hand);

  dollEl.addEventListener('click', (e) => {
    const svg = dollEl.querySelector('svg');
    if (!svg) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    hand.hidden = true;
    pick(p.x, p.y);
  });
  return { hideHand: () => { hand.hidden = true; } };
}
