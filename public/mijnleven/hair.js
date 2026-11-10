// Het haar bij de kapper: kapsels, lengtes, knopen, de hoed en de tekening van hoofd
// en schouders (zelfde vak als het meisje, ingezoomd op 30,0 – 270,340).
import { JURK, HOOFDDOEK } from './doll-parts.js';
import { face, arms, soft } from './doll.js';
import { paint, defs, shape } from './glans.js';
import { STYLE_SVG, STRAND_X, MAX_END } from './hair-styles.js';

// naam en waar het kapsel handig voor is
export const STYLES = [
  ['Los', 'Los haar: fijn om te spelen met je dochters.'],
  ['Staart', 'Een staart: handig als je eten gaat maken.'],
  ['Vlechten', 'Twee vlechten: maak de scheiding met de puntkam.'],
  ['Hoge knot', 'Een hoge knot: netjes en snel klaar.'],
  ['Lage knot', 'Een lage knot: die past onder je hoed.'],
  ['Bruiloft', 'Bruiloftshaar: prachtig voor een feest.'],
];
export const VLECHTEN = 2;
export const HAIR_COLORS = [
  ['#3b2314', 'donkerbruin'], ['#7a4a21', 'bruin'], ['#1a1a1a', 'zwart'],
  ['#d9a066', 'blond'], ['#a83a2a', 'rood'], ['#ff8ac8', 'roze'],
];
// waar de knopen zitten, en hoe vaak je erover moet borstelen
export const SPOTS = [[98, 120], [202, 120], [108, 84], [192, 84], [134, 69], [166, 69]];
export const KNOT_HP = 2;
const GROW = 50; // zoveel groeit een geknipte lok per dag terug
export const VIEW = { x: 30, y: 0, w: 240, h: 340 };

export function freshHair() {
  return { style: 0, color: '#3b2314', ends: STRAND_X.map(() => MAX_END), knots: SPOTS.map(() => KNOT_HP), shine: false, hijab: false, hat: 0, day: '' };
}

// elke nieuwe dag zit je haar weer in de knoop en is het een stukje gegroeid
export function newDay(hair, today) {
  if (hair.day === today) return hair;
  return {
    ...hair, knots: SPOTS.map(() => KNOT_HP), shine: false, hijab: false, hat: 0,
    ends: hair.ends.map((end) => Math.min(MAX_END, end + GROW)), day: today,
  };
}

export const knotsLeft = (hair) => hair.knots.filter((hp) => hp > 0).length;

const KNOT = 'M-12 0 c4 -8 8 8 12 0 c4 -8 8 8 12 0';

function knotsSvg(hair) {
  return SPOTS.map(([x, y], i) => {
    if (hair.knots[i] <= 0) return '';
    // hoe meer je borstelt of kamt, hoe kleiner de knoop
    const size = (0.45 + 0.55 * (hair.knots[i] / KNOT_HP)).toFixed(2);
    return `<g transform="translate(${x} ${y}) scale(${size})"><path d="${KNOT}" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="7" stroke-linecap="round"/><path d="${KNOT}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`;
  }).join('');
}

// part = hoe ver je bent met föhnen (0 – 1)
export const shineSvg = (part) => `<g opacity="${part.toFixed(2)}">${SHINE}</g>`;

const SHINE = '<path d="M110 98 C120 78 150 70 172 76" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="6" stroke-linecap="round"/>'
  + '<g fill="#ffd43b"><path d="M70 88 l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z"/><path d="M232 74 l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z"/><path d="M240 178 l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z"/></g>';

// wat er op je hoofd kan: hair.hat is het nummer hierin (0 = niets). Vanaf 2 koop je
// ze in de winkel (shop.js)
const PINK = paint('#ff8ac8');
export const HATS = [
  ['Niets', ''],
  ['Hoed', shape('M58 76 a92 18 0 1 0 184 0 a92 18 0 1 0 -184 0 z', paint('#f3d9a4')) + shape('M102 76 C102 26 198 26 198 76 Z', paint('#f7e3b8'))
    + shape('M103 70 C120 64 180 64 197 70 L198 78 C180 72 120 72 102 78 Z', PINK)],
  ['Haarband', `<path d="M100 104 C116 74 184 74 200 104" fill="none" stroke="${PINK.line}" stroke-width="13" stroke-linecap="round"/><path d="M100 104 C116 74 184 74 200 104" fill="none" stroke="${PINK.fill}" stroke-width="10" stroke-linecap="round"/>`],
  ['Strik', `<g fill="${PINK.fill}" stroke="${PINK.line}" stroke-width="1.5" stroke-linejoin="round"><path d="M150 70 L118 54 L120 88 Z"/><path d="M150 70 L182 54 L180 88 Z"/><circle cx="150" cy="70" r="8"/></g>`],
  ['Bloem', '<g fill="#fff"><circle cx="198" cy="62" r="9"/><circle cx="212" cy="72" r="9"/><circle cx="206" cy="88" r="9"/><circle cx="190" cy="88" r="9"/><circle cx="184" cy="72" r="9"/></g><circle cx="198" cy="75" r="7" fill="#ffd43b"/>'],
  ['Diadeem', '<path d="M102 98 C118 72 182 72 198 98" fill="none" stroke="#ffd43b" stroke-width="6" stroke-linecap="round"/><g fill="#5ec8ff" stroke="#fff" stroke-width="1.5"><circle cx="150" cy="73" r="6"/><circle cx="128" cy="78" r="4"/><circle cx="172" cy="78" r="4"/></g>'],
];

// hoofd en schouders; extra = wat er nog bovenop moet (het gereedschap bij de muis)
export function bustSvg(outfit, hair, makeup, extra = '') {
  const { choice, color } = outfit;
  const jurk = paint(soft(color.jurk));
  const doek = paint(soft(color.hoofddoek));
  const [back, front] = hair.hijab ? ['', ''] : STYLE_SVG[hair.style](paint(hair.color), hair.ends);
  const top = hair.hijab
    ? HOOFDDOEK[choice.hoofddoek](doek) + face(makeup)
    : front + face(makeup) + knotsSvg(hair) + (hair.shine ? SHINE : '') + HATS[hair.hat][1];
  return `<svg viewBox="${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}" role="img" aria-label="Jouw meisje bij de kapper">`
    + defs([jurk, doek, paint(hair.color), paint('#ff8ac8'), paint('#f3d9a4'), paint('#f7e3b8')])
    + back + JURK[choice.jurk](jurk) + arms(jurk) + top + extra + '</svg>';
}
