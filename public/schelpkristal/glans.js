// De Glans-stijl (zoals in Mijn Leven): elke kleur krijgt een verloop (licht boven,
// donker onder), een dunne lijn in een donkere tint, glanzende plekken en sterretjes.
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const hex = (c) => `#${c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;
export const mix = (a, b, t) => hex(rgb(a).map((v, i) => v + (rgb(b)[i] - v) * t));
export const light = (c, t = 0.3) => mix(c, '#ffffff', t);
export const dark = (c, t = 0.25) => mix(c, '#000000', t);

export const INK = '#3a2420'; // wimpers en wenkbrauwen

// De verf voor een kleur. fill = het verloop; de id hangt alleen af van de kleur.
export function paint(c) {
  return { c, fill: `url(#g${c.slice(1)})`, line: dark(c, 0.38), light: light(c, 0.3), dark: dark(c, 0.16) };
}
// huid: een rond verloop, licht op de wang
export function skinPaint(c) {
  return { c, fill: `url(#s${c.slice(1)})`, line: dark(c, 0.3), skin: true };
}
export const WHITE = paint('#f4f4f4');
export const GOLD = paint('#ffd43b');

// verlopen per soort: g = kleur, s = huid, i = oog
const GRADIENT = {
  g: (id, c) => `<linearGradient id="${id}" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="${light(c, 0.3)}"/><stop offset="1" stop-color="${dark(c, 0.16)}"/></linearGradient>`,
  s: (id, c) => `<radialGradient id="${id}" cx="0.42" cy="0.35" r="0.72"><stop offset="0" stop-color="${light(c, 0.25)}"/><stop offset="1" stop-color="${dark(c, 0.08)}"/></radialGradient>`,
  i: (id, c) => `<radialGradient id="${id}" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="${light(c, 0.35)}"/><stop offset="1" stop-color="${dark(c, 0.55)}"/></radialGradient>`,
};
const FIXED = '<radialGradient id="blush"><stop offset="0" stop-color="#ff7fa3" stop-opacity="0.7"/><stop offset="1" stop-color="#ff7fa3" stop-opacity="0"/></radialGradient>'
  + '<radialGradient id="ggloss"><stop offset="0" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>';

// de verlopen die een tekening gebruikt (gezocht in de tekening zelf), voor bovenin de SVG
function defs(body) {
  const ids = new Set(body.match(/url\(#[gsi][0-9a-f]{6}\)/g) || []);
  return `<defs>${FIXED}${[...ids].map((u) => {
    const id = u.slice(5, -1);
    return GRADIENT[id[0]](id, `#${id.slice(1)}`);
  }).join('')}</defs>`;
}

// Maakt de SVG af: verlopen erbij en elke id een eigen voorvoegsel. Een verloop in een
// verborgen scherm werkt niet, dus twee tekeningen mogen geen id delen.
let drawings = 0;
export function svg(viewBox, label, body) {
  drawings += 1;
  const own = (s) => s.replaceAll('url(#', `url(#d${drawings}`).replaceAll(' id="', ` id="d${drawings}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${label}">${own(defs(body) + body)}</svg>`;
}
export const irisFill = (c) => `url(#i${c.slice(1)})`;

// een vorm in deze stijl: verloop en een dunne lijn
export const shape = (d, p, extra = '') => `<path d="${d}" fill="${p.fill}" stroke="${p.line}" stroke-width="1.8" stroke-linejoin="round" ${extra}/>`;
// een glanzende plek
export const gloss = (cx, cy, rx, ry, turn = 0) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#ggloss)" transform="rotate(${turn} ${cx} ${cy})"/>`;
// een sterretje van vier punten
export const sparkle = (x, y, s, fill = '#fff') => `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z" fill="${fill}" opacity="0.95"/>`;
// links en rechts hetzelfde, gespiegeld om het midden (x = 150)
export const mirror = (one) => `${one}<g transform="translate(300 0) scale(-1 1)">${one}</g>`;
export const dots = (list, r) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
