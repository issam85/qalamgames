// De stranddouche 's avonds: een paal met een douchekop, een lampje, de zee erachter
// en een houten schotje waar de prinses (in badpak) achter staat. Op de plekken zit
// zand, dan schuim, dan druppels. Vak 30,0 – 270,340. En het gereedschap bij de muis.
import { bathingPrincess } from './princess.js';
import { svg } from './glans.js';
import { SPOTS, washed } from './shower.js';

const BACK = '<rect x="30" y="0" width="240" height="340" rx="14" fill="#16195a"/>'
  + '<circle cx="70" cy="40" r="14" fill="#fff7c2" opacity="0.9"/>'
  + '<g fill="#fff">' + [[110, 24], [200, 40], [240, 14], [160, 12], [90, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6"/>`).join('') + '</g>'
  + '<rect x="30" y="150" width="240" height="60" fill="#22417f"/><path d="M30 150 h240" stroke="#5f86c8" stroke-width="2"/>'
  + '<g stroke="#fff7c2" stroke-width="2" opacity="0.4"><path d="M56 164h28M60 176h20M62 188h16"/></g>'
  + '<rect x="30" y="210" width="240" height="130" fill="#7a5a3e"/>';
const POLE = '<rect x="244" y="10" width="10" height="330" rx="5" fill="#b8c2d0"/><path d="M249 18 H160" stroke="#b8c2d0" stroke-width="8" stroke-linecap="round"/>'
  + '<path d="M136 26 C136 12 184 12 184 26 Z" fill="#d5dde8" stroke="#9aa3b2" stroke-width="2"/>'
  + '<circle cx="249" cy="120" r="9" fill="#ffd43b"/><circle cx="249" cy="120" r="30" fill="#ffd43b" opacity="0.18"/>';
const WATER = '<g stroke="#8fd3ff" stroke-width="3" stroke-linecap="round" opacity="0.8">'
  + [138, 146, 154, 162, 170, 178].map((x, i) => `<path d="M${x} 32 v${40 + (i % 3) * 14}" stroke-dasharray="10 9"/>`).join('') + '</g>';
// het schotje: houten latten, alles onder y = 268 zit erachter
const SCREEN = '<rect x="30" y="268" width="240" height="72" fill="#c08a5a"/>'
  + '<g stroke="#8a5a3c" stroke-width="2">' + Array.from({ length: 11 }, (_, i) => `<path d="M${52 + i * 22} 268 v72"/>`).join('') + '</g>'
  + '<rect x="30" y="264" width="240" height="8" rx="4" fill="#e0b080"/>';

const SAND = '<circle r="15" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 5" opacity="0.8"/>'
  + '<g fill="#c9a26a" stroke="#8a6a3a" stroke-width="0.8">'
  + [[-7, -4], [3, -7], [8, 2], [-2, 4], [-9, 6], [5, 8], [0, -1]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6"/>`).join('') + '</g>';
const FOAM = '<g fill="#fff" stroke="#cfe8ff" stroke-width="1.5"><circle cx="-12" cy="4" r="10"/><circle cx="11" cy="5" r="10"/><circle cx="0" cy="-6" r="12"/><circle cx="-3" cy="9" r="8"/></g>';
const DROP = 'c6 9 6 16 0 16 c-6 0 -6 -7 0 -16z';
const DROPS = `<g fill="#5ec8ff" stroke="#fff" stroke-width="1.5"><path d="M-11 -10 ${DROP}"/><path d="M9 -13 ${DROP}"/><path d="M0 0 ${DROP}"/></g>`;
const MARK = [SAND, FOAM, DROPS, ''];
const star = (x, y) => `<path d="M${x} ${y} l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#ffd43b"/>`;

export const TOOLS = [
  { key: 'spons', label: 'Spons', hint: 'Sleep de spons over het zand tot alles onder het schuim zit.',
    glyph: '<rect x="-24" y="-16" width="48" height="32" rx="10" fill="#ffd43b"/><g fill="#f0b400"><circle cx="-10" cy="-4" r="4"/><circle cx="8" cy="4" r="5"/><circle cx="12" cy="-8" r="3"/><circle cx="-6" cy="8" r="3"/></g>' },
  { key: 'douche', label: 'Douche', turn: 0, hint: 'Sleep de douche over het schuim om het weg te spoelen.',
    glyph: '<rect x="-5" y="-44" width="10" height="30" rx="5" fill="#9aa3b2"/><path d="M-24 -8 C-24 -24 24 -24 24 -8 Z" fill="#b8c2d0"/><rect x="-26" y="-10" width="52" height="8" rx="4" fill="#9aa3b2"/>'
      + '<g stroke="#5ec8ff" stroke-width="4" stroke-linecap="round"><path d="M-16 6v12M-5 8v18M6 8v18M17 6v12"/></g>' },
  { key: 'handdoek', label: 'Handdoek', hint: 'Sleep de handdoek over de druppels om je af te drogen.',
    glyph: '<rect x="-24" y="-22" width="48" height="44" rx="8" fill="#ff8ac8"/><g stroke="#fff" stroke-width="4"><path d="M-24 -8h48M-24 8h48"/></g>' },
];

// het plaatje dat met muis of vinger meebeweegt; p = { x, y } in het vak van de tekening
const cursor = (tool, p) => (p ? `<g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${tool.turn ?? -20})" opacity="0.95" pointer-events="none">${tool.glyph}</g>` : '');

// tool = wat je vasthebt (met de douche stroomt het water); p = plek van de muis
export function showerSvg(princess, spots, tool, p) {
  const marks = spots.map((s, i) => `<g transform="translate(${SPOTS[i][0]} ${SPOTS[i][1]})">${MARK[s]}</g>`).join('');
  const shine = washed(spots) ? star(70, 230) + star(232, 240) + star(80, 110) + star(222, 96) : '';
  const scene = BACK + POLE + bathingPrincess(princess) + (tool.key === 'douche' ? WATER : '') + SCREEN + marks + shine + cursor(tool, p);
  // alleen het vak zelf: lang haar valt anders onder het schotje uit de tekening
  return svg('30 0 240 340', 'Je prinses onder de stranddouche', `<clipPath id="vak"><rect x="30" y="0" width="240" height="340" rx="14"/></clipPath><g clip-path="url(#vak)">${scene}</g>`);
}
