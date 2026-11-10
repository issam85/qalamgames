// De Glans-stijl van Mijn Leven: elke kleur krijgt een verloop (licht boven, donker
// onder), een dunne lijn in een donkere tint van dezelfde kleur, glanzende plekken en
// sterretjes. Zo lijken de tekeningen op de 3D-renders van Mario Party.
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const hex = (c) => `#${c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;
export const mix = (a, b, t) => hex(rgb(a).map((v, i) => v + (rgb(b)[i] - v) * t));
export const light = (c, t = 0.3) => mix(c, '#ffffff', t);
export const dark = (c, t = 0.25) => mix(c, '#000000', t);

export const SKIN = '#f3cfae';
export const INK = '#3a2420'; // ogen, wimpers, wenkbrauwen

// De verf voor een kleur. fill = het verloop; de id hangt alleen af van de kleur, dus
// twee tekeningen op één pagina met dezelfde kleur bijten elkaar niet.
export function paint(c) {
  return { c, fill: `url(#g${c.slice(1)})`, line: dark(c, 0.38), light: light(c, 0.3), dark: dark(c, 0.16) };
}
export const SKIN_PAINT = { ...paint(SKIN), fill: 'url(#gskin)', line: dark(SKIN, 0.3) };
export const WHITE = paint('#f4f4f4');
export const GOLD = paint('#ffd43b');

const gradient = (p) => `<linearGradient id="g${p.c.slice(1)}" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="${p.light}"/><stop offset="1" stop-color="${p.dark}"/></linearGradient>`;
const FIXED = '<radialGradient id="gskin" cx="0.42" cy="0.35" r="0.72"><stop offset="0" stop-color="#f9dcc0"/><stop offset="1" stop-color="#e8b48e"/></radialGradient>'
  + '<radialGradient id="giris" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#a98bd9"/><stop offset="1" stop-color="#33264f"/></radialGradient>'
  + '<radialGradient id="gblush"><stop offset="0" stop-color="#ff7fa3" stop-opacity="0.7"/><stop offset="1" stop-color="#ff7fa3" stop-opacity="0"/></radialGradient>'
  + '<radialGradient id="ggloss"><stop offset="0" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>';

// de verlopen die een tekening nodig heeft (één per kleur), voor bovenin de SVG
export function defs(paints) {
  const seen = new Set();
  const own = paints.filter((p) => p.fill.startsWith('url(#g') && p.fill !== SKIN_PAINT.fill && !seen.has(p.c) && seen.add(p.c));
  return `<defs>${FIXED}${own.map(gradient).join('')}</defs>`;
}

// een vorm in deze stijl: verloop en een dunne lijn
export const shape = (d, p, extra = '') => `<path d="${d}" fill="${p.fill}" stroke="${p.line}" stroke-width="1.8" stroke-linejoin="round" ${extra}/>`;
// een glanzende plek
export const gloss = (cx, cy, rx, ry, turn = 0) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#ggloss)" transform="rotate(${turn} ${cx} ${cy})"/>`;
// een sterretje van vier punten
export const sparkle = (x, y, s) => `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z" fill="#fff" opacity="0.95"/>`;
// links en rechts hetzelfde, gespiegeld om het midden (x = 150)
export const mirror = (one) => `${one}<g transform="translate(300 0) scale(-1 1)">${one}</g>`;
