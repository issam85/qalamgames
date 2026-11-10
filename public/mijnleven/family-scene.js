// De tekening van de woonkamer: papa en de twee dochters voor de bank, met hun
// hartjes erboven, en het eten uit de keuken als dat klaarstaat. In de Glans-stijl
// (glans.js), met kleinere gezichten dan dat van het meisje.
import { SKIN_PAINT, INK, paint, defs, shape, gloss } from './glans.js';
import { RECIPES } from './recipes.js';
import { MEMBERS, hearts } from './family.js';
import { sceneSvg } from './ui.js';

const HAIR = paint('#3b2314');
const SHIRT = paint('#4f7fd9');
const KUFI = paint('#f4f4f4');
const RED = paint('#e53935');
const BLANKET = paint('#b36bff');
const ROOM = '<rect x="30" y="0" width="240" height="340" rx="14" fill="#ffeef6"/>'
  + '<rect x="126" y="14" width="48" height="46" rx="6" fill="#bfe6ff" stroke="#fff" stroke-width="4"/><path d="M150 14v46M126 37h48" stroke="#fff" stroke-width="3"/>'
  + '<rect x="30" y="262" width="240" height="78" fill="#e7c9a0"/><ellipse cx="150" cy="306" rx="106" ry="22" fill="#ff9ecf" opacity="0.7"/>'
  + '<rect x="44" y="176" width="212" height="96" rx="22" fill="#b79cf2"/><rect x="44" y="228" width="212" height="44" rx="14" fill="#a384ea"/>';

const heart = (x, y, full) => `<path d="M${x} ${y} c-7 -8 -14 2 0 12 c14 -10 7 -20 0 -12z" fill="${full ? RED.fill : '#fff'}" stroke="${full ? RED.line : '#c9b8d8'}" stroke-width="2"/>`
  + (full ? `<circle cx="${x - 3.5}" cy="${y - 1}" r="1.6" fill="#fff" opacity="0.8"/>` : '');
const heartsRow = (list, x, y) => list.map((full, j) => heart(x + (j - (list.length - 1) / 2) * 16, y, full)).join('');
const label = (name, x) => `<text x="${x}" y="326" text-anchor="middle" font-size="12" fill="#5b4a6e">${name}</text>`;
// links en rechts hetzelfde, gespiegeld rond x
const mirror = (x, one) => `${one}<g transform="translate(${2 * x} 0) scale(-1 1)">${one}</g>`;
const head = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${SKIN_PAINT.fill}" stroke="${SKIN_PAINT.line}" stroke-width="1.2"/>`;
const hand = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN_PAINT.fill}" stroke="${SKIN_PAINT.line}" stroke-width="1.2"/>`;

// een gezicht: ogen op hoogte y, s = grootte (1 = papa, 0.75 = een dochter);
// closed = ogen dicht (slapen)
function look(x, y, s, closed) {
  const g = 8 * s;
  const r = 4.2 * s;
  const eye = (cx) => (closed
    ? `<path d="M${cx - r} ${y} q${r} ${r * 1.2} ${2 * r} 0" fill="none" stroke="${INK}" stroke-width="${2 * s}" stroke-linecap="round"/>`
    : `<ellipse cx="${cx}" cy="${y}" rx="${r}" ry="${r * 1.25}" fill="#fff"/><circle cx="${cx}" cy="${y + 1}" r="${r * 0.7}" fill="url(#g-iris)"/><circle cx="${cx}" cy="${y + 1.5}" r="${r * 0.4}" fill="#1d1016"/>`
      + `<circle cx="${cx - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.28}" fill="#fff"/>`
      + `<path d="M${cx - r - 1} ${y - 1} Q${cx} ${y - r * 1.7} ${cx + r + 1} ${y - 1}" fill="none" stroke="${INK}" stroke-width="${1.8 * s}" stroke-linecap="round"/>`);
  const brow = (cx) => `<path d="M${cx - r - 1} ${y - r * 2.2} Q${cx} ${y - r * 2.9} ${cx + r + 1} ${y - r * 2.1}" fill="none" stroke="#4a2c1e" stroke-width="${1.8 * s}" stroke-linecap="round"/>`;
  return eye(x - g) + eye(x + g) + brow(x - g) + brow(x + g)
    + `<path d="M${x - 1} ${y + 6 * s} q1.5 2.5 3.5 0.5" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>`
    + `<path d="M${x - 5 * s} ${y + 11 * s} Q${x} ${y + 17 * s} ${x + 5 * s} ${y + 11 * s}" fill="none" stroke="#b83b3b" stroke-width="${2 * s}" stroke-linecap="round"/>`
    + mirror(x, `<ellipse cx="${x - 11 * s}" cy="${y + 9 * s}" rx="${5 * s}" ry="${3 * s}" fill="url(#g-blush)"/>`);
}

