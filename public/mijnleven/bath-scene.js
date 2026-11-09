// De tekeningen van de badkamer, in hetzelfde vak als de kapper (30,0 – 270,340):
// de douche (je ziet alleen het hoofd, de rest zit achter het douchescherm) en de
// spiegel (in badjas, met een handdoek om het haar).
import { face, arms, SKIN } from './doll.js';
import { STYLE_SVG } from './hair-styles.js';
import { SPOTS, washed } from './bath.js';
import { sceneSvg } from './ui.js';

const star = (x, y) => `<path d="M${x} ${y} l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#ffd43b"/>`;
const SPARKLE = star(62, 60) + star(238, 50) + star(246, 140) + star(56, 150);

const TILES = '<rect x="30" y="0" width="240" height="340" rx="14" fill="#d3efff"/>'
  + '<g stroke="#fff" stroke-width="2" opacity="0.7"><path d="M30 44h240M30 88h240M30 132h240M78 0v170M126 0v170M174 0v170M222 0v170"/></g>'
  + '<path d="M56 0v22h30" fill="none" stroke="#9aa3b2" stroke-width="7" stroke-linecap="round"/><path d="M82 12 l22 12 -7 13 -22 -12z" fill="#b8c2d0"/>';
// het douchescherm: alles onder de hals zit erachter
const SCREEN = '<rect x="30" y="170" width="240" height="170" fill="#a9dcf7"/><rect x="30" y="165" width="240" height="9" rx="4.5" fill="#fff"/>'
  + '<g fill="none" stroke="#fff" stroke-width="3" opacity="0.55"><path d="M40 200 q15 -12 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0"/>'
  + '<path d="M40 262 q15 -12 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0"/><path d="M40 322 q15 -12 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0"/></g>';

const DIRT = '<circle r="15" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="5 5"/>'
  + '<path d="M-8 3 q4 -9 8 -1 q3 6 8 -3" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>'
  + '<path d="M-8 3 q4 -9 8 -1 q3 6 8 -3" fill="none" stroke="#8d6e63" stroke-width="4.5" stroke-linecap="round"/>';
const FOAM = '<g fill="#fff" stroke="#cfe8ff" stroke-width="1.5"><circle cx="-13" cy="4" r="11"/><circle cx="12" cy="5" r="11"/><circle cx="0" cy="-7" r="13"/><circle cx="-3" cy="9" r="9"/><circle cx="7" cy="-1" r="7"/></g>';
const DROP = 'c6 9 6 16 0 16 c-6 0 -6 -7 0 -16z';
const DROPS = `<g fill="#5ec8ff" stroke="#fff" stroke-width="1.5"><path d="M-11 -10 ${DROP}"/><path d="M9 -13 ${DROP}"/><path d="M0 0 ${DROP}"/></g>`;
const MARK = [DIRT, FOAM, DROPS, ''];

const spotsSvg = (spots) => spots.map((s, i) => `<g transform="translate(${SPOTS[i][0]} ${SPOTS[i][1]})">${MARK[s]}</g>`).join('');

// extra = wat er nog bovenop moet (de spons, douche of handdoek bij de muis)
export function showerSvg(hair, bath, makeup, extra = '') {
  return sceneSvg('Jouw meisje onder de douche', TILES + STYLE_SVG[0](hair.color, hair.ends).join('')
    + `<rect x="136" y="140" width="28" height="32" fill="${SKIN}"/>` + SCREEN + face(makeup)
    + spotsSvg(bath.spots) + (washed(bath) ? SPARKLE : '') + extra);
}

const MIRROR = '<rect x="30" y="0" width="240" height="340" rx="14" fill="#ffe3f1"/>'
  + '<rect x="50" y="10" width="200" height="300" rx="96" fill="#e3f6ff" stroke="#ffd43b" stroke-width="8"/>'
  + '<path d="M82 70 C92 44 112 32 130 28" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.8"/>';
const ROBE = '#ff9ecf';
const BODY = `<path d="M110 150 L190 150 L234 340 L66 340 Z" fill="${ROBE}"/>`
  + `<path d="M134 150 L150 180 L166 150 Z" fill="${SKIN}"/><path d="M124 150 L150 204 L176 150 L164 150 L150 178 L136 150 Z" fill="#fff"/>`;
const TURBAN = '<path d="M150 20 C92 20 82 70 90 104 C112 80 188 80 210 104 C218 70 208 20 150 20 Z" fill="#fff" stroke="#e6d6f5" stroke-width="2"/>'
  + '<ellipse cx="150" cy="22" rx="26" ry="15" fill="#fff" stroke="#e6d6f5" stroke-width="2"/><path d="M106 70 C126 52 168 46 196 60" fill="none" stroke="#e6d6f5" stroke-width="3" stroke-linecap="round"/>';
const SINK = '<rect x="30" y="316" width="240" height="24" fill="#fff"/><rect x="30" y="316" width="240" height="5" fill="#e6d6f5"/>';
const MOUTH_FOAM = '<g fill="#fff" stroke="#cfe8ff" stroke-width="1.5"><circle cx="140" cy="130" r="7"/><circle cx="152" cy="134" r="8"/><circle cx="162" cy="129" r="6"/></g>';

// look = { open: mond open, clean: tanden gepoetst, foam: schuim van het poetsen }
export function mirrorSvg(makeup, look, extra = '') {
  const teeth = look.clean ? '#ffffff' : '#f0dd9a';
  return sceneSvg('Jouw meisje voor de spiegel', MIRROR + BODY + arms(ROBE) + face(makeup, look.open ? teeth : '')
    + TURBAN + (look.foam ? MOUTH_FOAM : '') + (look.clean ? star(173, 133) : '') + SINK + extra);
}
