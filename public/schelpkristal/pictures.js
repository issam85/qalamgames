// Plaatjes voor kinderen die (nog) niet lezen: een icoontje per soort en per knop, en van
// elke jurk, kroon, ketting en schoen een kleine tekening uit de prinses zelf.
import { princessSvg, swimSvg } from './princess.js';

const icon = (body) => `<svg viewBox="0 0 48 48" aria-hidden="true">${body}</svg>`;
const LINE = 'stroke="#5a2a5a" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';

export const CAT_ICONS = {
  jurk: icon(`<path d="M19 5 h10 l2 8 -4 4 L39 42 H9 L21 17 l-4 -4 Z" fill="#ff8ac8" ${LINE}/><path d="M21 17 h6" ${LINE}/>`),
  kroon: icon(`<path d="M7 36 L9 14 L17 24 L24 8 L31 24 L39 14 L41 36 Z" fill="#ffd43b" ${LINE}/><circle cx="24" cy="29" r="3.5" fill="#ff5fa2"/>`),
  ketting: icon(`<path d="M9 8 Q24 38 39 8" fill="none" stroke="#c0c6d4" stroke-width="3"/>${[[12, 16], [17, 24], [24, 28], [31, 24], [36, 16]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fbf7f0" ${LINE}/>`).join('')}<path d="M24 31 l-5 5 5 6 5 -6 Z" fill="#5ec8ff" ${LINE}/>`),
  schoenen: icon(`<path d="M6 34 Q6 26 14 26 L26 30 Q34 20 40 26 L42 34 Z" fill="#8fd3ff" ${LINE}/><path d="M38 34 L37 42" stroke="#5a2a5a" stroke-width="4" stroke-linecap="round"/>`),
  zwem: icon(`<path d="M4 20 Q10 14 16 20 T28 20 T40 20 T46 20" fill="none" stroke="#2f6fe0" stroke-width="4" stroke-linecap="round"/>`
    + '<path d="M4 31 Q10 25 16 31 T28 31 T40 31 T46 31" fill="none" stroke="#5ec8ff" stroke-width="4" stroke-linecap="round"/>'),
};

// iconen voor de knoppen op het beginscherm en in het kleedhokje
export const BUTTON_ICONS = {
  strand: icon(`<path d="M24 40 L8 18 Q24 2 40 18 Z" fill="#ffd9b8" ${LINE}/><path d="M24 40 L16 12 M24 40 L24 8 M24 40 L32 12" ${LINE} fill="none"/>`
    + '<path d="M40 30 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 Z" fill="#ffd43b"/>'),
  douche: icon(`<path d="M10 6 V14 Q10 18 16 18 H22" fill="none" ${LINE}/><path d="M18 18 H36 L32 24 H22 Z" fill="#c0c6d4" ${LINE}/>`
    + [[22, 30], [27, 34], [32, 30], [24, 40], [30, 42]].map(([x, y]) => `<path d="M${x} ${y} q-2 3 0 5 q2 -2 0 -5 Z" fill="#5ec8ff"/>`).join('')),
  zee: icon(`<path d="M4 34 Q10 28 16 34 T28 34 T40 34 T46 34 V46 H4 Z" fill="#5ec8ff" ${LINE}/>`
    + `<path d="M16 18 Q24 10 32 18 Q24 26 16 18 Z M32 18 L38 13 V23 Z" fill="#ff8a3d" ${LINE}/><circle cx="21" cy="17" r="1.5" fill="#5a2a5a"/>`),
  kleed: icon(`<path d="M24 4 a4 4 0 1 1 4 4 l-4 3 L6 20 H42 L24 11" fill="none" ${LINE}/>${CAT_ICONS.jurk.replace(/<\/?svg[^>]*>/g, '')
    .replace('M19 5', 'M19 19').replace('L39 42 H9', 'L36 46 H12')}`),
  klaar: icon('<path d="M9 25 L20 36 L40 12" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'),
  verras: icon(`<path d="M24 4 l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1 Z" fill="#fff" ${LINE}/>`),
  terug: icon('<path d="M6 24 L24 8 L42 24 M12 20 V40 H36 V20" fill="none" stroke="#c2419a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'),
};

// welk stuk van de prinses je ziet in het plaatje van een ding (vak 300 × 520)
const CROPS = {
  jurk: '40 160 220 360',
  kroon: '100 18 100 82',
  ketting: '104 168 92 76',
  schoenen: '84 448 132 70',
  zwem: '70 150 160 370',
};

// een tekening van de prinses met ding i van deze soort, in haar eigen kleuren
export function itemPicture(cat, i, princess, outfit) {
  const tryOn = { ...outfit, choice: { ...outfit.choice, [cat]: i } };
  return cat === 'zwem'
    ? swimSvg(princess, { ...tryOn, hood: outfit.hood }).replace(/viewBox="[^"]*"/, `viewBox="${CROPS.zwem}"`)
    : princessSvg(princess, tryOn, '', CROPS[cat]);
}

// zet een icoon vóór de tekst van een bestaande knop (beginscherm, Klaar, Terug)
export function decorate(el, name) {
  const label = el.textContent.trim();
  el.innerHTML = `<span class="pic">${BUTTON_ICONS[name]}</span><span class="name">${label}</span>`;
  el.classList.add('with-pic');
  el.setAttribute('aria-label', label);
}
