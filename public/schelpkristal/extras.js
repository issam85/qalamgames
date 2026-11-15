// Oorbellen, armband en haarversiering (zelfde volgorde als in data.js; nummer 0 = geen).
// p = de verf (paint uit glans.js). Oorbellen aan de oorlel rond (108, 140), gespiegeld;
// ze komen na de lokken, anders vallen ze eronder weg. De armband om de linkerpols
// (90, 316), over de manchet. De haarversiering opzij van het hoofd, bij een staart op
// de plek van het elastiekje, bij een knot tegen de knot.
import { shape, gloss, sparkle, mirror, dots } from './glans.js';

const HEART = (x, y, s) => `M${x} ${y + s} C${x - 2 * s} ${y - 0.2 * s} ${x - s} ${y - 1.6 * s} ${x} ${y - 0.6 * s} C${x + s} ${y - 1.6 * s} ${x + 2 * s} ${y - 0.2 * s} ${x} ${y + s} Z`;
const STAR = (x, y, s) => `M${x} ${y - s} L${x + 0.3 * s} ${y - 0.3 * s} L${x + s} ${y - 0.2 * s} L${x + 0.45 * s} ${y + 0.25 * s} L${x + 0.6 * s} ${y + s} L${x} ${y + 0.6 * s} L${x - 0.6 * s} ${y + s} L${x - 0.45 * s} ${y + 0.25 * s} L${x - s} ${y - 0.2 * s} L${x - 0.3 * s} ${y - 0.3 * s} Z`;
const pearls = (list, r) => `<g fill="#fbf7f0" stroke="#c9bfae" stroke-width="1">${dots(list, r)}</g><g fill="#fff">${dots(list.map(([x, y]) => [x - r / 3, y - r / 3]), r / 3)}</g>`;
const hook = (p, to) => `<path d="M108 138 L108 ${to}" stroke="${p.line}" stroke-width="1.6"/>`;

export const EARRINGS = [
  () => '',
  (p) => mirror(`<circle cx="108" cy="141" r="4.5" fill="${p.fill}" stroke="${p.line}" stroke-width="1.2"/><circle cx="106.5" cy="139.5" r="1.4" fill="#fff"/>`),
  (p) => mirror(hook(p, 146) + shape(HEART(108, 151, 5), p)),
  (p) => mirror(hook(p, 145) + shape(STAR(108, 152, 8), p) + sparkle(114, 146, 2.5)),
  (p) => mirror(hook(p, 144) + shape('M108 143 C101 154 101 162 108 164 C115 162 115 154 108 143 Z', p) + gloss(106, 156, 2, 4)),
  () => mirror('<path d="M108 138 L108 145" stroke="#c9a400" stroke-width="1.6"/>' + pearls([[108, 151]], 6)),
];

const WRIST = 'M79 311 Q90 307 102 311 L102 319 Q90 315 79 319 Z';
const bead = (list, p) => `<g fill="${p.fill}" stroke="${p.line}" stroke-width="1">${dots(list, 3.4)}</g>`;
export const BRACELETS = [
  () => '',
  (p) => bead([[81, 316], [86, 314], [91, 313.5], [96, 314], [101, 316]], p),
  (p) => shape(WRIST, p) + '<path d="M82 312 Q90 309 99 312" stroke="#fff" stroke-width="1.5" opacity="0.7" fill="none"/>',
  (p) => `<path d="M80 315 Q90 311 102 315" fill="none" stroke="${p.line}" stroke-width="2"/>`
    + shape(HEART(86, 322, 3.5), p) + shape(STAR(96, 323, 5), p),
  () => pearls([[81, 316], [86, 314], [91, 313.5], [96, 314], [101, 316]], 3.4),
];

// waar de versiering zit, per kapsel
const SPOT = { staart: [194, 86], knot: [174, 44] };
const at = (style) => SPOT[style] || [194, 102];
const PINS = [
  () => '',
  (p, [x, y]) => shape(`M${x} ${y} L${x - 14} ${y - 9} L${x - 14} ${y + 9} Z`, p) + shape(`M${x} ${y} L${x + 14} ${y - 9} L${x + 14} ${y + 9} Z`, p)
    + `<circle cx="${x}" cy="${y}" r="4.5" fill="${p.fill}" stroke="${p.line}" stroke-width="1.4"/>`,
  (p, [x, y]) => `<g fill="${p.fill}" stroke="${p.line}" stroke-width="1">${dots([[x - 6, y - 3], [x + 6, y - 3], [x - 4, y + 6], [x + 4, y + 6], [x, y - 7]], 5.5)}</g>`
    + `<circle cx="${x}" cy="${y}" r="4" fill="#ffd43b"/>`,
  (p) => `<path d="M104 104 Q150 34 196 104" fill="none" stroke="${p.line}" stroke-width="10" stroke-linecap="round"/>`
    + `<path d="M104 104 Q150 34 196 104" fill="none" stroke="${p.c}" stroke-width="7" stroke-linecap="round"/>`
    + '<path d="M118 82 Q132 66 148 64" fill="none" stroke="#fff" stroke-width="2" opacity="0.6" stroke-linecap="round"/>',
  (p, [x, y]) => shape(`M${x} ${y} C${x - 18} ${y - 18} ${x - 18} ${y + 2} ${x} ${y} C${x - 14} ${y + 4} ${x - 8} ${y + 14} ${x} ${y} Z`, p)
    + shape(`M${x} ${y} C${x + 18} ${y - 18} ${x + 18} ${y + 2} ${x} ${y} C${x + 14} ${y + 4} ${x + 8} ${y + 14} ${x} ${y} Z`, p)
    + `<path d="M${x} ${y - 6} L${x} ${y + 7}" stroke="#3a2420" stroke-width="2.4" stroke-linecap="round"/>`,
  (p, [x, y]) => pearls([[x - 9, y - 7], [x, y], [x + 9, y + 7]], 4.5) + sparkle(x + 10, y - 8, 3),
];

export const HAIR_PINS = PINS.map((draw) => (p, style) => draw(p, at(style)));
// vervangt de versiering het elastiekje van de staart? (de haarband niet)
export const replacesTie = (i) => i > 0 && i !== 3;
