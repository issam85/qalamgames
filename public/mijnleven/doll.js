// Het meisje: bouwt de SVG op uit de gekozen kleren, laag voor laag.
import { JURK, HOOFDDOEK, SCHOENEN, TAS, SIERADEN, EXTRA } from './doll-parts.js';

export const SKIN = '#f1c9a5';
// wit valt weg tegen de lichte kamer: dan een heel lichte grijstint
export const soft = (hex) => (hex === '#ffffff' ? '#f4f4f4' : hex);
const both = (one) => `${one}<g transform="translate(30 0)">${one}</g>`;

// teeth = kleur van de tanden als de mond open is (bij het poetsen), anders ''
function mouth(lips, teeth) {
  if (teeth) {
    return `<path d="M134 121 Q150 146 166 121 Z" fill="#7a2030" stroke="${lips || '#c0392b'}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M138 122 L162 122 L159 129 Q150 133 141 129 Z" fill="${teeth}"/>`;
  }
  if (lips) return `<path d="M137 125 Q150 139 163 125 Q150 130 137 125 Z" fill="${lips}" stroke="${lips}" stroke-width="3" stroke-linejoin="round"/>`;
  return '<path d="M138 126 Q150 136 162 126" fill="none" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>';
}

// makeup = { lips, blush, eyes }, elk een kleur of '' (zie makeup.js)
export function face(makeup = {}, teeth = '') {
  const shadow = makeup.eyes ? both(`<ellipse cx="135" cy="93" rx="10" ry="6" fill="${makeup.eyes}" opacity="0.85"/>`) : '';
  const cheek = makeup.blush
    ? `<circle cx="124" cy="118" r="9" fill="${makeup.blush}" opacity="0.8"/><circle cx="176" cy="118" r="9" fill="${makeup.blush}" opacity="0.8"/>`
    : '<circle cx="124" cy="118" r="7" fill="#ffb3c6" opacity="0.7"/><circle cx="176" cy="118" r="7" fill="#ffb3c6" opacity="0.7"/>';
  return `<ellipse cx="150" cy="105" rx="40" ry="48" fill="${SKIN}"/>${shadow}`
    + both('<circle cx="135" cy="100" r="5" fill="#3a2a2a"/><circle cx="137" cy="98" r="1.6" fill="#fff"/>')
    + mouth(makeup.lips, teeth) + cheek;
}

export function arms(color) {
  return `<path d="M110 160 L70 320 L92 326 L124 200" fill="${color}" stroke="rgba(0,0,0,0.08)"/>`
    + `<path d="M190 160 L230 320 L208 326 L176 200" fill="${color}" stroke="rgba(0,0,0,0.08)"/>`
    + `<circle cx="80" cy="328" r="11" fill="${SKIN}"/><circle cx="220" cy="328" r="11" fill="${SKIN}"/>`;
}

// outfit: { choice: { categorie: nummer }, color: { categorie: kleur } }
export function dollSvg(outfit, makeup) {
  const { choice, color } = outfit;
  const jurk = soft(color.jurk);
  return '<svg viewBox="0 0 300 520" role="img" aria-label="Jouw meisje in de gekozen kleren">'
    + '<ellipse cx="150" cy="508" rx="80" ry="10" fill="rgba(0,0,0,0.15)"/>'
    + JURK[choice.jurk](jurk)
    + arms(jurk)
    + HOOFDDOEK[choice.hoofddoek](soft(color.hoofddoek))
    + face(makeup)
    + EXTRA[choice.extra](color.extra)
    + SIERADEN[choice.sieraden](color.sieraden)
    + SCHOENEN[choice.schoenen](soft(color.schoenen))
    + TAS[choice.tas](soft(color.tas))
    + '</svg>';
}

export function renderDoll(el, outfit, makeup) {
  el.innerHTML = dollSvg(outfit, makeup);
}
