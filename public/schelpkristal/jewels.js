// Kronen, kettingen en schoenen (zelfde volgorde als in data.js). p = de verf (paint
// uit glans.js). Kroon op de kruin (rond y = 66), ketting om de hals (y = 206),
// schoenen links rond x = 120 met de neus naar buiten; rechts is gespiegeld.
import { shape, gloss, sparkle, mirror, dots, GOLD, paint, light } from './glans.js';

const STAR = (s) => `l${0.4 * s} ${0.9 * s} ${s} ${0.1 * s}-${0.7 * s} ${0.7 * s} ${0.2 * s} ${s}-${0.9 * s}-${0.5 * s}-${0.9 * s} ${0.5 * s} ${0.2 * s}-${s}-${0.7 * s}-${0.7 * s} ${s}-${0.1 * s}z`;
const HEART = (x, y, s) => `M${x} ${y + s} C${x - 2 * s} ${y - 0.2 * s} ${x - s} ${y - 1.6 * s} ${x} ${y - 0.6 * s} C${x + s} ${y - 1.6 * s} ${x + 2 * s} ${y - 0.2 * s} ${x} ${y + s} Z`;
const SHELL = (x, y, s) => `M${x} ${y + s} L${x - s} ${y - 0.2 * s} Q${x} ${y - 1.4 * s} ${x + s} ${y - 0.2 * s} Z`;
const gem = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#fff" stroke-width="1.5"/><circle cx="${x - r / 3}" cy="${y - r / 3}" r="${r / 3}" fill="#fff" opacity="0.8"/>`;
const BAND = 'M112 84 Q150 62 188 84 L186 92 Q150 72 114 92 Z';
const ARC = [[114, 84], [126, 75], [138, 70], [150, 68], [162, 70], [174, 75], [186, 84]];
const shellLines = (x, y, s) => `<path d="M${x} ${y + s} L${x - 0.5 * s} ${y - 0.6 * s} M${x} ${y + s} L${x} ${y - 0.8 * s} M${x} ${y + s} L${x + 0.5 * s} ${y - 0.6 * s}" stroke="#fff" stroke-width="1.5" opacity="0.7"/>`;

export const CROWNS = [
  (p) => shape(BAND, p) + shape('M140 74 L150 42 L160 74 Z', p) + shape('M120 82 L124 62 L132 78 Z', p) + shape('M168 78 L176 62 L180 82 Z', p)
    + gem(150, 62, 6, '#ff5fa2') + `<g fill="#fff">${dots([[124, 70], [176, 70]], 3)}</g>` + sparkle(166, 46, 5),
  (p) => shape('M114 86 L108 40 L132 60 L150 26 L168 60 L192 40 L186 86 Q150 76 114 86 Z', p) + shape('M114 80 Q150 70 186 80 L186 90 Q150 80 114 90 Z', p)
    + gem(150, 60, 7, '#ff5fa2') + gem(126, 72, 5, '#5ec8ff') + gem(174, 72, 5, '#5ec8ff') + `<g fill="#fff">${dots([[108, 40], [150, 26], [192, 40]], 4)}</g>` + gloss(132, 66, 6, 10),
  (p) => shape(BAND, p) + [[150, 40, 12], [126, 54, 9], [174, 54, 9]].map(([x, y, s]) => shape(`M${x} ${y} ${STAR(s)}`, p)).join('') + sparkle(196, 50, 5) + sparkle(104, 58, 4),
  (p) => `<path d="M110 90 Q150 58 190 90" fill="none" stroke="#3c9a46" stroke-width="5" stroke-linecap="round"/>`
    + ARC.map(([x, y]) => `<g fill="${p.fill}" stroke="${p.line}" stroke-width="1">${dots([[x - 6, y - 3], [x + 6, y - 3], [x - 4, y + 6], [x + 4, y + 6], [x, y - 7]], 5)}</g><circle cx="${x}" cy="${y}" r="3.5" fill="#ffd43b"/>`).join(''),
  (p) => shape(BAND, GOLD) + [[150, 58, 14], [124, 70, 10], [176, 70, 10]].map(([x, y, s]) => shape(SHELL(x, y, s), p) + shellLines(x, y, s)).join('') + gem(150, 78, 4, '#fff'),
  (p) => shape(BAND, p) + [[150, 54, 9], [126, 66, 6], [174, 66, 6]].map(([x, y, s]) => shape(HEART(x, y, s), paint('#ff5fa2'))).join('') + sparkle(150, 36, 5),
];

