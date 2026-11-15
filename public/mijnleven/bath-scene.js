// De tekeningen van de badkamer, in hetzelfde vak als de kapper (30,0 – 270,340):
// de douche (je ziet alleen het hoofd, de rest zit achter het douchescherm) en de
// spiegel (in badjas, met een handdoek om het haar).
import { face, arms, SKIN } from './doll.js';
import { paint, defs, shape, gloss } from './glans.js';
import { wall, tiles, grad, glow, star, sparkles } from './decor.js';
import { STYLE_SVG } from './hair-styles.js';
import { SPOTS, washed } from './bath.js';
import { sceneSvg } from './ui.js';

const SPARKLE = star(62, 60) + star(238, 50) + star(246, 140) + star(56, 150) + sparkles([[120, 30, 5], [200, 150, 4]]);

// de douchemuur: tegels, de douchekop met water en een plankje met flesjes
const TILES = wall('#cfe9ff') + tiles(0, 192, '#a9dcf7', 40) + grad('chroom', '#f4f7fa', '#8f9aa8', 0.3, 1)
  + '<path d="M56 0 v24 h30" fill="none" stroke="#7d8796" stroke-width="9" stroke-linecap="round"/><path d="M56 0 v24 h30" fill="none" stroke="#dfe6ee" stroke-width="5" stroke-linecap="round"/>'
  + '<path d="M84 12 l26 14 -8 15 -26 -14 z" fill="url(#g-chroom)" stroke="#7d8796" stroke-width="1.5" stroke-linejoin="round"/>'
  + '<g stroke="#8ad8ff" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9" opacity="0.8"><path d="M96 40 L124 96"/><path d="M104 44 L140 98"/><path d="M110 40 L156 96"/></g>'
  + '<rect x="214" y="56" width="48" height="6" rx="3" fill="#fff" stroke="#b9d4e8" stroke-width="1.5"/>'
  + `<rect x="220" y="30" width="12" height="26" rx="4" fill="${paint('#ff8ac8').fill}" stroke="#c2419a" stroke-width="1.2"/><rect x="223" y="26" width="6" height="6" rx="1.5" fill="#c2419a"/>`
  + `<rect x="240" y="36" width="14" height="20" rx="4" fill="${paint('#4cd4a0').fill}" stroke="#1e8f84" stroke-width="1.2"/><rect x="244" y="31" width="6" height="6" rx="1.5" fill="#1e8f84"/>`;
// het douchescherm: alles onder de hals zit erachter
const SCREEN = grad('glas', '#eaf8ff', '#a9dcf7') + '<rect x="30" y="192" width="240" height="148" fill="url(#g-glas)" opacity="0.95"/>'
  + '<g stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.5"><path d="M64 204 L50 332"/><path d="M80 204 L68 332"/><path d="M246 204 L252 332"/></g>'
  + '<g fill="none" stroke="#fff" stroke-width="3" opacity="0.55"><path d="M40 222 q15 -12 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0"/>'
  + '<path d="M40 274 q15 -12 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0"/><path d="M40 326 q15 -12 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0"/></g>'
  + '<rect x="30" y="186" width="240" height="11" rx="5.5" fill="url(#g-chroom)" stroke="#7d8796" stroke-width="1.2"/>';

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
  const p = paint(hair.color);
  return sceneSvg('Jouw meisje onder de douche', defs([p, paint('#ff8ac8'), paint('#4cd4a0')]) + TILES + STYLE_SVG[0](p, hair.ends).join('')
    + `<rect x="136" y="160" width="28" height="40" fill="${SKIN}"/>` + SCREEN + face(makeup)
    + spotsSvg(bath.spots) + (washed(bath) ? SPARKLE : '') + extra);
}

const MIRROR = wall('#ffe3f1') + tiles(236, 340, '#ffd1ec', 32) + grad('spiegel', '#f2fbff', '#bfe3ff') + glow('schijn', '#fff3b0')
  + '<ellipse cx="44" cy="80" rx="22" ry="16" fill="url(#g-schijn)"/><ellipse cx="256" cy="80" rx="22" ry="16" fill="url(#g-schijn)"/>'
  + '<g fill="#fff8d6" stroke="#c9a400" stroke-width="1.5"><circle cx="44" cy="78" r="7"/><circle cx="256" cy="78" r="7"/></g><g stroke="#c9a400" stroke-width="3" stroke-linecap="round"><path d="M44 85 v12"/><path d="M256 85 v12"/></g>'
  + '<rect x="50" y="10" width="200" height="300" rx="96" fill="url(#g-spiegel)" stroke="#c9a400" stroke-width="11"/><rect x="50" y="10" width="200" height="300" rx="96" fill="none" stroke="#ffd43b" stroke-width="7"/>'
  + '<path d="M82 70 C92 44 112 32 130 28" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.8"/>';
const ROBE = paint('#ff9ecf');
const BODY = shape('M112 196 C104 230 106 256 100 290 C86 320 72 340 66 340 L234 340 C228 340 214 320 200 290 C194 256 196 230 188 196 Z', ROBE)
  + `<path d="M134 196 L150 226 L166 196 Z" fill="${SKIN}"/><path d="M124 196 L150 250 L176 196 L164 196 L150 224 L136 196 Z" fill="#fff" stroke="#e6d6f5" stroke-width="1.5"/>` + gloss(126, 300, 10, 30);
const TURBAN = '<g transform="translate(0 12)"><path d="M150 20 C92 20 82 70 90 104 C112 80 188 80 210 104 C218 70 208 20 150 20 Z" fill="#fff" stroke="#e6d6f5" stroke-width="2"/>'
  + '<ellipse cx="150" cy="22" rx="26" ry="15" fill="#fff" stroke="#e6d6f5" stroke-width="2"/><path d="M106 70 C126 52 168 46 196 60" fill="none" stroke="#e6d6f5" stroke-width="3" stroke-linecap="round"/></g>';
const SINK = grad('wastafel', '#ffffff', '#e6eef7') + '<rect x="30" y="316" width="240" height="24" fill="url(#g-wastafel)"/><rect x="30" y="316" width="240" height="4" fill="#fff"/>'
  + '<rect x="40" y="292" width="18" height="26" rx="5" fill="#fff" stroke="#e6d6f5" stroke-width="2"/><path d="M46 294 L44 274" stroke="#ff8ac8" stroke-width="4" stroke-linecap="round"/><path d="M52 294 L54 276" stroke="#5ec8ff" stroke-width="4" stroke-linecap="round"/>'
  + `<rect x="240" y="286" width="16" height="30" rx="5" fill="${paint('#b36bff').fill}" stroke="#7c3aed" stroke-width="1.2"/><rect x="245" y="280" width="6" height="8" rx="2" fill="#7c3aed"/>`;
const MOUTH_FOAM = '<g fill="#fff" stroke="#cfe8ff" stroke-width="1.5"><circle cx="140" cy="152" r="7"/><circle cx="152" cy="156" r="8"/><circle cx="162" cy="151" r="6"/></g>';

// look = { open: mond open, clean: tanden gepoetst, foam: schuim van het poetsen }
export function mirrorSvg(makeup, look, extra = '') {
  const teeth = look.clean ? '#ffffff' : '#f0dd9a';
  return sceneSvg('Jouw meisje voor de spiegel', defs([ROBE, paint('#b36bff')]) + MIRROR + BODY + arms(ROBE) + face(makeup, look.open ? teeth : '')
    + TURBAN + (look.foam ? MOUTH_FOAM : '') + (look.clean ? star(173, 155) : '') + SINK + extra);
}
