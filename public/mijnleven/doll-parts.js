// De tekeningen van de kleren, als SVG-stukjes in een vak van 300 × 520. Per
// categorie één functie per soort (zelfde volgorde als in data.js); p = de verf
// (paint uit glans.js). Schouders op 196, handen op (90, 330) en (210, 330).
import { shape, gloss, sparkle, mirror, WHITE, GOLD, light } from './glans.js';

const DRESS = 'M112 196 C104 230 106 256 100 290 C84 360 66 430 62 478 Q150 514 238 478 C234 430 216 360 200 290 C194 256 196 230 188 196 Z';
const WIDE = 'M112 196 C104 230 106 256 98 290 C76 360 48 430 40 478 Q150 520 260 478 C252 430 224 360 202 290 C194 256 196 230 188 196 Z';
const HIJAB = 'M150 62 C100 62 82 104 86 160 C88 190 80 210 96 228 C120 240 180 240 204 228 C220 210 212 190 214 160 C218 104 200 62 150 62 Z';
const STAR = 'l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z';
const dots = (list, r) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
// links en rechts hetzelfde: de tweede is 60 opgeschoven (de andere voet)
const pair = (one) => `${one}<g transform="translate(60 0)">${one}</g>`;
// een vorm met plooien, een schaduw bij de zoom en een glanzende baan
const folds = (d, p) => shape(d, p)
  + '<path d="M126 215 Q116 350 96 486" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.28"/>'
  + '<path d="M176 220 Q188 350 210 486" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round" opacity="0.07"/>'
  + '<path d="M66 480 Q150 518 234 480" fill="none" stroke="#000" stroke-width="10" opacity="0.07"/>' + gloss(132, 280, 12, 46);
const clip = (id, d, inner) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
const flower = ([x, y]) => `<g fill="#fff" opacity="0.9">${dots([[x - 6, y - 3], [x + 6, y - 3], [x - 4, y + 6], [x + 4, y + 6], [x, y - 7]], 4.5)}</g><circle cx="${x}" cy="${y}" r="3.5" fill="#ffd43b"/>`;

// De baljurk (soort GOWN): lijfje met een riem, lichte rok met kant langs de zoom en
// aan beide kanten een opgenomen pand in de hoofdkleur met een lichte binnenkant.
// Bij deze jurk zijn de tas en de schoenen niet te zien; gownTop() tekent de
// pofmouwen bovenop de hoofddoek.
export const GOWN = 6;
const BALL = 'M112 196 C104 230 108 260 118 300 C80 360 40 430 30 486 Q150 526 270 486 C260 430 220 360 182 300 C192 260 196 230 188 196 Z';
const hemPoint = (t) => [(1 - t) ** 2 * 30 + 2 * (1 - t) * t * 150 + t * t * 270, (1 - t) ** 2 * 486 + 2 * (1 - t) * t * 526 + t * t * 486 - 5];
function ballGown(p) {
  const lt = { ...p, fill: light(p.c, 0.55) };
  const lace = Array.from({ length: 9 }, (_, i) => hemPoint(0.2 + i * 0.075));
  return shape(BALL, lt) + shape('M112 196 C104 230 108 260 118 300 L182 300 C192 260 196 230 188 196 Z', p)
    + `<path d="M126 196 L174 196 L150 226 Z" fill="${lt.fill}"/><path d="M116 294 Q150 308 184 294 L184 306 Q150 320 116 306 Z" fill="${p.line}" opacity="0.6"/>`
    + mirror(shape('M118 300 C98 350 76 410 36 482 C66 476 94 470 112 456 C112 400 116 350 118 300 Z', p)
      + `<path d="M36 482 C66 476 94 470 112 456 C104 480 76 492 44 494 Z" fill="${lt.fill}" stroke="${p.line}" stroke-width="1.2"/>`
      + '<path d="M112 310 C104 360 90 420 60 470" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.3"/>')
    + `<g fill="#fff" stroke="${p.line}" stroke-width="0.8">${dots(lace, 5)}</g>` + gloss(150, 400, 16, 50)
    + sparkle(70, 400, 6) + sparkle(236, 330, 6) + sparkle(200, 460, 5) + sparkle(96, 470, 4);
}
export const gownTop = (p) => mirror(`<ellipse cx="108" cy="212" rx="22" ry="17" fill="${light(p.c, 0.55)}" stroke="${p.line}" stroke-width="1.5"/>` + gloss(100, 206, 9, 6, -30));

