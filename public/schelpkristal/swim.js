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
