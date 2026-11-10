// Decor voor de kamers (vak 30,0 – 270,340) in de Glans-stijl: muren, vloeren,
// tegels, een raam met gordijnen, een plant, een lamp, een kleed en een lijstje.
// Elk hulpje brengt zijn eigen <defs> mee; de id's beginnen met "g-", zodat
// sceneSvg ze per tekening uniek maakt.
import { light, dark, gloss } from './glans.js';

export const grad = (id, from, to, x2 = 0, y2 = 1) => `<defs><linearGradient id="g-${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>`;
export const glow = (id, c) => `<defs><radialGradient id="g-${id}"><stop offset="0" stop-color="${c}" stop-opacity="0.55"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs>`;
export const dots = (list, r) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
export const star = (x, y, s = 1) => `<path d="M${x} ${y} l${3 * s} ${7 * s} ${8 * s} ${s}-${6 * s} ${5 * s} ${2 * s} ${8 * s}-${7 * s}-${4 * s}-${7 * s} ${4 * s} ${2 * s}-${8 * s}-${6 * s}-${5 * s} ${8 * s}-${s}z" fill="#ffd43b"/>`;
export const sparkles = (list) => list.map(([x, y, s]) => `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z" fill="#fff" opacity="0.9"/>`).join('');

// de muur: licht boven, iets donkerder onder, met een plint op de vloerlijn
export const wall = (c, floorY = 340) => grad('muur', light(c, 0.45), c)
  + '<rect x="30" y="0" width="240" height="340" rx="14" fill="url(#g-muur)"/>'
  + (floorY < 340 ? `<rect x="30" y="${floorY - 10}" width="240" height="10" fill="#fff" opacity="0.7"/>` : '');

// een houten vloer met planken, vanaf y
export const planks = (y, c = '#d9a86c') => grad('vloer', light(c, 0.15), dark(c, 0.2))
  + `<rect x="30" y="${y}" width="240" height="${340 - y}" fill="url(#g-vloer)"/>`
  + `<g stroke="${dark(c, 0.3)}" stroke-width="1.2" opacity="0.5">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${30 + i * 48 + (Math.floor((y + 20) / 24) % 2) * 24} ${y} v${340 - y}"/>`).join('')}`
  + `<path d="M30 ${y + 24} h240 M30 ${y + 48} h240 M30 ${y + 72} h240"/></g>`
  + `<rect x="30" y="${y}" width="240" height="3" fill="#fff" opacity="0.5"/>`;

// tegels op de muur van y0 tot y1, met een glansje per tegel
export const tiles = (y0, y1, c, size = 40, id = 'tegel') => `<defs><pattern id="g-${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse" x="30" y="${y0}">`
  + `<rect width="${size}" height="${size}" fill="${light(c, 0.2)}"/><rect x="1.5" y="1.5" width="${size - 3}" height="${size - 3}" rx="4" fill="${c}"/>`
  + `<rect x="6" y="5" width="${size * 0.45}" height="${size * 0.18}" rx="4" fill="#fff" opacity="0.35"/></pattern></defs>`
  + `<rect x="30" y="${y0}" width="240" height="${y1 - y0}" fill="url(#g-${id})"/>`;

// een kleed op de vloer
export const rug = (cx, cy, rx, ry, c) => grad('kleed', light(c, 0.2), dark(c, 0.15), 0.3, 1)
  + `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#g-kleed)"/>`
  + `<ellipse cx="${cx}" cy="${cy}" rx="${rx - 10}" ry="${ry - 6}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 6" opacity="0.6"/>`
  + `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.4}" ry="${ry * 0.4}" fill="#fff" opacity="0.25"/>`;

