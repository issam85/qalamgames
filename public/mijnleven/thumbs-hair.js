// Plaatjes voor de knoppen van de kapper en de winkel: een klein borstbeeld met elk
// kapsel, en de haarspullen op een hoofd.
import { STYLE_SVG } from './hair-styles.js';
import { HATS } from './hair.js';
import { face } from './doll.js';
import { paint, defs, scoped, SKIN_PAINT } from './glans.js';

const TOP = paint('#e9d5ff');
const SHOULDERS = `<rect x="136" y="150" width="28" height="56" fill="${SKIN_PAINT.fill}"/>`
  + `<path d="M80 200 C96 194 120 192 132 196 Q150 210 168 196 C180 192 204 194 220 200 L220 230 L80 230 Z" fill="${TOP.fill}" stroke="${TOP.line}" stroke-width="1.5"/>`;

const cache = new Map();

// kapsel i in haarkleur color, met de lengtes ends
export function styleThumb(i, color, ends) {
  const key = `${i}:${color}:${ends.join(',')}`;
  if (!cache.has(key)) {
    const p = paint(color);
    const [back, front] = STYLE_SVG[i](p, ends);
    cache.set(key, `<svg viewBox="68 -6 164 176" aria-hidden="true">${defs([p, TOP])}${back}${SHOULDERS}${front}${face()}</svg>`);
  }
  return scoped(cache.get(key));
}

// haarspul i (HATS in hair.js) op donker haar
export function hatThumb(i) {
  const p = paint('#3b2314');
  return scoped(`<svg viewBox="56 18 188 150" aria-hidden="true">${defs([p, paint('#ff8ac8'), paint('#f3d9a4'), paint('#f7e3b8')])}`
    + `${STYLE_SVG[4](p, [])[1]}${face()}${HATS[i][1]}</svg>`);
}
