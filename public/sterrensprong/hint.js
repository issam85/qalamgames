// Handjes die laten zien wat je moet doen: tikken, vasthouden, tikken naar beneden, niet tikken.
// De beweging zit in de CSS (overlay.css), zodat het ook zonder lezen te snappen is.
// wijsvinger links omhoog, drie gebogen vingers ernaast, duim onderaan links (zoals 👆)
const SHAPES = `<rect x="19" y="6" width="11" height="32" rx="5.5"/><rect x="16" y="28" width="34" height="28" rx="11"/>
  <circle cx="35.5" cy="31" r="5.5"/><circle cx="42" cy="32.5" r="5.5"/><circle cx="47.5" cy="36" r="5"/>
  <ellipse cx="16" cy="44" rx="5" ry="8" transform="rotate(-20 16 44)"/>`;
// eerst een dikke donkere rand, daarover de witte hand: één nette omtrek
const HAND = `<g class="hand"><g fill="#2a1a66" stroke="#2a1a66" stroke-width="6" stroke-linejoin="round">${SHAPES}</g>
  <g fill="#fff">${SHAPES}</g></g>`;
const RIPPLE = '<circle class="ripple" cx="24.5" cy="6" r="7" fill="none" stroke="#ffd43b" stroke-width="3.5"/>';
const arrow = (color, up) => `<path d="${up ? 'M64 36V10m-8 8 8-8 8 8' : 'M64 8v26m-8-8 8 8 8-8'}" fill="none" stroke="${color}"
  stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
const NO = '<circle cx="36" cy="34" r="27" fill="none" stroke="#ff3b3b" stroke-width="5"/><path d="M17 15 55 53" stroke="#ff3b3b" stroke-width="5"/>';
const draw = (kind, body) => `<svg class="hint-${kind}" viewBox="0 0 76 64" aria-hidden="true">${body}</svg>`;

export const HANDS = {
  tap: draw('tap', RIPPLE + HAND),
  hold: draw('hold', HAND + arrow('#5cf2d6', true)),
  down: draw('tap', RIPPLE + HAND + arrow('#ff9f43', false)),
  no: draw('no', HAND + NO),
};

let shown = null;

// handje onder de lantaarn; null = weg
export function showHint(kind, text = '') {
  const key = kind && `${kind}:${text}`;
  if (key === shown) return;
  shown = key;
  const element = document.getElementById('hint');
  element.hidden = !kind;
  if (!kind) return;
  element.innerHTML = HANDS[kind];
  const words = document.createElement('span');
  words.textContent = text;
  element.append(words);
}
