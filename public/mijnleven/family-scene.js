// De tekening van de woonkamer: papa en de twee dochters voor de bank, met hun
// hartjes erboven, en het eten uit de keuken als dat klaarstaat.
import { SKIN } from './doll.js';
import { RECIPES } from './recipes.js';
import { MEMBERS, hearts } from './family.js';
import { sceneSvg } from './ui.js';

const HAIR = '#3b2314';
const ROOM = '<rect x="30" y="0" width="240" height="340" rx="14" fill="#ffeef6"/>'
  + '<rect x="126" y="14" width="48" height="46" rx="6" fill="#bfe6ff" stroke="#fff" stroke-width="4"/><path d="M150 14v46M126 37h48" stroke="#fff" stroke-width="3"/>'
  + '<rect x="30" y="262" width="240" height="78" fill="#e7c9a0"/><ellipse cx="150" cy="306" rx="106" ry="22" fill="#ff9ecf" opacity="0.7"/>'
  + '<rect x="44" y="176" width="212" height="96" rx="22" fill="#b79cf2"/><rect x="44" y="228" width="212" height="44" rx="14" fill="#a384ea"/>';

const heart = (x, y, full) => `<path d="M${x} ${y} c-7 -8 -14 2 0 12 c14 -10 7 -20 0 -12z" fill="${full ? '#e53935' : '#fff'}" stroke="${full ? '#b71c1c' : '#c9b8d8'}" stroke-width="2"/>`;
const heartsRow = (list, x, y) => list.map((full, j) => heart(x + (j - (list.length - 1) / 2) * 16, y, full)).join('');
const eyes = (x, y, gap) => `<circle cx="${x - gap}" cy="${y}" r="3" fill="#3a2a2a"/><circle cx="${x + gap}" cy="${y}" r="3" fill="#3a2a2a"/>`;
const smile = (x, y, w) => `<path d="M${x - w} ${y} Q${x} ${y + w} ${x + w} ${y}" fill="none" stroke="#c0392b" stroke-width="2.5" stroke-linecap="round"/>`;
const label = (name, x) => `<text x="${x}" y="326" text-anchor="middle" font-size="12" fill="#5b4a6e">${name}</text>`;
// links en rechts hetzelfde, gespiegeld rond x
const mirror = (x, one) => `${one}<g transform="translate(${2 * x} 0) scale(-1 1)">${one}</g>`;

function papa({ name, x }, family) {
  const shirt = '#4f7fd9';
  return mirror(x, `<path d="M${x - 24} 128 L${x - 40} 222 L${x - 29} 226 L${x - 16} 150 Z" fill="${shirt}" stroke="rgba(0,0,0,0.1)"/><circle cx="${x - 35}" cy="228" r="8" fill="${SKIN}"/>`
      + `<ellipse cx="${x - 14}" cy="296" rx="14" ry="6" fill="#3a2a4d"/>`)
    + `<path d="M${x - 26} 124 L${x + 26} 124 L${x + 34} 292 L${x - 34} 292 Z" fill="${shirt}"/>`
    + `<ellipse cx="${x}" cy="96" rx="22" ry="25" fill="${SKIN}"/>`
    + `<path d="M${x - 22} 92 C${x - 24} 60 ${x + 24} 60 ${x + 22} 92 C${x + 10} 78 ${x - 10} 78 ${x - 22} 92 Z" fill="${HAIR}"/>`
    + `<path d="M${x - 21} 100 C${x - 20} 130 ${x + 20} 130 ${x + 21} 100 C${x + 12} 118 ${x - 12} 118 ${x - 21} 100 Z" fill="${HAIR}"/>`
    + eyes(x, 94, 8) + smile(x, 105, 6) + heartsRow(hearts(family, 0), x, 44) + label(name, x);
}

// een dochter; als ze slaapt: ogen dicht, een dekentje en Zzz
function child({ name, x, color }, i, family) {
  const asleep = family.bed[i - 1];
  const face = asleep
    ? mirror(x, `<path d="M${x - 10} 176 q3.5 4 7 0" fill="none" stroke="#3a2a2a" stroke-width="2.5" stroke-linecap="round"/>`)
      + `<text x="${x + 12}" y="150" font-size="13" fill="#7c3aed">Zzz</text>`
    : eyes(x, 175, 6.5) + smile(x, 184, 5);
  const cover = asleep
    ? `<path d="M${x - 22} 212 L${x + 22} 212 L${x + 28} 290 L${x - 28} 290 Z" fill="#b36bff"/><g fill="#ffd43b"><circle cx="${x - 8}" cy="236" r="4"/><circle cx="${x + 10}" cy="258" r="4"/><circle cx="${x - 6}" cy="274" r="3"/></g>`
    : '';
  return mirror(x, `<circle cx="${x - 20}" cy="172" r="9" fill="${HAIR}"/><circle cx="${x - 16}" cy="160" r="5" fill="${color}"/>`
      + `<path d="M${x - 14} 202 L${x - 26} 252 L${x - 18} 255 L${x - 8} 216 Z" fill="${color}" stroke="rgba(0,0,0,0.1)"/><circle cx="${x - 22}" cy="256" r="6" fill="${SKIN}"/>`
      + `<ellipse cx="${x - 9}" cy="290" rx="10" ry="5" fill="#fff" stroke="#c9b8d8"/>`)
    + `<path d="M${x - 16} 198 L${x + 16} 198 L${x + 26} 284 L${x - 26} 284 Z" fill="${color}"/>`
    + `<ellipse cx="${x}" cy="176" rx="17" ry="19" fill="${SKIN}"/>`
    + `<path d="M${x - 17} 174 C${x - 19} 148 ${x + 19} 148 ${x + 17} 174 C${x + 8} 162 ${x - 8} 162 ${x - 17} 174 Z" fill="${HAIR}"/>`
    + face + cover + heartsRow(hearts(family, i), x, 128) + label(name, x);
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
  return sceneSvg('Jouw gezin in de woonkamer', ROOM + mealSvg(meal) + people + extra);
}
