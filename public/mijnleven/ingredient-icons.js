// Plaatjes van de ingrediënten in de keuken (vak 40 × 40), in de Glans-stijl: voor de
// knoppen en op het briefje met het recept. Zo kun je koken zonder te lezen.
import { paint, defs, shape, gloss, scoped, WHITE } from './glans.js';

const P = Object.fromEntries(['#f4ead2', '#5ec8ff', '#ffd43b', '#fff3d6', '#ffe066', '#f2d58a', '#ff7a59', '#43a047',
  '#e0b872', '#e53935', '#b5651d', '#d9a86c'].map((c) => [c, paint(c)]));
const dots = (list, r, fill) => `<g fill="${fill}">${list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
const bowl = (inside) => `${inside}${shape('M5 20 h30 c0 10 -7 15 -15 15 c-8 0 -15 -5 -15 -15 z', P['#d9a86c'])}${gloss(12, 25, 3, 2)}`;
const leaf = (x, y, turn) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="8" fill="${P['#43a047'].fill}" stroke="${P['#43a047'].line}" stroke-width="1.2" transform="rotate(${turn} ${x} ${y})"/>`;

const ICONS = {
  bloem: [shape('M9 12 h22 l3 24 h-28 z', P['#f4ead2']) + '<path d="M9 12 l3 -5 h16 l3 5" fill="#fff" stroke="#c9b48a" stroke-width="1.5" stroke-linejoin="round"/>'
    + '<path d="M20 31 V18 M20 22 l-4 -3 M20 22 l4 -3 M20 27 l-4 -3 M20 27 l4 -3" fill="none" stroke="#c9a400" stroke-width="2" stroke-linecap="round"/>', '#f4ead2'],
  melk: [shape('M11 14 l9 -8 9 8 v22 h-18 z', WHITE) + shape('M11 20 h18 v9 h-18 z', P['#5ec8ff']) + gloss(15, 30, 2, 4), '#5ec8ff'],
  eieren: [shape('M14 16 c5 0 8 7 8 12 c0 5 -4 8 -8 8 c-4 0 -8 -3 -8 -8 c0 -5 3 -12 8 -12 z', P['#fff3d6'])
    + shape('M27 10 c5 0 8 7 8 12 c0 5 -4 8 -8 8 c-4 0 -8 -3 -8 -8 c0 -5 3 -12 8 -12 z', P['#fff3d6']) + gloss(24, 16, 2, 4), '#fff3d6'],
  boter: [shape('M5 22 l8 -8 h22 v12 l-8 8 h-22 z', P['#ffe066']) + '<path d="M5 22 h22 l8 -8 M27 22 v12" fill="none" stroke="#c9a400" stroke-width="1.5"/>' + gloss(14, 27, 4, 2), '#ffe066'],
  couscous: [bowl(dots([[10, 19], [15, 16], [20, 18], [25, 15], [30, 19], [13, 21], [22, 21], [28, 21], [18, 14]], 2.6, '#e8c260')), '#d9a86c'],
  water: [shape('M20 5 C27 15 32 21 32 27 C32 33 27 37 20 37 C13 37 8 33 8 27 C8 21 13 15 20 5 Z', P['#5ec8ff']) + gloss(15, 26, 3, 6, -15), '#5ec8ff'],
  groente: [leaf(16, 9, -25) + leaf(24, 9, 25) + shape('M13 15 h14 l-6 22 h-2 z', P['#ff7a59'])
    + '<path d="M15 20 h4 M17 26 h4 M18 31 h3" stroke="#c0502e" stroke-width="1.5" stroke-linecap="round"/>', '#ff7a59', '#43a047'],
  kikkererwten: [bowl(`<g fill="${P['#e0b872'].fill}" stroke="${P['#e0b872'].line}" stroke-width="1">${[[11, 18], [18, 15], [25, 17], [31, 19], [15, 21], [22, 21], [28, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join('')}</g>`), '#e0b872', '#d9a86c'],
  tomaten: [shape('M20 12 c9 0 15 6 15 13 c0 7 -7 11 -15 11 c-8 0 -15 -4 -15 -11 c0 -7 6 -13 15 -13 z', P['#e53935'])
    + '<path d="M20 13 l-5 -5 M20 13 l5 -5 M20 13 v-7 M20 13 l-7 -1 M20 13 l7 -1" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round"/>' + gloss(13, 20, 4, 3, -30), '#e53935'],
  linzen: [bowl(dots([[10, 19], [14, 16], [18, 19], [22, 16], [26, 19], [30, 17], [16, 21], [24, 21], [12, 21], [28, 21], [20, 14]], 2.4, '#b5651d')), '#d9a86c'],
  kruiden: ['<path d="M20 38 V12" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round"/>' + leaf(14, 16, -40) + leaf(26, 16, 40) + leaf(14, 27, -40) + leaf(26, 27, 40) + leaf(20, 8, 0), '#43a047'],
};

// het plaatje als losse SVG (zonder scoped); svg-attributen kunnen ervoor (x, y, ...)
export function ingredientSvg(key, attrs = '') {
  const [inner, ...colors] = ICONS[key];
  return `<svg ${attrs} viewBox="0 0 40 40" aria-hidden="true">${defs([WHITE, ...colors.map((c) => P[c])])}${inner}</svg>`;
}

// voor op een knop
export const ingredientIcon = (key) => scoped(ingredientSvg(key));
