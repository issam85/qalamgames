// De burkini: lange mouwen, een tuniek tot over de heupen en een lange broek, dus
// alleen gezicht en handen zijn bloot. Vak 300 × 520 (zoals princess.js), schouders op
// 196, handen op (90, 330) en (210, 330). p = de verf (paint uit glans.js).
import { shape, gloss, mirror } from './glans.js';

// broek tot op de enkels, met een lichte baan en zwemschoentjes
export const pants = (p) => mirror(`<path d="M120 300 L120 492" stroke="${p.line}" stroke-width="22" stroke-linecap="round"/>`
  + `<path d="M120 300 L120 492" stroke="${p.c}" stroke-width="19" stroke-linecap="round"/>`
  + '<path d="M115 320 L115 480" stroke="#fff" stroke-width="3" opacity="0.3" stroke-linecap="round"/>'
  + `<path d="M104 506 C102 494 112 490 122 492 C132 494 136 500 134 508 Z" fill="${p.line}"/>`);

// tuniek met ronde hals, tot halverwege de dijen
const TUNIC = 'M150 192 C128 192 110 198 106 214 C100 260 102 330 92 392 Q150 408 208 392 C198 330 200 260 194 214 C190 198 172 192 150 192 Z';
export const tunic = (p) => shape(TUNIC, p)
  + `<path d="M132 196 Q150 212 168 196" fill="none" stroke="${p.line}" stroke-width="2"/>`
  + '<path d="M128 230 Q118 310 110 380" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.25"/>' + gloss(132, 250, 8, 22);

// mouwen tot op de pols; de handen tekent princess.js erover
export const sleeves = (p) => mirror(`<path d="M116 210 C100 250 92 290 90 318" fill="none" stroke="${p.line}" stroke-width="24" stroke-linecap="round"/>`
  + `<path d="M116 210 C100 250 92 290 90 318" fill="none" stroke="${p.c}" stroke-width="21" stroke-linecap="round"/>`
  + `<path d="M80 316 h20" stroke="${p.line}" stroke-width="3" stroke-linecap="round"/>`);

// De patronen (zelfde volgorde als Zwemkleding en Patroon in data.js), ook voor de jurken
// (dresses.js). area = waar de bloemen, golven en sterren komen; c = hun kleur.
const flower = (c) => ([x, y]) => `<g fill="${c}" opacity="0.9">${[[x - 5, y - 2], [x + 5, y - 2], [x - 3, y + 5], [x + 3, y + 5], [x, y - 6]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3.8"/>`).join('')}</g><circle cx="${x}" cy="${y}" r="3" fill="#ffd43b"/>`;
const star = (c) => ([x, y]) => `<path d="M${x} ${y} l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="${c}" stroke="#fff" stroke-width="1"/>`;
const waves = (c, [ys, x0, n]) => `<g fill="none" stroke="${c}" stroke-width="4" opacity="0.6">${ys.map((y) => `<path d="M${x0} ${y} q12 -10 24 0${' t24 0'.repeat(n - 1)}"/>`).join('')}</g>`;
export const PATTERNS = [
  () => '',
  (area, c = '#fff') => area.flowers.map(flower(c)).join(''),
  (area, c = '#fff') => waves(c, area.waves),
  (area, c = '#ffd43b') => area.stars.map(star(c)).join(''),
];
const TUNIC_AREA = {
  flowers: [[132, 240], [170, 262], [122, 300], [160, 320], [184, 360], [118, 360]],
  waves: [[250, 290, 330, 370], 96, 5],
  stars: [[140, 234], [176, 270], [118, 290], [154, 330], [190, 352], [120, 368]],
};
export const pattern = (kind) => `<clipPath id="tuniek"><path d="${TUNIC}"/></clipPath><g clip-path="url(#tuniek)">${(PATTERNS[kind] || PATTERNS[0])(TUNIC_AREA)}</g>`;

// De capuchon: om het hoofd en over de schouders, het gezicht blijft vrij. back komt
// vóór het gezicht in de tekening (het gezicht ligt erop), rim erna (de rand).
const HOOD = 'M150 58 C98 58 80 102 84 158 C86 190 80 214 100 232 C124 244 176 244 200 232 C220 214 214 190 216 158 C220 102 202 58 150 58 Z';
export const hood = (p) => ({
  back: shape(HOOD, p) + gloss(116, 92, 20, 10, -40),
  rim: `<ellipse cx="150" cy="120" rx="49" ry="55" fill="none" stroke="${p.line}" stroke-width="4"/>`
    + `<ellipse cx="150" cy="120" rx="47" ry="53" fill="none" stroke="${p.c}" stroke-width="3"/>`,
});
