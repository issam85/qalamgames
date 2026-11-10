// De jurken (zelfde volgorde als in data.js). Elke jurk: een lijfje (hals 'hart' of
// 'rond'), mouwen ('pof', 'bandje', 'schouder' of 'lang'), een rok en soms een sleep
// achter het lijf. p = de verf (paint uit glans.js). Taille op y = 300.
import { shape, gloss, sparkle, mirror, dots, paint, light, GOLD } from './glans.js';

const HEART = 'M114 214 Q132 204 150 218 Q168 204 186 214 C192 240 190 262 182 300 L118 300 C110 262 108 240 114 214 Z';
const ROUND = 'M112 198 Q150 214 188 198 C194 230 192 262 182 300 L118 300 C108 262 106 230 112 198 Z';
const BELL = 'M118 300 C80 350 42 420 34 480 Q150 506 266 480 C258 420 220 350 182 300 Z';
const ALINE = 'M118 300 C92 360 66 430 60 482 Q150 502 240 482 C234 430 208 360 182 300 Z';
const STAR = 'l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z';

const lt = (p, t = 0.5) => paint(light(p.c, t));
// plooien: een lichte baan, een schaduw en een glanzende plek
const folds = '<path d="M128 320 Q110 400 90 476" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.25"/>'
  + '<path d="M174 320 Q192 400 214 478" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round" opacity="0.07"/>' + gloss(132, 360, 12, 40);
// iets langs de zoom van de klok of de A-lijn: n punten, van t0 tot t1
function hem(n, [x0, y0, x1, y1, cy], t0 = 0.08, t1 = 0.92) {
  return Array.from({ length: n }, (_, i) => {
    const t = t0 + ((t1 - t0) * i) / (n - 1);
    return [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * 150 + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1 - 4];
  });
}
const BELL_HEM = [34, 480, 266, 480, 506];
const flower = ([x, y], c) => `<g fill="${c}" opacity="0.95">${dots([[x - 6, y - 3], [x + 6, y - 3], [x - 4, y + 6], [x + 4, y + 6], [x, y - 7]], 4.5)}</g><circle cx="${x}" cy="${y}" r="3.5" fill="#ffd43b"/>`;
const clip = (id, d, inner) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;

