// De tekeningen bij het vuur: het fornuis met de pan, de balk met de pijl, en het
// gerecht als het klaar is.
import { GOOD } from './cook.js';

const GOLD = '#e8a33d';
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
// kleur tussen a en b, t = 0 – 1
function blend(a, b, t) {
  const part = (i) => parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t;
  return `#${hex(part(1))}${hex(part(3))}${hex(part(5))}`;
}
// bleek → goudbruin → aangebrand
const baked = (heat) => (heat < GOOD[0]
  ? blend('#fbeec1', GOLD, heat / GOOD[0])
  : blend(GOLD, '#4a2c12', Math.max(0, (heat - GOOD[1]) / (1 - GOOD[1]))));
const steam = (x, y) => `<path d="M${x} ${y} q-8 -11 0 -22 t0 -22" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.75"/>`;
const star = (x, y) => `<path d="M${x} ${y} l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#ffd43b"/>`;
const dots = (list, r, fill) => `<g fill="${fill}">${list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;

const STOVE = '<rect x="30" y="226" width="240" height="114" fill="#4a4a55"/><rect x="30" y="226" width="240" height="8" fill="#6b6b78"/>'
  + '<ellipse cx="150" cy="246" rx="74" ry="13" fill="#2b2b33"/>'
  + '<g fill="#ff7a59"><path d="M100 246 l8 -16 8 16z"/><path d="M124 250 l8 -18 8 18z"/><path d="M160 250 l8 -18 8 18z"/><path d="M184 246 l8 -16 8 16z"/></g>'
  + '<g fill="#ffd43b"><path d="M128 250 l4 -9 4 9z"/><path d="M164 250 l4 -9 4 9z"/></g>';

// de balk: links nog niet goed, groen = goed, rechts te laat; de pijl loopt mee
function barSvg(heat) {
  const x = (part) => 50 + 200 * part;
  return '<rect x="50" y="34" width="200" height="16" rx="8" fill="#ffe9a8"/><rect x="234" y="34" width="16" height="16" rx="8" fill="#5d3a1a"/>'
    + `<rect x="${x(GOOD[1])}" y="34" width="${x(1) - x(GOOD[1]) - 8}" height="16" fill="#5d3a1a"/>`
    + `<rect x="${x(GOOD[0])}" y="34" width="${x(GOOD[1]) - x(GOOD[0])}" height="16" fill="#43a047"/>`
    + `<path d="M${x(heat).toFixed(1)} 32 l-8 -14 h16 z" fill="#c2419a" stroke="#fff" stroke-width="2"/>`
    + `<g font-size="10" text-anchor="middle" fill="#5b4a6e"><text x="${x(GOOD[0] / 2)}" y="64">nog niet</text>`
    + `<text x="${x((GOOD[0] + GOOD[1]) / 2)}" y="64" fill="#1b5e20">goed!</text><text x="${x((1 + GOOD[1]) / 2)}" y="64">te laat</text></g>`;
}

function panSvg(recipe, heat) {
  if (!recipe.pot) {
    return '<rect x="222" y="200" width="48" height="11" rx="5.5" fill="#33333b"/><ellipse cx="150" cy="210" rx="84" ry="22" fill="#33333b"/>'
      + `<ellipse cx="150" cy="206" rx="74" ry="17" fill="#55555f"/><ellipse cx="150" cy="205" rx="58" ry="12" fill="${baked(heat)}"/>`;
  }
  const bubbles = [[124, 150], [170, 147], [146, 155], [188, 152], [108, 152], [158, 144]].slice(0, Math.floor(heat * 7));
  const wisps = [118, 150, 182].slice(0, Math.floor(heat * 4)).map((x) => steam(x, 132)).join('');
  return '<rect x="64" y="160" width="24" height="12" rx="6" fill="#7d8796"/><rect x="212" y="160" width="24" height="12" rx="6" fill="#7d8796"/>'
    + '<path d="M84 150 L90 226 C104 240 196 240 210 226 L216 150 Z" fill="#9aa3b2"/><ellipse cx="150" cy="150" rx="66" ry="16" fill="#c5cdd8"/>'
    + `<ellipse cx="150" cy="150" rx="58" ry="12" fill="${recipe.mix}"/>${dots(bubbles, 5, 'rgba(255,255,255,0.7)')}${wisps}`;
}

// de pannenkoeken die al af zijn, op een bord naast het fornuis
function stackSvg(count, x, y, rx) {
  let cakes = '';
  for (let i = 0; i < count; i += 1) cakes += `<ellipse cx="${x}" cy="${y - i * rx * 0.2}" rx="${rx}" ry="${rx * 0.22}" fill="${GOLD}" stroke="#c98524" stroke-width="2"/>`;
  return `<ellipse cx="${x}" cy="${y + rx * 0.16}" rx="${rx * 1.35}" ry="${rx * 0.3}" fill="#fff" stroke="#e6d6f5" stroke-width="2"/>${cakes}`;
}

export function stoveSvg(recipe, round, heat) {
  return STOVE + barSvg(heat) + panSvg(recipe, heat) + (!recipe.pot && round ? stackSvg(round, 78, 304, 28) : '');
}

const BOWL = '<path d="M82 222 C86 276 124 286 150 286 C176 286 214 276 218 222 Z" fill="#fff" stroke="#e6d6f5" stroke-width="2"/><ellipse cx="150" cy="222" rx="68" ry="16" fill="#fff" stroke="#e6d6f5" stroke-width="2"/>';
const DISH = {
  pannenkoeken: () => `${stackSvg(3, 150, 252, 58)}<rect x="138" y="212" width="24" height="11" rx="3" fill="#ffe066" stroke="#e0b800"/>`,
  couscous: () => '<ellipse cx="150" cy="262" rx="88" ry="20" fill="#c0623a"/><ellipse cx="150" cy="258" rx="74" ry="14" fill="#d98a5f"/>'
    + '<path d="M92 258 C104 196 196 196 208 258 Z" fill="#f0cf7a"/>'
    + dots([[122, 236], [176, 240], [150, 222]], 8, '#ff7a59') + dots([[138, 244], [166, 226], [190, 250]], 7, '#4cd4a0') + dots([[112, 250], [156, 246], [134, 226]], 5, '#e0b872'),
  soep: (recipe) => `${BOWL}<ellipse cx="150" cy="222" rx="58" ry="12" fill="${recipe.mix}"/>`
    + dots([[128, 220], [160, 226], [176, 218]], 4, '#43a047') + dots([[142, 226], [118, 224]], 4, '#b5651d'),
};

export function dishSvg(recipe) {
  return DISH[recipe.key](recipe) + steam(126, 196) + steam(150, 188) + steam(174, 196)
    + star(60, 110) + star(232, 96) + star(240, 190) + star(54, 196)
    + '<text x="150" y="64" text-anchor="middle" font-size="26" fill="#c2419a">Klaar!</text>';
}
