// Het gereedschap van de kapper: naam, uitleg en het plaatje dat met je muis of
// vinger meebeweegt. power = hoe hard het een knoop losmaakt per haal.
import { cursorSvg } from './ui.js';

export const TOOLS = [
  { key: 'borstel', label: 'Borstel', hint: 'Sleep over de knopen om ze eruit te borstelen.', power: 1 },
  { key: 'kam', label: 'Kam', hint: 'Sleep de kam een paar keer over een knoop: hij wordt steeds kleiner.', power: 0.5 },
  { key: 'puntkam', label: 'Puntkam', hint: 'Tik op je haar: de puntkam maakt een scheiding en twee vlechten.' },
  { key: 'schaar', label: 'Schaar', hint: 'Sleep de schaar door een lok: daar knip je hem af.' },
  { key: 'fohn', label: 'Föhn', hint: 'Sleep de föhn over je haar tot het glanst.' },
  { key: 'hoed', label: 'Hoed', hint: 'Tik om je hoed op te zetten. Met een lage knot past hij het mooist.' },
  { key: 'hoofddoek', label: 'Hoofddoek', hint: 'Tik om je hoofddoek om te doen. Tik nog een keer om hem af te doen.' },
];

const teeth = (color) => `<g stroke="${color}" stroke-width="4" stroke-linecap="round"><path d="M-18 6v16M-10 6v16M-2 6v16M6 6v16M14 6v16"/></g>`;
const GLYPHS = {
  borstel: '<rect x="-7" y="6" width="14" height="38" rx="7" fill="#c2419a"/><rect x="-14" y="-26" width="28" height="36" rx="12" fill="#ff8ac8"/>'
    + '<g stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M-7 -18v8M0 -20v10M7 -18v8M-7 -4v6M0 -6v8M7 -4v6"/></g>',
  kam: `<rect x="-22" y="-6" width="44" height="12" rx="4" fill="#5ec8ff"/>${teeth('#5ec8ff')}`,
  // een kam met een lange punt als steel
  puntkam: `<rect x="-22" y="-6" width="34" height="12" rx="4" fill="#4cd4a0"/>${teeth('#4cd4a0').replace('M14 6v16', '')}<path d="M10 -6 L52 -1 L10 6 Z" fill="#4cd4a0"/>`,
  schaar: '<g fill="none" stroke="#7c3aed" stroke-width="5"><circle cx="-10" cy="20" r="8"/><circle cx="10" cy="20" r="8"/></g>'
    + '<g stroke="#9aa3b2" stroke-width="5" stroke-linecap="round"><path d="M-6 13L8 -24M6 13L-8 -24"/></g>',
  fohn: '<rect x="-24" y="-16" width="40" height="26" rx="12" fill="#ffd43b"/><rect x="-6" y="8" width="12" height="28" rx="5" fill="#f9a825"/>'
    + '<g stroke="#bfe6ff" stroke-width="3" stroke-linecap="round"><path d="M-30 -8h-12M-30 0h-16M-30 8h-12"/></g>',
  hoed: '<ellipse cx="0" cy="8" rx="30" ry="8" fill="#f3d9a4"/><path d="M-16 8 C-16 -22 16 -22 16 8 Z" fill="#f7e3b8"/><rect x="-16" y="0" width="32" height="6" fill="#ff8ac8"/>',
  hoofddoek: '<path d="M0 -26 C-22 -26 -26 0 -22 18 L22 18 C26 0 22 -26 0 -26 Z" fill="#b36bff" stroke="#fff" stroke-width="3"/><ellipse cx="0" cy="0" rx="11" ry="13" fill="#f1c9a5"/>',
};

export const toolSvg = (tool, p) => cursorSvg(GLYPHS[tool], p);