export const DRESSES = [
  { neck: 'hart', sleeve: 'pof', skirt: (p) => shape(BELL, p) + folds + `<g fill="#fff" stroke="${p.line}" stroke-width="0.8">${dots(hem(11, BELL_HEM), 5)}</g>` + sparkle(80, 420, 6) + sparkle(222, 380, 5) },
  {
    neck: 'hart',
    sleeve: 'schouder',
    train: (p) => shape('M182 300 C230 380 268 446 294 500 Q230 514 150 498 Z', lt(p, 0.35)),
    skirt: (p) => shape('M118 300 C90 360 62 430 56 482 Q150 504 244 482 C238 430 210 360 182 300 Z', lt(p)) + folds
      + mirror(shape('M120 300 C104 360 84 420 60 480 C90 476 112 466 124 450 C122 400 122 350 120 300 Z', p)),
  },
  {
    neck: 'hart',
    sleeve: 'bandje',
    skirt: (p) => {
      const d = 'M120 300 C112 360 122 400 114 432 C98 458 72 474 62 488 Q150 504 238 488 C228 474 202 458 186 432 C178 400 188 360 180 300 Z';
      const scales = Array.from({ length: 8 }, (_, r) => Array.from({ length: 6 }, (_, c) => `<path d="M${104 + c * 18 + (r % 2) * 9} ${314 + r * 15} q9 12 18 0" />`).join('')).join('');
      return shape(d, p) + clip('czee', d, `<g fill="none" stroke="#fff" stroke-width="2" opacity="0.35">${scales}</g>`)
        + shape('M114 432 C98 458 72 474 62 488 Q150 504 238 488 C228 474 202 458 186 432 Q150 446 114 432 Z', lt(p, 0.45)) + gloss(138, 360, 8, 34);
    },
  },
  {
    neck: 'rond',
    sleeve: 'bandje',
    skirt: (p) => shape('M118 300 C100 340 86 380 80 408 Q150 424 220 408 C214 380 200 340 182 300 Z', p)
      + [[128, 330], [168, 344], [110, 384], [150, 372], [192, 392]].map((xy) => flower(xy, '#fff')).join('') + gloss(132, 340, 10, 22),
  },
  {
    neck: 'hart',
    sleeve: 'pof',
    skirt: (p) => shape('M74 430 C64 456 56 472 50 486 Q150 506 250 486 C244 472 236 456 226 430 Z', p)
      + shape('M98 358 C88 398 78 420 72 442 Q150 458 228 442 C222 420 212 398 202 358 Z', lt(p, 0.35))
      + shape('M118 300 C108 330 100 350 96 370 Q150 384 204 370 C200 350 192 330 182 300 Z', p)
      + `<g fill="#fff" opacity="0.8">${dots([[110, 368], [130, 374], [150, 376], [170, 374], [190, 368]], 3)}</g>` + gloss(130, 330, 8, 16),
  },
  {
    neck: 'rond',
    sleeve: 'lang',
    skirt: (p) => shape(BELL, p) + folds
      + `<g fill="#ffd43b" stroke="#c9a400" stroke-width="1">${[[120, 340], [176, 372], [96, 410], [150, 430], [212, 440], [70, 466], [230, 470], [128, 470]].map(([x, y]) => `<path d="M${x} ${y} ${STAR}"/>`).join('')}</g>`
      + sparkle(200, 340, 6) + sparkle(84, 380, 5),
  },
  {
    neck: 'hart',
    sleeve: 'schouder',
    skirt: (p) => shape(ALINE, p) + folds
      + `<g fill="#fff" opacity="0.7">${dots([[110, 330], [150, 320], [186, 338], [96, 380], [130, 372], [170, 388], [206, 400], [84, 430], [120, 420], [158, 440], [196, 452], [228, 466], [72, 470], [140, 476]], 2.2)}</g>`
      + sparkle(124, 400, 7) + sparkle(190, 420, 6) + sparkle(98, 452, 5) + sparkle(168, 350, 5),
  },
  {
    neck: 'hart',
    sleeve: 'pof',
    skirt: (p) => shape(BELL, p) + folds + `<g fill="${light(p.c, 0.55)}" stroke="${p.line}" stroke-width="1">${hem(10, BELL_HEM).map(([x, y]) => `<ellipse cx="${x.toFixed(1)}" cy="${(y - 6).toFixed(1)}" rx="15" ry="10"/>`).join('')}</g>`
      + [[118, 350], [180, 368], [90, 420], [150, 410], [210, 430]].map((xy) => flower(xy, '#fff')).join(''),
  },
];

export const bodice = (dress, p) => shape(dress.neck === 'hart' ? HEART : ROUND, p) + gloss(132, 240, 8, 22)
  + shape('M116 294 Q150 306 184 294 L184 306 Q150 318 116 306 Z', GOLD);

export function sleeves(dress, p) {
  if (dress.sleeve === 'pof') return mirror(shape('M112 196 C86 198 82 226 96 234 C108 238 122 228 128 214 C130 204 124 196 112 196 Z', lt(p, 0.25)) + gloss(102, 210, 7, 5, -30));
  if (dress.sleeve === 'schouder') return mirror(shape('M84 220 C92 204 112 204 124 214 L122 228 C110 222 96 222 88 234 Z', p) + `<g fill="#fff">${dots([[92, 218], [104, 212], [116, 216]], 2.5)}</g>`);
  if (dress.sleeve === 'lang') {
    return mirror(`<path d="M118 206 C100 250 92 290 90 318" fill="none" stroke="${light(p.c, 0.5)}" stroke-width="24" stroke-linecap="round" opacity="0.6"/>`
      + shape('M78 312 h24 v10 h-24 z', GOLD));
  }
  return mirror(`<path d="M126 216 L120 196" stroke="${p.line}" stroke-width="7" stroke-linecap="round"/><path d="M126 216 L120 196" stroke="${p.c}" stroke-width="4.5" stroke-linecap="round"/>`);
}
