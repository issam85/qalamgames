// Iconen voor kinderen die (nog) niet lezen: één per soort in het kleedhokje, per knop en
// voor de wijzende handjes. Elk icoon is een kleine SVG van 48 × 48.
const icon = (body) => `<svg viewBox="0 0 48 48" aria-hidden="true">${body}</svg>`;
const LINE = 'stroke="#5a2a5a" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
const strip = (svgText) => svgText.replace(/<\/?svg[^>]*>/g, '');
const gem = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${LINE}/><circle cx="${x - r / 3}" cy="${y - r / 3}" r="${r / 3}" fill="#fff"/>`;

const jurk = icon(`<path d="M19 5 h10 l2 8 -4 4 L39 42 H9 L21 17 l-4 -4 Z" fill="#ff8ac8" ${LINE}/><path d="M21 17 h6" ${LINE}/>`);
export const CAT_ICONS = {
  jurk,
  kroon: icon(`<path d="M7 36 L9 14 L17 24 L24 8 L31 24 L39 14 L41 36 Z" fill="#ffd43b" ${LINE}/><circle cx="24" cy="29" r="3.5" fill="#ff5fa2"/>`),
  haar: icon(`<path d="M24 5 C11 5 7 16 8 27 C9 35 5 40 7 44 H41 C43 40 39 35 40 27 C41 16 37 5 24 5 Z" fill="#a0673a" ${LINE}/>`
    + `<ellipse cx="24" cy="23" rx="9" ry="10" fill="#f6d2b4" ${LINE}/><path d="M15 19 Q24 9 33 19 Q26 15 15 19 Z" fill="#a0673a"/>`),
  gezicht: icon(`<circle cx="24" cy="24" r="19" fill="#f6d2b4" ${LINE}/><g fill="#3d7ad6" ${LINE}><circle cx="17" cy="21" r="3.5"/><circle cx="31" cy="21" r="3.5"/></g>`
    + `<path d="M17 31 Q24 38 31 31 Q24 34 17 31 Z" fill="#e8605f" ${LINE}/><g fill="#ff9ab8" opacity="0.7"><circle cx="12" cy="29" r="3"/><circle cx="36" cy="29" r="3"/></g>`),
  ketting: icon(`<path d="M9 8 Q24 38 39 8" fill="none" stroke="#c0c6d4" stroke-width="3"/>${[[12, 16], [17, 24], [24, 28], [31, 24], [36, 16]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fbf7f0" ${LINE}/>`).join('')}<path d="M24 31 l-5 5 5 6 5 -6 Z" fill="#5ec8ff" ${LINE}/>`),
  sieraden: icon(`<path d="M14 6 V14" ${LINE}/>${gem(14, 20, 6, '#ffd43b')}<ellipse cx="31" cy="35" rx="13" ry="6" fill="none" stroke="#ffd43b" stroke-width="4"/>`
    + `<ellipse cx="31" cy="35" rx="13" ry="6" fill="none" ${LINE}/>${gem(31, 29, 4, '#ff5fa2')}`),
  schoenen: icon(`<path d="M6 34 Q6 26 14 26 L26 30 Q34 20 40 26 L42 34 Z" fill="#8fd3ff" ${LINE}/><path d="M38 34 L37 42" stroke="#5a2a5a" stroke-width="4" stroke-linecap="round"/>`),
  zwem: icon(`<path d="M4 20 Q10 14 16 20 T28 20 T40 20 T46 20" fill="none" stroke="#2f6fe0" stroke-width="4" stroke-linecap="round"/>`
    + '<path d="M4 31 Q10 25 16 31 T28 31 T40 31 T46 31" fill="none" stroke="#5ec8ff" stroke-width="4" stroke-linecap="round"/>'),
  patroon: icon(`<rect x="6" y="6" width="36" height="36" rx="8" fill="#ff8ac8" ${LINE}/>`
    + '<g fill="#fff">' + [[15, 15], [33, 15], [24, 24], [15, 33], [33, 33]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join('') + '</g>'),
  oorbellen: icon(`<path d="M16 6 V18 M32 6 V18" ${LINE}/>${gem(16, 25, 7, '#ffd43b')}${gem(32, 25, 7, '#ffd43b')}`),
  armband: icon(`<ellipse cx="24" cy="26" rx="18" ry="9" fill="none" stroke="#ffd43b" stroke-width="5"/><ellipse cx="24" cy="26" rx="18" ry="9" fill="none" ${LINE}/>${gem(24, 35, 4, '#5ec8ff')}`),
  speld: icon(`<path d="M24 24 L8 14 L8 34 Z M24 24 L40 14 L40 34 Z" fill="#ff8ac8" ${LINE}/><circle cx="24" cy="24" r="5" fill="#ff8ac8" ${LINE}/>`),
  ogen: icon(`<path d="M4 24 Q24 6 44 24 Q24 42 4 24 Z" fill="#fff" ${LINE}/><circle cx="24" cy="24" r="9" fill="#3d7ad6"/><circle cx="24" cy="24" r="4" fill="#1d1016"/><circle cx="21" cy="21" r="2" fill="#fff"/>`),
  lippen: icon(`<path d="M6 24 Q14 12 24 18 Q34 12 42 24 Q34 38 24 38 Q14 38 6 24 Z" fill="#e8605f" ${LINE}/><path d="M6 24 Q24 30 42 24" fill="none" ${LINE}/>`),
};

const back = '<path d="M30 10 L14 24 L30 38" fill="none" stroke="#c2419a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>';
export const BUTTON_ICONS = {
  strand: icon(`<path d="M24 40 L8 18 Q24 2 40 18 Z" fill="#ffd9b8" ${LINE}/><path d="M24 40 L16 12 M24 40 L24 8 M24 40 L32 12" ${LINE} fill="none"/>`
    + '<path d="M40 30 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 Z" fill="#ffd43b"/>'),
  douche: icon(`<path d="M10 6 V14 Q10 18 16 18 H22" fill="none" ${LINE}/><path d="M18 18 H36 L32 24 H22 Z" fill="#c0c6d4" ${LINE}/>`
    + [[22, 30], [27, 34], [32, 30], [24, 40], [30, 42]].map(([x, y]) => `<path d="M${x} ${y} q-2 3 0 5 q2 -2 0 -5 Z" fill="#5ec8ff"/>`).join('')),
  zee: icon(`<path d="M4 34 Q10 28 16 34 T28 34 T40 34 T46 34 V46 H4 Z" fill="#5ec8ff" ${LINE}/>`
    + `<path d="M16 18 Q24 10 32 18 Q24 26 16 18 Z M32 18 L38 13 V23 Z" fill="#ff8a3d" ${LINE}/><circle cx="21" cy="17" r="1.5" fill="#5a2a5a"/>`),
  kleed: icon(`<path d="M24 4 a4 4 0 1 1 4 4 l-4 3 L6 20 H42 L24 11" fill="none" ${LINE}/>${strip(jurk).replace('M19 5', 'M19 19').replace('L39 42 H9', 'L36 46 H12')}`),
  klaar: icon('<path d="M9 25 L20 36 L40 12" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'),
  verras: icon(`<path d="M24 4 l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1 Z" fill="#fff" ${LINE}/>`),
  terug: icon(back.replace('#c2419a', '#fff')),
  opnieuw: icon('<path d="M38 24 A14 14 0 1 1 30 11.5" fill="none" stroke="#5a3d00" stroke-width="5" stroke-linecap="round"/><path d="M27 4 L36 11 L27 18 Z" fill="#5a3d00"/>'),
  nee: icon('<path d="M12 12 L36 36 M36 12 L12 36" stroke="#e53950" stroke-width="7" stroke-linecap="round"/>'),
  ja: icon('<path d="M9 25 L20 36 L40 12" fill="none" stroke="#43a047" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'),
  pijl: icon('<path d="M8 24 H36 M26 13 L38 24 L26 35" fill="none" stroke="#c2419a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'),
};
export const BACK_ARROW = icon(back);

// een wijzend handje (tik hier)
export const HAND = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 44 L12 30 Q10 25 15 26 L19 31 V8 Q19 4 23 4 Q27 4 27 8 V22 L37 24 Q42 25 41 31 L38 44 Z" fill="#fff" stroke="#5a2a5a" stroke-width="2.5" stroke-linejoin="round"/></svg>';
