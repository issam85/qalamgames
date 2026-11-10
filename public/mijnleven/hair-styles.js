// De tekeningen van de kapsels (zelfde volgorde als STYLES in hair.js).
// p = de verf van het haar (paint uit glans.js), ends = de lengte per lok. Elk
// kapsel geeft twee lagen terug: [achter het lijf, vóór het lijf].
// Los haar heeft zes lokken die vóór de schouders vallen (drie links, drie rechts).
// Elke lok heeft een eigen onderkant (y), zodat je ze los van elkaar kunt knippen.
// De lengtes zijn bewaard in het oude vak (150 – 300); op het nieuwe hoofd zit het
// haar HAIR_DY lager.
import { shape } from './glans.js';

export const STRAND_X = [92, 105, 118, 182, 195, 208];
export const MIN_END = 150;
export const MAX_END = 300;
export const HAIR_DY = 30;
const STRAND_W = 14;
// 0 (alles kort) – 1 (alles lang), voor de staart en de vlechten
export const longness = (ends) => (ends.reduce((a, e) => a + e, 0) / ends.length - MIN_END) / (MAX_END - MIN_END);
const lock = (x, y, h, p) => `<rect x="${x - STRAND_W / 2}" y="${y.toFixed(1)}" width="${STRAND_W}" height="${h.toFixed(1)}" rx="7" fill="${p.fill}" stroke="${p.line}" stroke-width="1.5"/>`;

const CAP = 'M150 64 C94 64 82 112 88 170 L212 170 C218 112 206 64 150 64 Z';
const cap = (p) => shape(CAP, p) + '<path d="M118 92 C128 74 150 68 170 72" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.35"/>';
const pearls = (list) => `<g fill="#fff" stroke="#ffd43b" stroke-width="1.5">${list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5"/>`).join('')}</g>`;

function braid(x, bend, y) {
  const mid = 157 + (y - 157) * 0.5;
  return `M${x} 157 C${x + bend} ${mid - 20} ${x + bend * 0.6} ${mid + 30} ${x + (x < 150 ? 4 : -4)} ${y}`;
}

function loose(p, ends) {
  const e = Math.min(185, Math.max(...ends)) + HAIR_DY;
  const locks = ends.map((end, i) => lock(STRAND_X[i], 150, end + HAIR_DY - 150, p)
    + `<path d="M${STRAND_X[i] + 7} 170 V${end + HAIR_DY - 8}" stroke="rgba(0,0,0,0.13)" stroke-width="1.5"/>`).join('');
  return [shape(`M150 64 C94 64 82 112 88 170 L82 ${e} C108 ${e + 10} 192 ${e + 10} 218 ${e} L212 170 C218 112 206 64 150 64 Z`, p), cap(p) + locks];
}

// afgeknipte stukjes die naar beneden vallen; pieces = [{ x, y, h, t }], t = begintijd
export function clippingsSvg(pieces, p, now) {
  return pieces.map(({ x, y, h, t }) => {
    const dt = now - t;
    return `<g opacity="${Math.max(0, 1 - dt / 700).toFixed(2)}">${lock(x, y + HAIR_DY + dt * dt * 0.0005, h, p)}</g>`;
  }).join('');
}

function tail(p, ends) {
  const k = 0.55 + 0.45 * longness(ends);
  return [
    `<g transform="translate(209 137) scale(1 ${k}) translate(-209 -137)">${shape('M209 137 C254 167 254 267 219 317 C239 247 229 187 204 167 Z', p)}</g>`,
    `${cap(p)}<circle cx="210" cy="149" r="9" fill="#ffd43b"/>`,
  ];
}

// twee vlechten met een scheiding in het midden (gemaakt met de puntkam)
function braids(p, ends) {
  const y = Math.round(235 + 95 * longness(ends));
  const d = `${braid(94, -26, y)} ${braid(206, 26, y)}`;
  return ['', `${cap(p)}<path d="M150 66 L150 92" stroke="rgba(255,255,255,0.75)" stroke-width="3" stroke-linecap="round"/>`
    + `<path d="${d}" fill="none" stroke="${p.line}" stroke-width="25" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${p.fill}" stroke-width="22" stroke-linecap="round"/>`
    + `<path d="${d}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="6" stroke-dasharray="14 12" stroke-linecap="round"/>`
    + `<circle cx="98" cy="${y + 2}" r="8" fill="#ff8ac8"/><circle cx="202" cy="${y + 2}" r="8" fill="#ff8ac8"/>`];
}

function highBun(p) {
  return ['', `${cap(p)}${shape('M150 22 a32 32 0 1 0 0.1 0 z', p)}<circle cx="150" cy="54" r="12" fill="rgba(255,255,255,0.3)"/>`];
}

// laag in de nek, zodat er een hoed overheen past
function lowBun(p) {
  return [`${shape('M208 154 a24 24 0 1 0 0.1 0 z', p)}<circle cx="208" cy="178" r="9" fill="rgba(255,255,255,0.3)"/>`, cap(p)];
}

// opgestoken met krullen langs het gezicht, parels en een bloem
function wedding(p) {
  const curl = (x, s) => `<path d="M${x} 150 c${-10 * s} 16 ${10 * s} 26 0 40 c${-10 * s} 14 ${8 * s} 22 0 34" fill="none" stroke="${p.line}" stroke-width="11" stroke-linecap="round"/>`
    + `<path d="M${x} 150 c${-10 * s} 16 ${10 * s} 26 0 40 c${-10 * s} 14 ${8 * s} 22 0 34" fill="none" stroke="${p.fill}" stroke-width="9" stroke-linecap="round"/>`;
  return [
    `${shape('M190 42 a30 30 0 1 0 0.1 0 z', p)}<path d="M178 72 c6 -14 26 -10 24 4 c-2 12 -18 10 -16 0" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="4" stroke-linecap="round"/>`,
    cap(p) + curl(94, 1) + curl(206, -1)
      + pearls([[102, 106], [114, 86], [132, 72], [152, 66], [170, 70]])
      + '<g fill="#fff"><circle cx="208" cy="48" r="7"/><circle cx="220" cy="56" r="7"/><circle cx="216" cy="70" r="7"/><circle cx="202" cy="70" r="7"/><circle cx="198" cy="56" r="7"/></g><circle cx="209" cy="60" r="6" fill="#ffd43b"/>',
  ];
}

export const STYLE_SVG = [loose, tail, braids, highBun, lowBun, wedding];
