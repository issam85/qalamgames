// De icoontjes bij de kamers in het huis, in de Glans-stijl (vak 48 × 48). Elk
// icoontje gaat door scoped(), zodat de verlopen op de pagina niet botsen.
import { paint, defs, shape, gloss, scoped } from './glans.js';

const P = Object.fromEntries(['#5ec8ff', '#ff8ac8', '#b36bff', '#ffd43b', '#4cd4a0', '#ff7a59', '#d9a86c', '#f4f4f4', '#e53935', '#2f9c8f', '#1d2a5a'].map((c) => [c, paint(c)]));
const icon = (inner, ...colors) => scoped(`<svg viewBox="0 0 48 48" aria-hidden="true">${defs(colors.map((c) => P[c]))}${inner}</svg>`);

export const ICONS = {
  bad: icon(shape('M6 22 h36 v8 a10 10 0 0 1 -10 10 h-16 a10 10 0 0 1 -10 -10 z', P['#f4f4f4']) + shape('M10 22 v-10 a4 4 0 0 1 8 0 v2', { ...P['#5ec8ff'], fill: 'none' })
    + `<g fill="${P['#5ec8ff'].fill}" stroke="${P['#5ec8ff'].line}"><circle cx="28" cy="14" r="4"/><circle cx="36" cy="9" r="3"/><circle cx="22" cy="8" r="2.5"/></g>` + gloss(14, 28, 4, 2.5, -20), '#f4f4f4', '#5ec8ff'),
  kast: icon(shape('M8 4 h32 a3 3 0 0 1 3 3 v34 a3 3 0 0 1 -3 3 h-32 a3 3 0 0 1 -3 -3 v-34 a3 3 0 0 1 3 -3 z', P['#d9a86c']) + '<path d="M24 6 v36" stroke="#8a4f22" stroke-width="1.5"/>'
    + '<g fill="#ffd43b" stroke="#c9a400"><circle cx="20" cy="24" r="2"/><circle cx="28" cy="24" r="2"/></g>' + gloss(12, 14, 3, 7), '#d9a86c'),
  kapper: icon(`<g fill="none" stroke="${P['#ff8ac8'].line}" stroke-width="3" stroke-linecap="round"><path d="M14 8 L34 30 M34 8 L14 30"/></g>`
    + shape('M10 30 a6 6 0 1 0 0.1 0 z', P['#ff8ac8']) + shape('M30 30 a6 6 0 1 0 0.1 0 z', P['#ff8ac8']) + `<circle cx="24" cy="19" r="2.5" fill="#ffd43b"/>`, '#ff8ac8'),
  keuken: icon(shape('M6 20 h28 a14 10 0 0 1 -28 0 z', P['#1d2a5a']) + '<path d="M34 18 h10" stroke="#1d2a5a" stroke-width="5" stroke-linecap="round"/>'
    + shape('M9 19 h22 a11 4 0 0 1 -22 0 z', P['#ffd43b']) + '<path d="M12 34 q-3 -4 0 -8 M20 36 q-3 -4 0 -8 M28 34 q-3 -4 0 -8" fill="none" stroke="#bbb" stroke-width="2" stroke-linecap="round" opacity="0.8"/>', '#1d2a5a', '#ffd43b'),
  gezin: icon(shape('M24 42 C8 30 4 22 8 14 C12 7 21 8 24 15 C27 8 36 7 40 14 C44 22 40 30 24 42 Z', P['#e53935']) + gloss(16, 16, 4, 2.5, -30), '#e53935'),
  moskee: icon(shape('M10 44 V26 h28 V44 z', P['#2f9c8f']) + shape('M12 26 C12 10 36 10 36 26 Z', P['#2f9c8f']) + shape('M40 44 V14 l3 -8 3 8 V44 z', P['#2f9c8f'])
    + '<path d="M24 10 v-4" stroke="#ffd43b" stroke-width="2.5" stroke-linecap="round"/><path d="M19 44 V36 a5 5 0 0 1 10 0 V44 z" fill="#ffd98a"/>' + gloss(18, 18, 3, 5, -30), '#2f9c8f'),
  slaap: icon(shape('M30 6 A16 16 0 1 0 42 30 A12 12 0 1 1 30 6 Z', P['#ffd43b']) + '<g fill="#fff"><circle cx="10" cy="12" r="1.8"/><circle cx="14" cy="26" r="1.4"/><circle cx="8" cy="36" r="1.6"/></g>' + gloss(26, 14, 3, 6, 20), '#ffd43b'),
  winkel: icon(shape('M10 16 h28 l3 26 h-34 z', P['#b36bff']) + '<path d="M17 16 v-4 a7 7 0 0 1 14 0 v4" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>'
    + '<path d="M24 24 l2 5 5 .5 -4 3.5 1 5 -4 -2.5 -4 2.5 1 -5 -4 -3.5 5 -.5z" fill="#ffd43b"/>' + gloss(15, 24, 3, 6), '#b36bff'),
};

// zet het icoontje vooraan in elke kamerknop van het huis
export function decorateHouse() {
  document.querySelectorAll('.room[data-room]').forEach((btn) => {
    const svg = ICONS[btn.dataset.room];
    if (!svg) return;
    const span = document.createElement('span');
    span.className = 'room-icon';
    span.innerHTML = svg;
    btn.prepend(span);
  });
}
