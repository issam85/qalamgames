// Het haar bij de kapper: kapsels, lengtes, knopen, de hoed en de tekening van hoofd
// en schouders (zelfde vak als het meisje, ingezoomd op 30,0 – 270,340).
import { JURK, HOOFDDOEK } from './doll-parts.js';
import { face, arms, soft } from './doll.js';
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
export const SPOTS = [[101, 98], [199, 98], [110, 64], [190, 64], [135, 44], [165, 44]];
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

const SHINE = '<path d="M112 70 C122 50 150 42 172 48" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="6" stroke-linecap="round"/>'
  + '<g fill="#ffd43b"><path d="M70 60 l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z"/><path d="M232 46 l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z"/><path d="M240 150 l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z"/></g>';

// wat er op je hoofd kan: hair.hat is het nummer hierin (0 = niets). Vanaf 2 koop je
// ze in de winkel (shop.js)
export const HATS = [
  ['Niets', ''],
  ['Hoed', '<ellipse cx="150" cy="62" rx="92" ry="18" fill="#f3d9a4"/><path d="M104 62 C104 14 196 14 196 62 Z" fill="#f7e3b8"/>'
    + '<path d="M105 56 C120 50 180 50 195 56 L196 64 C180 58 120 58 104 64 Z" fill="#ff8ac8"/>'],
  ['Haarband', '<path d="M102 76 C118 48 182 48 198 76" fill="none" stroke="#ff8ac8" stroke-width="11" stroke-linecap="round"/>'],
  ['Strik', '<g fill="#ff8ac8" stroke="#fff" stroke-width="2"><path d="M150 42 L118 26 L120 60 Z"/><path d="M150 42 L182 26 L180 60 Z"/><circle cx="150" cy="42" r="8"/></g>'],
  ['Bloem', '<g fill="#fff"><circle cx="196" cy="48" r="9"/><circle cx="210" cy="58" r="9"/><circle cx="204" cy="74" r="9"/><circle cx="188" cy="74" r="9"/><circle cx="182" cy="58" r="9"/></g><circle cx="196" cy="61" r="7" fill="#ffd43b"/>'],
  ['Diadeem', '<path d="M104 70 C120 46 180 46 196 70" fill="none" stroke="#ffd43b" stroke-width="6" stroke-linecap="round"/><g fill="#5ec8ff" stroke="#fff" stroke-width="1.5"><circle cx="150" cy="47" r="6"/><circle cx="128" cy="52" r="4"/><circle cx="172" cy="52" r="4"/></g>'],
];

// hoofd en schouders; extra = wat er nog bovenop moet (het gereedschap bij de muis)
export function bustSvg(outfit, hair, makeup, extra = '') {
  const { choice, color } = outfit;
  const jurk = soft(color.jurk);
  const [back, front] = hair.hijab ? ['', ''] : STYLE_SVG[hair.style](hair.color, hair.ends);
  const top = hair.hijab
    ? HOOFDDOEK[choice.hoofddoek](soft(color.hoofddoek)) + face(makeup)
    : front + face(makeup) + knotsSvg(hair) + (hair.shine ? SHINE : '') + HATS[hair.hat][1];
  return `<svg viewBox="${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}" role="img" aria-label="Jouw meisje bij de kapper">`
    + back + JURK[choice.jurk](jurk) + arms(jurk) + top + extra + '</svg>';
}