// papa: een lang blauw gewaad met een kraag, een witte kufi en een korte baard
function papa({ name, x }, family) {
  return mirror(x, `<path d="M${x - 24} 134 C${x - 34} 170 ${x - 38} 200 ${x - 36} 222" fill="none" stroke="${SHIRT.fill}" stroke-width="16" stroke-linecap="round"/>`
      + `<path d="M${x - 16} 136 C${x - 26} 170 ${x - 30} 200 ${x - 28} 222 M${x - 32} 136 C${x - 42} 170 ${x - 46} 200 ${x - 44} 222" fill="none" stroke="${SHIRT.line}" stroke-width="1.5" stroke-linecap="round"/>`
      + hand(x - 35, 228, 8) + shape(`M${x - 28} 296 a14 6 0 1 0 28 0 a14 6 0 1 0 -28 0 z`, paint('#3a2a4d')))
    + shape(`M${x - 26} 128 C${x - 32} 170 ${x - 34} 240 ${x - 34} 292 L${x + 34} 292 C${x + 34} 240 ${x + 32} 170 ${x + 26} 128 Z`, SHIRT)
    + `<path d="M${x - 10} 128 L${x + 10} 128 L${x} 144 Z" fill="#fff"/><g fill="#fff" opacity="0.9"><circle cx="${x}" cy="154" r="2"/><circle cx="${x}" cy="168" r="2"/><circle cx="${x}" cy="182" r="2"/></g>` + gloss(x - 16, 200, 6, 44)
    + head(x, 96, 22, 25)
    + shape(`M${x - 22} 92 C${x - 24} 60 ${x + 24} 60 ${x + 22} 92 C${x + 10} 80 ${x - 10} 80 ${x - 22} 92 Z`, HAIR)
    + shape(`M${x - 21} 100 C${x - 20} 130 ${x + 20} 130 ${x + 21} 100 C${x + 12} 118 ${x - 12} 118 ${x - 21} 100 Z`, HAIR)
    + shape(`M${x - 19} 78 C${x - 19} 60 ${x + 19} 60 ${x + 19} 78 Q${x} 84 ${x - 19} 78 Z`, KUFI) + gloss(x - 8, 68, 6, 3, -20)
    + look(x, 94, 1, false) + heartsRow(hearts(family, 0), x, 44) + label(name, x);
}

// een dochter met twee knotjes; als ze slaapt: ogen dicht, een dekentje en Zzz
function child({ name, x, color }, i, family) {
  const p = paint(color);
  const asleep = family.bed[i - 1];
  const cover = asleep
    ? shape(`M${x - 22} 212 L${x + 22} 212 L${x + 28} 290 L${x - 28} 290 Z`, BLANKET) + `<g fill="#ffd43b"><circle cx="${x - 8}" cy="236" r="4"/><circle cx="${x + 10}" cy="258" r="4"/><circle cx="${x - 6}" cy="274" r="3"/></g>`
      + `<path d="M${x - 22} 212 L${x + 22} 212 L${x + 23} 222 L${x - 23} 222 Z" fill="#fff" opacity="0.7"/><text x="${x + 12}" y="150" font-size="13" fill="#7c3aed">Zzz</text>`
    : '';
  return mirror(x, shape(`M${x - 29} 172 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 z`, HAIR) + `<circle cx="${x - 16}" cy="160" r="5" fill="${p.fill}" stroke="${p.line}" stroke-width="1"/>`
      + `<path d="M${x - 14} 204 C${x - 20} 225 ${x - 23} 240 ${x - 22} 252" fill="none" stroke="${p.fill}" stroke-width="11" stroke-linecap="round"/>`
      + `<path d="M${x - 9} 206 C${x - 15} 226 ${x - 18} 240 ${x - 17} 252 M${x - 19} 204 C${x - 25} 225 ${x - 28} 240 ${x - 27} 252" fill="none" stroke="${p.line}" stroke-width="1.2" stroke-linecap="round"/>`
      + hand(x - 22, 256, 5.5) + shape(`M${x - 19} 290 a10 5 0 1 0 20 0 a10 5 0 1 0 -20 0 z`, paint('#f4f4f4')))
    + shape(`M${x - 16} 198 C${x - 20} 230 ${x - 24} 258 ${x - 27} 284 Q${x} 294 ${x + 27} 284 C${x + 24} 258 ${x + 20} 230 ${x + 16} 198 Z`, p)
    + `<path d="M${x - 8} 198 L${x + 8} 198 L${x} 208 Z" fill="#fff"/>` + gloss(x - 8, 240, 4, 26)
    + head(x, 176, 17, 19)
    + shape(`M${x - 17} 174 C${x - 19} 148 ${x + 19} 148 ${x + 17} 174 C${x + 8} 162 ${x - 8} 162 ${x - 17} 174 Z`, HAIR) + gloss(x - 6, 158, 5, 2.5, -20)
    + look(x, 175, 0.75, asleep) + cover + heartsRow(hearts(family, i), x, 128) + label(name, x);
}

// het eten dat klaarstaat, op een bord rechtsboven
function mealSvg(meal) {
  const recipe = RECIPES.find((r) => r.key === meal);
  if (!recipe) return '';
  return '<ellipse cx="226" cy="64" rx="30" ry="9" fill="#fff" stroke="#e6d6f5" stroke-width="2"/>'
    + `<path d="M204 62 C210 40 242 40 248 62 Z" fill="${recipe.mix}" stroke="rgba(0,0,0,0.15)"/>`
    + `<text x="226" y="88" text-anchor="middle" font-size="10" fill="#5b4a6e">${recipe.label}</text>`;
}

// extra = wat er nog bovenop moet (wat je vasthoudt, bij de muis)
export function familySvg(family, meal, extra = '') {
  const people = MEMBERS.map((m, i) => (m.child ? child(m, i, family) : papa(m, family))).join('');
  const paints = [SHIRT, HAIR, KUFI, RED, BLANKET, paint('#3a2a4d'), paint('#f4f4f4'), ...MEMBERS.filter((m) => m.child).map((m) => paint(m.color))];
  return sceneSvg('Jouw gezin in de woonkamer', defs(paints) + ROOM + mealSvg(meal) + people + extra);
}
