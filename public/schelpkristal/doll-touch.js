// Tik op de prinses in het kleedhokje: op haar kroon gaan de kronen open, op haar haar de
// kapsels, op haar ketting de kettingen, enzovoort. Zo hoef je niet te kunnen lezen om te
// kiezen. Een wijzend handje laat zien dat het kan, tot er een keer op de prinses is getikt.

// welke soort hoort bij deze plek op de prinses (vak 300 × 520)
export function zoneAt(x, y, swimming) {
  if (swimming) return 'zwem';
  if (y < 92) return 'kroon';
  if (y < 175) return 'haar';
  if (y < 228 && x > 110 && x < 190) return 'ketting';
  if (y < 380 && (x < 98 || x > 202)) return 'haar'; // lange lokken langs het lijf
  if (y > 452) return 'schoenen';
  return 'jurk';
}

export function dollTouch(dollEl, pick) {
  const hand = document.createElement('div');
  hand.className = 'tap-hand';
  hand.setAttribute('aria-hidden', 'true');
  hand.innerHTML = '<svg viewBox="0 0 48 48"><path d="M18 44 L12 30 Q10 25 15 26 L19 31 V8 Q19 4 23 4 Q27 4 27 8 V22 L37 24 Q42 25 41 31 L38 44 Z" fill="#fff" stroke="#5a2a5a" stroke-width="2.5" stroke-linejoin="round"/></svg>';
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
