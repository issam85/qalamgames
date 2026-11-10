// De prinsen, vrienden van de prinses op het strand: kort haar, een tuniek met lange
// mouwen, een lange broek, laarzen, een cape en een kroontje. Zelfde vak als de
// prinses (300 × 520), zelfde gezicht (zonder wimpers).
import { face } from './princess.js';
import { paint, skinPaint, svg, shape, gloss, mirror, GOLD } from './glans.js';

export const PRINCES = [
  { name: 'Adam', skin: '#e8b88f', hair: '#3a2416', eyes: '#5a3a1e', tunic: '#2f6fe0', cape: '#e53950' },
  { name: 'Yusuf', skin: '#8a5a3c', hair: '#1a100a', eyes: '#3d2a1a', tunic: '#4cd4a0', cape: '#1d2a6b' },
];

const HAIR_BACK = 'M150 58 C98 58 86 100 92 150 C98 112 120 92 150 92 C180 92 202 112 208 150 C214 100 202 58 150 58 Z';
const FRINGE = 'M106 112 C108 76 136 60 168 66 C192 72 202 94 198 114 C186 96 164 88 142 92 C128 94 116 100 106 112 Z';
const CAPE = 'M112 200 C88 300 78 420 68 492 Q150 508 232 492 C222 420 212 300 188 200 Z';
const TUNIC = 'M112 196 Q150 210 188 196 C196 250 198 300 204 362 Q150 376 96 362 C102 300 104 250 112 196 Z';

export function princeInner(i) {
  const pr = PRINCES[i];
  const skin = skinPaint(pr.skin);
  const hair = paint(pr.hair);
  const t = paint(pr.tunic);
  const cape = paint(pr.cape);
  const trousers = paint('#3a3550');
  const s = `fill="${skin.fill}" stroke="${skin.line}" stroke-width="1.4"`;
  return shape(CAPE, cape) + `<rect x="138" y="150" width="24" height="52" ${s}/>`
    + mirror(`<path d="M122 350 L120 486" stroke="${trousers.line}" stroke-width="24" stroke-linecap="round"/><path d="M122 350 L120 486" stroke="${trousers.c}" stroke-width="21" stroke-linecap="round"/>`
      + shape('M106 470 h28 v28 c0 8 -4 12 -12 12 h-22 c-10 0 -12 -10 -4 -14 z', paint('#5a3b22')))
    + shape(TUNIC, t) + gloss(132, 250, 8, 24) + shape('M100 296 Q150 310 200 296 L200 310 Q150 324 100 310 Z', GOLD)
    + `<g fill="#ffd43b">${[226, 252, 278].map((y) => `<circle cx="150" cy="${y}" r="3.5"/>`).join('')}</g>`
    + mirror(`<path d="M116 210 C100 250 92 290 90 318" fill="none" stroke="${t.line}" stroke-width="24" stroke-linecap="round"/>`
      + `<path d="M116 210 C100 250 92 290 90 318" fill="none" stroke="${t.c}" stroke-width="21" stroke-linecap="round"/>`
      + `<circle cx="90" cy="330" r="12" ${s}/>`)
    + mirror(shape('M110 196 C120 188 134 186 144 192 L140 206 C130 202 120 204 112 210 Z', cape))
    + shape(HAIR_BACK, hair) + face(pr, skin, false) + shape(FRINGE, hair) + gloss(140, 78, 16, 6, -10)
    + shape('M124 70 L128 50 L140 62 L150 44 L160 62 L172 50 L176 70 Q150 62 124 70 Z', GOLD) + '<circle cx="150" cy="58" r="4" fill="#ff5fa2"/>';
}

export const princeSvg = (i) => svg('0 0 300 520', `Prins ${PRINCES[i].name}`, princeInner(i));