export const JURK = [
  (p) => folds(DRESS, p),
  (p) => folds(DRESS, p) + [[134, 290], [172, 332], [118, 404], [188, 424], [150, 372], [146, 250], [106, 464], [196, 472]].map(flower).join(''),
  (p) => shape('M112 196 C104 230 106 256 102 300 L198 300 C194 256 196 230 188 196 Z', WHITE) + folds('M100 300 C84 360 66 430 62 478 Q150 514 238 478 C234 430 216 360 200 300 Z', p)
    + shape('M100 296 L200 296 L200 308 L100 308 Z', GOLD),
  (p) => folds(WIDE, p) + `<g fill="#ffd43b"><path d="M120 300 ${STAR}"/><path d="M190 360 ${STAR}"/><path d="M130 440 ${STAR}"/><path d="M200 450 ${STAR}"/></g>` + sparkle(72, 420, 6) + sparkle(228, 330, 5),
  (p) => folds(DRESS, p) + clip('cstreep', DRESS, `<g fill="#fff" opacity="0.55">${[240, 300, 360, 420, 480].map((y) => `<rect x="30" y="${y}" width="240" height="14"/>`).join('')}</g>`),
  (p) => folds(DRESS, WHITE) + mirror(shape('M112 196 L138 196 L136 300 L124 440 L78 440 C80 400 90 340 100 290 C106 256 104 230 112 196 Z', p))
    + `<g fill="${light(p.c, 0.5)}">${dots([[130, 330], [128, 370], [126, 410]], 4)}</g>`,
  (p) => ballGown(p),
];

// de hoofddoek: de schaduw langs het gezicht, een lichte plooi en een glanzende plek
const wrapped = (d, p) => shape(d, p)
  + '<path d="M150 70 C116 72 94 110 92 166" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.35"/>'
  + '<path d="M206 96 C214 130 212 170 206 220" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round" opacity="0.09"/>'
  + '<ellipse cx="150" cy="122" rx="47" ry="53" fill="rgba(60,20,60,0.2)"/>' + gloss(114, 92, 22, 12, -40);
const bow = (x, y, p) => `<g fill="${p.fill}" stroke="${p.line}" stroke-width="1.5" stroke-linejoin="round"><path d="M${x} ${y} l-20 -14 2 30 Z"/><path d="M${x} ${y} l22 -12 -4 30 Z"/><circle cx="${x}" cy="${y}" r="6"/></g>`;

export const HOOFDDOEK = [
  (p) => wrapped(HIJAB, p),
  (p) => wrapped(HIJAB, p) + bow(208, 88, p),
  (p) => wrapped('M150 62 C100 62 82 104 86 160 C84 240 90 300 98 334 L202 334 C210 300 216 240 214 160 C218 104 200 62 150 62 Z', p),
  (p) => shape('M150 58 C102 58 86 100 90 148 L210 148 C214 100 198 58 150 58 Z', p) + '<path d="M92 118 C120 98 180 98 208 118" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.8"/>' + gloss(118, 84, 18, 10, -40),
  (p) => wrapped(HIJAB, p) + `<g fill="#fff">${dots([[204, 70], [218, 82], [212, 98], [196, 98], [190, 82]], 9)}</g><circle cx="204" cy="86" r="7" fill="#ffd43b"/>`,
  (p) => wrapped(HIJAB, p) + '<ellipse cx="150" cy="120" rx="51" ry="57" fill="#fff"/>',
  (p) => wrapped(HIJAB, p) + `<g fill="#fff" stroke="#ffd43b" stroke-width="1.5">${dots([[150, 66], [126, 72], [174, 72], [110, 90], [190, 90], [100, 112], [200, 112]], 5)}</g>`,
];