// een raam met uitzicht (dag of nacht) en gordijnen in kleur c
export function windowSvg(x, y, w, h, kind, c = '#ff8ac8') {
  const view = kind === 'night'
    ? grad('raam', '#0b1030', '#2b3a7a') + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="url(#g-raam)"/>`
      + `<path d="M${x + w * 0.62} ${y + h * 0.22} A${h * 0.17} ${h * 0.17} 0 1 0 ${x + w * 0.78} ${y + h * 0.48} A${h * 0.13} ${h * 0.13} 0 1 1 ${x + w * 0.62} ${y + h * 0.22} Z" fill="#fff3c4"/>`
      + `<g fill="#fff">${dots([[x + w * 0.2, y + h * 0.25], [x + w * 0.35, y + h * 0.7], [x + w * 0.8, y + h * 0.8], [x + w * 0.5, y + h * 0.45]], 1.6)}</g>`
    : grad('raam', '#7fd3ff', '#d9f3ff') + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="url(#g-raam)"/>`
      + `<circle cx="${x + w * 0.72}" cy="${y + h * 0.3}" r="${h * 0.14}" fill="#ffe066"/>`
      + `<g fill="#fff"><ellipse cx="${x + w * 0.32}" cy="${y + h * 0.62}" rx="${w * 0.2}" ry="${h * 0.1}"/><ellipse cx="${x + w * 0.42}" cy="${y + h * 0.55}" rx="${w * 0.14}" ry="${h * 0.1}"/></g>`;
  const curtain = (cx, s) => `<path d="M${cx} ${y - 8} C${cx + 14 * s} ${y + h * 0.3} ${cx + 4 * s} ${y + h * 0.6} ${cx + 16 * s} ${y + h + 10} L${cx} ${y + h + 10} Z" fill="url(#g-gordijn)"/>`
    + `<path d="M${cx + 2 * s} ${y + h * 0.55} q${6 * s} 4 ${12 * s} -2" fill="none" stroke="#ffd43b" stroke-width="3" stroke-linecap="round"/>`;
  return view + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="#fff" stroke-width="6"/><path d="M${x + w / 2} ${y} v${h} M${x} ${y + h / 2} h${w}" stroke="#fff" stroke-width="4"/>`
    + `<rect x="${x - 10}" y="${y + h}" width="${w + 20}" height="8" rx="3" fill="#fff"/>`
    + grad('gordijn', light(c, 0.25), dark(c, 0.1), 1, 0) + curtain(x - 4, -1) + curtain(x + w + 4, 1)
    + `<rect x="${x - 22}" y="${y - 12}" width="${w + 44}" height="7" rx="3.5" fill="#ffd43b"/>`;
}

// een plant in een pot, met de voet op (x, y); s = grootte
export function plant(x, y, s = 1) {
  const leaf = (turn, len) => `<ellipse cx="${x}" cy="${y - 40 * s - len * s / 2}" rx="${9 * s}" ry="${len * s / 2}" fill="url(#g-blad)" stroke="#2e7d32" stroke-width="1.2" transform="rotate(${turn} ${x} ${y - 40 * s})"/>`;
  return grad('blad', '#8bd96c', '#2e7d32') + grad('pot', '#e8a872', '#b8703a')
    + leaf(-50, 40) + leaf(50, 40) + leaf(-22, 52) + leaf(22, 52) + leaf(0, 58)
    + `<path d="M${x - 16 * s} ${y - 38 * s} h${32 * s} l${-4 * s} ${38 * s} h${-24 * s} z" fill="url(#g-pot)" stroke="#8a4f22" stroke-width="1.2"/>`
    + `<rect x="${x - 18 * s}" y="${y - 44 * s}" width="${36 * s}" height="${8 * s}" rx="3" fill="#e8a872" stroke="#8a4f22" stroke-width="1.2"/>` + gloss(x - 8 * s, y - 20 * s, 3 * s, 10 * s);
}

// een hanglamp aan het plafond, met een zachte gloed
export const lamp = (x, c = '#ffd43b') => glow('gloed', '#fff3b0') + grad('kap', light(c, 0.3), dark(c, 0.1))
  + `<path d="M${x} 0 v26" stroke="#8a7a9a" stroke-width="2"/><path d="M${x - 10} 26 h20 l10 24 h-40 z" fill="url(#g-kap)" stroke="${dark(c, 0.35)}" stroke-width="1.5" stroke-linejoin="round"/>`
  + `<ellipse cx="${x}" cy="56" rx="34" ry="22" fill="url(#g-gloed)"/><ellipse cx="${x}" cy="50" rx="20" ry="4" fill="#fff8d6"/>`;

// een lijstje aan de muur met een plaatje erin
export const frame = (x, y, w, h, inner) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#ffd43b" stroke="#c9a400" stroke-width="2"/>`
  + `<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" rx="2" fill="#fff8f0"/>${inner}`;

// een zachte schaduw onder iets dat op de vloer staat
export const shadow = (cx, cy, rx, ry = rx * 0.3) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgba(60,20,60,0.16)"/>`;
