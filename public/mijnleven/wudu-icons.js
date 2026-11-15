// Plaatjes voor Moskee en Mekka (vak 40 × 40): de zeven stappen van wudu, elk met
// waterdruppels, en de drie onderdelen (wudu, gebed, reis naar Mekka).
import { SKIN_PAINT, INK, paint, defs, shape, gloss, scoped } from './glans.js';

const BLUE = paint('#5ec8ff');
const HAIR = paint('#3b2314');
const MAT = paint('#e05a4a');
const drop = (x, y, s = 1) => `<path d="M${x} ${y} c${4 * s} ${6 * s} ${4 * s} ${10 * s} 0 ${10 * s} c${-4 * s} 0 ${-4 * s} ${-4 * s} 0 ${-10 * s}z" fill="${BLUE.fill}" stroke="${BLUE.line}" stroke-width="1"/>`;
const skin = (d) => shape(d, SKIN_PAINT);
const head = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN_PAINT.fill}" stroke="${SKIN_PAINT.line}" stroke-width="1.5"/>`;
const eyes = (x, y) => `<g fill="${INK}"><circle cx="${x - 5}" cy="${y}" r="1.8"/><circle cx="${x + 5}" cy="${y}" r="1.8"/></g>`;
const smile = (x, y) => `<path d="M${x - 4} ${y} q4 4 8 0" fill="none" stroke="#b83b3b" stroke-width="2" stroke-linecap="round"/>`;
const HAND = skin('M12 36 C9 30 9 24 10 20 L10 9 a2 2 0 0 1 4 0 L14 18 L15 6 a2 2 0 0 1 4 0 L19 18 L20 7 a2 2 0 0 1 4 0 L24 19 L25 11 a2 2 0 0 1 4 0 L29 25 C29 31 26 36 20 37 Z')
  + skin('M10 22 C6 19 4 16 6 14 C8 13 10 16 12 19 Z');

// zelfde volgorde als WUDU in mosque.js: handen, mond, neus, gezicht, armen, hoofd, voeten
const STEPS = [
  HAND + drop(32, 4) + drop(5, 26, 0.8),
  head(20, 22, 15) + eyes(20, 18) + '<ellipse cx="20" cy="29" rx="5" ry="3.5" fill="#7a2030"/>' + drop(31, 26, 0.9),
  head(20, 22, 15) + eyes(20, 16) + skin('M20 18 L25 28 L19 28 Z') + smile(20, 31) + drop(30, 22, 0.8),
  head(20, 22, 15) + eyes(20, 19) + smile(20, 27) + drop(6, 6) + drop(30, 4) + drop(18, 2, 0.8),
  `<path d="M6 34 L30 12" stroke="${SKIN_PAINT.line}" stroke-width="11" stroke-linecap="round"/><path d="M6 34 L30 12" stroke="${SKIN_PAINT.fill}" stroke-width="8.5" stroke-linecap="round"/>`
    + head(32, 10, 5) + drop(10, 12) + drop(26, 26, 0.9),
  head(20, 24, 14) + shape('M6 22 C6 8 34 8 34 22 C28 16 12 16 6 22 Z', HAIR) + eyes(20, 25) + smile(20, 31)
    + skin('M22 4 C26 2 32 4 34 8 L28 12 C26 9 24 8 22 8 Z'),
  skin('M8 30 C8 24 12 22 18 22 L18 8 a5 5 0 0 1 10 0 L28 26 C28 32 24 36 16 36 C11 36 8 34 8 30 Z') + gloss(22, 14, 2, 4) + drop(6, 8) + drop(32, 18, 0.9),
];

const PARTS = {
  wudu: shape('M20 4 C28 15 33 21 33 27 C33 34 27 38 20 38 C13 38 7 34 7 27 C7 21 12 15 20 4 Z', BLUE) + gloss(15, 26, 3, 6, -15),
  gebed: shape('M8 6 H32 L36 36 H4 Z', MAT) + '<path d="M11 10 H29 L32 32 H8 Z" fill="none" stroke="#ffd43b" stroke-width="2"/>'
    + '<path d="M15 30 V22 C15 16 25 16 25 22 V30 Z" fill="#ffd43b" opacity="0.9"/>',
  mekka: '<path d="M6 12 L20 6 L34 12 V32 L20 38 L6 32 Z" fill="#141414" stroke="#d4af37" stroke-width="1.5" stroke-linejoin="round"/>'
    + '<path d="M6 16 L20 10 L34 16 V19 L20 13 L6 19 Z" fill="#d4af37"/><path d="M20 13 V38" stroke="#d4af37" stroke-width="0.8" opacity="0.6"/>',
};

const svg = (inner) => scoped(`<svg viewBox="0 0 40 40" aria-hidden="true">${defs([BLUE, HAIR, MAT])}${inner}</svg>`);

// stap i van wudu, voor op een knop
export const wuduIcon = (i) => svg(STEPS[i]);
// stap i als stukje voor in een tekening (zonder scoped), op plek x, y, grootte s
export const wuduMark = (i, x, y, s) => `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 40 40">${defs([BLUE, HAIR])}${STEPS[i]}</svg>`;
// een onderdeel: 'wudu', 'gebed' of 'mekka'
export const partIcon = (key) => svg(PARTS[key]);