const SOLE = 'M100 484 h40 a12 12 0 0 1 0 24 h-40 a12 12 0 0 1 0 -24 z';
export const SCHOENEN = [
  (p) => pair(shape(SOLE, p) + '<path d="M100 500 h40" stroke="#fff" stroke-width="4" opacity="0.8"/><path d="M110 490 l20 0 M112 494 l16 0" stroke="#fff" stroke-width="2" opacity="0.7"/>'),
  (p) => pair(shape('M98 498 a22 10 0 1 0 44 0 a22 10 0 1 0 -44 0 z', p) + '<circle cx="120" cy="492" r="4" fill="#fff"/>'),
  (p) => pair(shape('M102 452 h36 a9 9 0 0 1 9 9 v38 a9 9 0 0 1 -9 9 h-36 a9 9 0 0 1 -9 -9 v-38 a9 9 0 0 1 9 -9 z', p) + gloss(112, 470, 5, 14)),
  (p) => pair(shape('M98 496 h44 a6 6 0 0 1 0 12 h-44 a6 6 0 0 1 0 -12 z', p) + `<path d="M104 496 L120 480 L136 496" fill="none" stroke="${p.c}" stroke-width="5" stroke-linecap="round"/>`),
  (p) => pair(shape('M100 488 L142 500 L142 508 L112 508 Z', p) + shape('M100 488 h7 v20 h-7 z', p)),
  (p) => pair(shape('M96 500 h48 a4 4 0 0 1 0 8 h-48 a4 4 0 0 1 0 -8 z', p) + shape('M110 490 h22 a5 5 0 0 1 0 10 h-22 a5 5 0 0 1 0 -10 z', p)),
  (p) => pair(shape(SOLE, p) + `<g fill="#ffd43b">${dots([[106, 492], [120, 500], [134, 490], [114, 504], [128, 496]], 2.5)}</g>` + sparkle(140, 486, 4)),
];

// het hengsel loopt door de rechtervuist (210, 330); de hand wordt er daarna overheen getekend
const handle = (p) => `<path d="M198 352 C198 316 234 316 234 352" fill="none" stroke="${p.line}" stroke-width="9" stroke-linecap="round"/><path d="M198 352 C198 316 234 316 234 352" fill="none" stroke="${p.fill}" stroke-width="6" stroke-linecap="round"/>`;
export const TAS = [
  (p) => handle(p) + shape('M186 352 h60 a14 14 0 0 1 14 14 v36 a14 14 0 0 1 -14 14 h-60 a14 14 0 0 1 -14 -14 v-36 a14 14 0 0 1 14 -14 z', p)
    + `<rect x="198" y="382" width="36" height="24" rx="8" fill="${p.light}" stroke="${p.line}" stroke-width="1.5"/><path d="M186 372 h60" stroke="#fff" stroke-width="3" opacity="0.7"/>` + gloss(196, 362, 8, 5),
  (p) => handle(p) + shape('M188 352 L244 352 L238 410 L194 410 Z', p) + '<circle cx="216" cy="378" r="6" fill="#ffd43b"/>' + gloss(198, 364, 7, 5),
  (p) => `<path d="M118 202 L222 352" fill="none" stroke="${p.line}" stroke-width="9" stroke-linecap="round"/><path d="M118 202 L222 352" fill="none" stroke="${p.fill}" stroke-width="6" stroke-linecap="round"/>`
    + shape('M194 350 h58 a12 12 0 0 1 12 12 v24 a12 12 0 0 1 -12 12 h-58 a12 12 0 0 1 -12 -12 v-24 a12 12 0 0 1 12 -12 z', p) + `<path d="M182 364 h82" stroke="${p.line}" stroke-width="1.5"/>` + gloss(200, 358, 8, 4),
  (p) => shape('M200 320 h54 a8 8 0 0 1 8 8 v16 a8 8 0 0 1 -8 8 h-54 a8 8 0 0 1 -8 -8 v-16 a8 8 0 0 1 8 -8 z', p) + '<circle cx="244" cy="336" r="4" fill="#ffd43b"/>',
  (p) => handle(p) + shape('M184 352 h66 a6 6 0 0 1 6 6 v72 a6 6 0 0 1 -6 6 h-66 a6 6 0 0 1 -6 -6 v-72 a6 6 0 0 1 6 -6 z', p) + `<path d="M208 372 ${STAR}" fill="#fff" opacity="0.85"/>` + gloss(194, 366, 7, 5),
  () => '',
  (p) => handle(p) + shape('M216 364 c-12 -16 -34 -2 -16 16 l16 16 16 -16 c18 -18 -4 -32 -16 -16z', p) + gloss(208, 366, 5, 3) + sparkle(238, 356, 4),
];

