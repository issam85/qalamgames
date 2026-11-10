// Het meisje: bouwt de SVG op uit de gekozen kleren, laag voor laag, in de Glans-stijl
// (glans.js). Het vak is 300 × 520: hoofd rond (150, 118), schouders op 196, handen op
// (90, 330) en (210, 330), de tas hangt aan de rechterhand.
import { JURK, HOOFDDOEK, SCHOENEN, TAS, SIERADEN, EXTRA, GOWN, gownTop } from './doll-parts.js';
import { SKIN, SKIN_PAINT, INK, paint, defs, mirror, scoped } from './glans.js';

export { SKIN };
// wit valt weg tegen de lichte kamer: dan een heel lichte grijstint
export const soft = (hex) => (hex === '#ffffff' ? '#f4f4f4' : hex);

// teeth = kleur van de tanden als de mond open is (bij het poetsen), anders ''
function mouth(lips, teeth) {
  if (teeth) {
    return `<path d="M134 143 Q150 170 166 143 Z" fill="#7a2030" stroke="${lips || '#c0392b'}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M138 144 L162 144 L159 152 Q150 156 141 152 Z" fill="${teeth}"/>`;
  }
  if (lips) return `<path d="M136 145 Q150 166 164 145 Q150 152 136 145 Z" fill="${lips}"/><path d="M136 145 Q143 139 150 146 Q157 139 164 145 Z" fill="${lips}"/>`;
  return '<path d="M138 146 Q150 162 162 146 Q150 152 138 146 Z" fill="#e8605f"/><path d="M138 146 Q150 160 162 146" fill="none" stroke="#b83b3b" stroke-width="2.2" stroke-linecap="round"/>';
}

// een groot glanzend oog met wimpers en wenkbrauw (links; rechts is gespiegeld)
const EYE = '<ellipse cx="131" cy="118" rx="10" ry="12.5" fill="#fff"/><circle cx="132" cy="120" r="7.2" fill="url(#g-iris)"/><circle cx="132.5" cy="121" r="4.2" fill="#1d1016"/>'
  + '<circle cx="128.5" cy="116" r="3" fill="#fff"/><circle cx="135" cy="124" r="1.4" fill="#fff" opacity="0.9"/>'
  + `<path d="M120 116 Q131 101.5 142 115" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`
  + `<path d="M120 116 l-3.5 -3 M123 107 l-3 -3.5 M127 104.5 l-1.5 -4" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`
  + '<path d="M119 96.5 Q131 89.5 142 95.5" fill="none" stroke="#4a2c1e" stroke-width="2.8" stroke-linecap="round"/>';
const NOSE = '<path d="M148 134 q2 4 5 1" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2" stroke-linecap="round"/>';

// makeup = { lips, blush, eyes }, elk een kleur of '' (zie makeup.js)
export function face(makeup = {}, teeth = '') {
  const shadow = makeup.eyes ? mirror(`<ellipse cx="131" cy="104" rx="13" ry="7" fill="${makeup.eyes}" opacity="0.85"/>`) : '';
  const cheek = makeup.blush
    ? mirror(`<ellipse cx="120" cy="138" rx="11" ry="7" fill="${makeup.blush}" opacity="0.75"/>`)
    : mirror('<ellipse cx="120" cy="138" rx="11" ry="7" fill="url(#g-blush)"/>');
  return `<ellipse cx="150" cy="118" rx="44" ry="50" fill="${SKIN_PAINT.fill}" stroke="${SKIN_PAINT.line}" stroke-width="1.2"/>${shadow}`
    + mirror(EYE) + NOSE + mouth(makeup.lips, teeth) + cheek;
}

// een hand (x = 90 links, 210 rechts)
export const hand = (x) => `<circle cx="${x}" cy="330" r="13" fill="${SKIN_PAINT.fill}" stroke="${SKIN_PAINT.line}" stroke-width="1.6"/>`;

// ronde mouwen met de handen; p = de verf van de jurk (paint)
export function arms(p) {
  return mirror(`<path d="M118 204 C100 250 92 290 90 322" fill="none" stroke="${p.fill}" stroke-width="30" stroke-linecap="round"/>`
    + `<path d="M104 200 C85 248 77 290 75 326 M132 208 C115 252 107 290 105 324" fill="none" stroke="${p.line}" stroke-width="1.8" stroke-linecap="round"/>`
    + hand(90));
}

// outfit: { choice: { categorie: nummer }, color: { categorie: kleur } }
export function dollSvg(outfit, makeup) {
  const { choice, color } = outfit;
  const p = Object.fromEntries(Object.keys(color).map((k) => [k, paint(soft(color[k]))]));
  const gown = choice.jurk === GOWN; // onder de baljurk zie je geen schoenen, en een tas past er niet bij
  return scoped('<svg viewBox="0 0 300 520" role="img" aria-label="Jouw meisje in de gekozen kleren">'
    + defs(Object.values(p))
    + '<ellipse cx="150" cy="508" rx="84" ry="10" fill="rgba(0,0,0,0.15)"/>'
    + `<rect x="136" y="150" width="28" height="50" fill="${SKIN_PAINT.fill}"/>`
    + JURK[choice.jurk](p.jurk)
    + arms(p.jurk)
    + HOOFDDOEK[choice.hoofddoek](p.hoofddoek)
    + face(makeup)
    + (gown ? gownTop(p.jurk) : SCHOENEN[choice.schoenen](p.schoenen) + TAS[choice.tas](p.tas))
    + hand(210)
    + SIERADEN[choice.sieraden](p.sieraden)
    + EXTRA[choice.extra](p.extra)
    + '</svg>');
}

export function renderDoll(el, outfit, makeup) {
  el.innerHTML = dollSvg(outfit, makeup);
}
