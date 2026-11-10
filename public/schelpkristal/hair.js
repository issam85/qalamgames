// Het lange haar van de prinsessen, in drie lagen: achter het lijf, achter het gezicht
// (de kruin) en vóór het gezicht (pony en lokken over de schouders). Hoofd rond
// (150, 118), vak 300 × 520. p = de verf van het haar (paint uit glans.js).
import { shape, gloss, mirror, dots } from './glans.js';

const BACK = {
  golf: 'M150 56 C86 56 72 118 80 180 C84 230 66 262 76 300 C86 330 70 350 84 372 Q150 392 216 372 C230 350 214 330 224 300 C234 262 216 230 220 180 C228 118 214 56 150 56 Z',
  steil: 'M150 56 C86 56 76 118 80 190 L78 372 Q150 386 222 372 L220 190 C224 118 214 56 150 56 Z',
  krul: 'M150 50 C74 50 58 120 64 190 C68 260 56 300 70 340 Q150 372 230 340 C244 300 232 260 236 190 C242 120 226 50 150 50 Z',
  vlecht: 'M150 56 C88 56 78 118 84 186 L216 186 C222 118 212 56 150 56 Z',
};
const CROWN = 'M150 58 C96 58 82 104 88 160 L212 160 C218 104 204 58 150 58 Z';
const FRINGE = 'M106 116 C102 80 126 62 156 63 C188 65 200 92 196 120 C188 100 172 90 156 93 C140 97 128 93 121 85 C117 98 112 106 106 116 Z';

// lokken die vóór de schouders vallen (links; rechts is gespiegeld)
const LOCK = {
  golf: 'M110 120 C96 150 106 180 96 210 C86 240 104 262 96 296 C112 286 120 264 114 238 C110 214 124 190 118 156 Z',
  steil: 'M110 120 C102 160 98 220 96 300 L116 296 C116 230 118 170 120 140 Z',
};
const curls = (list, p) => `<g fill="${p.fill}" stroke="${p.line}" stroke-width="1.5">${dots(list, 13)}</g>`;
const shine = (d) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.32"/>`;

// een vlecht over de linkerschouder: blokjes die om en om kantelen
function braid(p) {
  const parts = Array.from({ length: 9 }, (_, i) => {
    const y = 168 + i * 19;
    const x = 104 + Math.sin(i * 0.5) * 3;
    return `<ellipse cx="${x.toFixed(1)}" cy="${y}" rx="${15 - i * 0.6}" ry="12" transform="rotate(${i % 2 ? 22 : -22} ${x.toFixed(1)} ${y})" fill="${p.fill}" stroke="${p.line}" stroke-width="1.5"/>`;
  }).join('');
  return `<path d="M112 120 C100 140 100 160 104 172" fill="none" stroke="${p.line}" stroke-width="22" stroke-linecap="round"/>`
    + `<path d="M112 120 C100 140 100 160 104 172" fill="none" stroke="${p.fill}" stroke-width="19" stroke-linecap="round"/>`
    + `${parts}<circle cx="106" cy="336" r="7" fill="#ff8ac8" stroke="#c2419a" stroke-width="1.5"/>`
    + shape('M106 340 L94 368 L106 362 L118 368 Z', p);
}

export function hairBack(style, p) {
  let extra = '';
  if (style === 'krul') extra = curls([[78, 330], [104, 350], [132, 358], [168, 358], [196, 350], [222, 330], [62, 270], [238, 270], [64, 210], [236, 210]], p);
  return shape(BACK[style], p) + extra + (style === 'vlecht' ? '' : shine('M92 200 C88 250 90 300 96 350'));
}

export function hairCrown(p) {
  return shape(CROWN, p) + shine('M116 86 C128 70 150 64 172 70');
}

export function hairFront(style, p) {
  let locks;
  if (style === 'krul') locks = mirror(curls([[106, 150], [100, 178], [102, 206], [96, 234], [100, 262]], p));
  else if (style === 'vlecht') locks = braid(p) + shape('M190 120 C200 150 198 170 192 188 C186 170 186 150 184 130 Z', p);
  else locks = mirror(shape(LOCK[style], p) + shine('M106 160 C102 200 100 240 100 280'));
  return locks + shape(FRINGE, p) + gloss(140, 80, 18, 7, -10) + shine('M128 76 C140 70 160 68 176 74');
}