const chain = (c = '#e6b800') => `<path d="M124 204 Q150 244 176 204" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`;
const CURVE = Array.from({ length: 9 }, (_, i) => {
  const t = (i + 0.5) / 9;
  return [(1 - t) ** 2 * 124 + 2 * (1 - t) * t * 150 + t * t * 176, (1 - t) ** 2 * 204 + 2 * (1 - t) * t * 244 + t * t * 204];
});
export const NECKLACES = [
  (p) => `<g fill="${p.fill}" stroke="${p.line}" stroke-width="1">${dots(CURVE, 4.5)}</g><g fill="#fff" opacity="0.8">${dots(CURVE.map(([x, y]) => [x - 1.5, y - 1.5]), 1.5)}</g>`,
  (p) => chain() + shape(HEART(150, 230, 8), p) + gloss(146, 226, 3, 2),
  (p) => chain() + shape('M150 220 L160 230 L150 246 L140 230 Z', p) + '<path d="M140 230 L160 230 M150 220 L146 230 L150 246 L154 230 Z" fill="none" stroke="#fff" stroke-width="1" opacity="0.7"/>' + sparkle(162, 222, 4),
  (p) => chain() + shape(SHELL(150, 232, 10), p) + shellLines(150, 232, 10),
  (p) => chain() + [[150, 222, 8], [136, 216, 5], [164, 216, 5]].map(([x, y, s]) => shape(`M${x} ${y} ${STAR(s)}`, p)).join(''),
  (p) => chain() + shape('M150 218 L158 230 L150 256 L142 230 Z', { ...p, fill: light(p.c, 0.4) }, 'opacity="0.9"') + gloss(147, 230, 3, 8) + sparkle(160, 248, 4),
];

const glass = (p) => ({ ...paint(light(p.c, 0.5)), line: p.line });
const heel = (y0) => `M133 ${y0} L141 ${y0} L138 510 L135 510 Z`;
const HIGH = 'M96 504 C96 496 104 494 112 496 L134 478 C142 476 146 484 142 490 L118 506 C110 512 98 512 96 504 Z';
export const SHOES = [
  (p) => mirror(shape(heel(496), p) + shape('M96 502 C96 494 104 490 114 492 L132 488 C140 488 142 494 140 498 L120 504 C112 508 100 510 96 502 Z', p) + gloss(106, 496, 5, 3)),
  (p) => mirror(shape(heel(486), p) + shape(HIGH, p) + `<path d="M124 482 Q130 476 136 480" fill="none" stroke="${p.line}" stroke-width="3"/>` + gloss(106, 500, 5, 3)),
  (p) => mirror(shape(heel(486), glass(p), 'opacity="0.85"') + shape(HIGH, glass(p), 'opacity="0.85"') + '<path d="M100 502 L130 484" stroke="#fff" stroke-width="2.5" opacity="0.8"/>' + sparkle(104, 494, 5)),
  (p) => mirror(shape('M94 502 C94 494 104 492 118 494 L138 496 C144 498 144 506 138 508 L104 510 C98 510 94 508 94 502 Z', p)
    + `<g fill="${light(p.c, 0.45)}" stroke="${p.line}" stroke-width="1"><path d="M104 496 l-8 -6 0 10 z"/><path d="M104 496 l8 -6 0 10 z"/></g>`),
  (p, skin) => mirror(shape(heel(500), p) + shape('M94 504 C94 496 104 494 114 494 L128 486 L136 494 L136 500 L98 508 Z', skin)
    + shape('M94 506 L140 500 L140 504 L96 510 Z', p) + `<g stroke="${p.c}" stroke-width="4" stroke-linecap="round"><path d="M102 504 L114 494"/><path d="M118 502 L124 492"/><path d="M126 490 L134 488"/></g>`),
  (p) => mirror(shape('M110 456 L136 456 L138 498 C140 506 134 510 126 510 L102 510 C94 510 92 502 98 498 L110 492 Z', p)
    + shape('M106 452 h34 v10 h-34 z', { ...p, fill: light(p.c, 0.6) }) + gloss(118, 476, 4, 12)),
];