export const SIERADEN = [
  () => '',
  (p) => `<path d="M128 204 Q150 238 172 204" fill="none" stroke="${p.c}" stroke-width="4" stroke-linecap="round"/>` + shape('M150 220 a8 8 0 1 0 0.1 0 z', p) + '<circle cx="147" cy="225" r="2.5" fill="#fff"/>',
  (p) => `<g fill="${p.c}" stroke="#fff" stroke-width="1.5">${dots([[128, 206], [136, 216], [145, 222], [155, 223], [164, 219], [172, 210]], 5)}</g>`,
  (p) => `<g fill="none" stroke="${p.c}" stroke-width="5"><ellipse cx="90" cy="317" rx="13" ry="5"/><ellipse cx="210" cy="317" rx="13" ry="5"/></g>`,
  (p) => `<rect x="76" y="311" width="28" height="12" rx="4" fill="${p.c}"/><circle cx="90" cy="317" r="8" fill="#fff" stroke="${p.line}" stroke-width="3"/><path d="M90 313v4h3" fill="none" stroke="#3a2a4d" stroke-width="1.5"/>`,
  (p) => `<path d="M118 208 ${STAR}" fill="${p.c}" stroke="#fff" stroke-width="2"/>`,
  (p) => `<path d="M124 202 Q150 280 176 202" fill="none" stroke="${p.c}" stroke-width="4"/><path d="M144 258 ${STAR}" fill="${p.c}" stroke="#fff" stroke-width="2"/>`,
];

export const EXTRA = [
  () => '',
  (p) => `<g fill="${p.c}">${mirror('<rect x="116" y="110" width="30" height="20" rx="9"/>')}<rect x="144" y="116" width="12" height="4"/></g>` + gloss(126, 116, 8, 4, -30),
  (p) => `<g fill="none" stroke="${p.c}" stroke-width="3">${mirror('<circle cx="131" cy="118" r="14"/>')}<path d="M145 118h10"/></g>`,
  (p) => shape('M120 78 L128 46 L142 66 L150 38 L158 66 L172 46 L180 78 Z', p) + `<g fill="#fff">${dots([[128, 50], [150, 42], [172, 50]], 3)}</g>` + sparkle(186, 48, 5),
  (p) => '<path d="M90 332 L82 384" stroke="#3c9a46" stroke-width="5" stroke-linecap="round"/>' + `<g fill="${p.c}" stroke="${p.line}" stroke-width="1.2">${dots([[76, 312], [94, 304], [102, 322]], 10)}</g><circle cx="84" cy="326" r="10" fill="#fff"/><circle cx="84" cy="326" r="4" fill="#ffd43b"/>`,
  (p) => bow(150, 66, p),
  (p) => `<g fill="${p.c}" stroke="#fff" stroke-width="2"><ellipse cx="198" cy="88" rx="11" ry="8" transform="rotate(-30 198 88)"/><ellipse cx="222" cy="88" rx="11" ry="8" transform="rotate(30 222 88)"/><ellipse cx="200" cy="104" rx="8" ry="6"/><ellipse cx="220" cy="104" rx="8" ry="6"/></g><rect x="207" y="82" width="6" height="26" rx="3" fill="#3a2a4d"/>`,
];
