// De tekeningen van de kapsels (zelfde volgorde als STYLES in hair.js).
// c = haarkleur, ends = de lengte per lok. Elk kapsel geeft twee lagen terug:
// [achter het lijf, vóór het lijf].
// Los haar heeft zes lokken die vóór de schouders vallen (drie links, drie rechts).
// Elke lok heeft een eigen onderkant (y), zodat je ze los van elkaar kunt knippen.
export const STRAND_X = [92, 105, 118, 182, 195, 208];
export const MIN_END = 150;
export const MAX_END = 300;
const STRAND_W = 14;
// 0 (alles kort) – 1 (alles lang), voor de staart en de vlechten
export const longness = (ends) => (ends.reduce((a, e) => a + e, 0) / ends.length - MIN_END) / (MAX_END - MIN_END);
const lock = (x, y, h, c) => `<rect x="${x - STRAND_W / 2}" y="${y.toFixed(1)}" width="${STRAND_W}" height="${h.toFixed(1)}" rx="7" fill="${c}"/>`;

const CAP = 'M150 35 C100 35 86 82 90 137 L210 137 C214 82 200 35 150 35 Z';
const cap = (c) => `<path d="${CAP}" fill="${c}"/>`;
const pearls = (list) => `<g fill="#fff" stroke="#ffd43b" stroke-width="1.5">${list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5"/>`).join('')}</g>`;

function braid(x, bend, y) {
  const mid = 127 + (y - 127) * 0.5;
  return `M${x} 127 C${x + bend} ${mid - 20} ${x + bend * 0.6} ${mid + 30} ${x + (x < 150 ? 4 : -4)} ${y}`;
}

function loose(c, ends) {
  const e = Math.min(185, Math.max(...ends));
  const locks = ends.map((end, i) => lock(STRAND_X[i], 120, end - 120, c)
    + `<path d="M${STRAND_X[i] + 7} 140 V${end - 8}" stroke="rgba(0,0,0,0.13)" stroke-width="1.5"/>`).join('');
  return [`<path d="M150 35 C100 35 86 82 90 137 L84 ${e} C108 ${e + 10} 192 ${e + 10} 216 ${e} L210 137 C214 82 200 35 150 35 Z" fill="${c}"/>`, cap(c) + locks];
}

// afgeknipte stukjes die naar beneden vallen; pieces = [{ x, y, h, t }], t = begintijd
export function clippingsSvg(pieces, c, now) {
  return pieces.map(({ x, y, h, t }) => {
    const dt = now - t;
    return `<g opacity="${Math.max(0, 1 - dt / 700).toFixed(2)}">${lock(x, y + dt * dt * 0.0005, h, c)}</g>`;
  }).join('');
}

function tail(c, ends) {
  const k = 0.55 + 0.45 * longness(ends);
  return [
    `<g transform="translate(205 107) scale(1 ${k}) translate(-205 -107)"><path d="M205 107 C250 137 250 237 215 287 C235 217 225 157 200 137 Z" fill="${c}"/></g>`,
    `${cap(c)}<circle cx="206" cy="119" r="9" fill="#ffd43b"/>`,
  ];
}

// twee vlechten met een scheiding in het midden (gemaakt met de puntkam)
function braids(c, ends) {
  const y = Math.round(205 + 95 * longness(ends));
  const d = `${braid(96, -26, y)} ${braid(204, 26, y)}`;
  return ['', `${cap(c)}<path d="M150 36 L150 60" stroke="rgba(255,255,255,0.75)" stroke-width="3" stroke-linecap="round"/>`
    + `<path d="${d}" fill="none" stroke="${c}" stroke-width="22" stroke-linecap="round"/>`
    + `<path d="${d}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="6" stroke-dasharray="14 12" stroke-linecap="round"/>`
    + `<circle cx="100" cy="${y + 2}" r="8" fill="#ff8ac8"/><circle cx="200" cy="${y + 2}" r="8" fill="#ff8ac8"/>`];
}

function highBun(c) {
  return ['', `${cap(c)}<circle cx="150" cy="27" r="30" fill="${c}"/><circle cx="150" cy="27" r="12" fill="rgba(255,255,255,0.3)"/>`];
}

// laag in de nek, zodat er een hoed overheen past
function lowBun(c) {
  return [`<circle cx="204" cy="146" r="24" fill="${c}"/><circle cx="204" cy="146" r="9" fill="rgba(255,255,255,0.3)"/>`, cap(c)];
}

// opgestoken met krullen langs het gezicht, parels en een bloem
function wedding(c) {
  const curl = (x, s) => `<path d="M${x} 120 c${-10 * s} 16 ${10 * s} 26 0 40 c${-10 * s} 14 ${8 * s} 22 0 34" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`;
  return [
    `<circle cx="188" cy="44" r="30" fill="${c}"/><path d="M176 44 c6 -14 26 -10 24 4 c-2 12 -18 10 -16 0" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="4" stroke-linecap="round"/>`,
    cap(c) + curl(96, 1) + curl(204, -1)
      + pearls([[104, 78], [116, 58], [134, 44], [154, 38], [172, 42]])
      + '<g fill="#fff"><circle cx="206" cy="20" r="7"/><circle cx="218" cy="28" r="7"/><circle cx="214" cy="42" r="7"/><circle cx="200" cy="42" r="7"/><circle cx="196" cy="28" r="7"/></g><circle cx="207" cy="32" r="6" fill="#ffd43b"/>',
  ];
}

export const STYLE_SVG = [loose, tail, braids, highBun, lowBun, wedding];
