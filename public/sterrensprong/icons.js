// Kleine plaatjes (SVG) voor meldingen, knoppen en het menu: zien in plaats van lezen.
const svg = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;

export const HEART_PATH = 'M12 21s-7.5-4.7-10-9.3C.5 8.2 2.4 4.5 6 4.5c2.2 0 3.9 1.2 6 3.6 2.1-2.4 3.8-3.6 6-3.6 3.6 0 5.5 3.7 4 7.2C19.5 16.3 12 21 12 21z';
const CRACK = 'L10.5 10.5 13 13.5 11 16.5z';
const STAR_PATH = 'M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5 1.4-7.1-5.3-5 7.2-.9z';

const diamond = (color) => svg(`<path d="M12 2 21 12 12 22 3 12z" fill="${color}" stroke="#fff" stroke-width="1.6"/>`);

export const ICONS = {
  heart: svg(`<path d="${HEART_PATH}" fill="#ff4d6d"/>`),
  // gebroken hartje: twee helften die uit elkaar vallen
  broken: svg(`<g fill="#ff4d6d">
    <path d="M12 21s-7.5-4.7-10-9.3C.5 8.2 2.4 4.5 6 4.5c2.2 0 3.9 1.2 6 3.6${CRACK}" transform="rotate(-12 12 21) translate(-1 0)"/>
    <path d="M12 21s7.5-4.7 10-9.3C23.5 8.2 21.6 4.5 18 4.5c-2.2 0-3.9 1.2-6 3.6${CRACK}" transform="rotate(12 12 21) translate(1 0)"/>
  </g>`),
  gold: diamond('#ffd43b'),
  green: diamond('#7dff9b'),
  star: svg(`<path d="${STAR_PATH}" fill="#ffd43b" stroke="#c62828" stroke-width="1"/>`),
  lock: svg(`<path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="currentColor" stroke-width="2.6"/>
    <rect x="5" y="10" width="14" height="11" rx="2.5" fill="currentColor"/>`),
  play: svg('<path d="M7.5 4.5v15l12-7.5z" fill="currentColor"/>'),
  home: svg(`<path d="M3 11.5 12 4l9 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 11v9h4.5v-5h3v5H18v-9" fill="currentColor"/>`),
  pause: svg('<rect x="6" y="4.5" width="4.2" height="15" rx="1.4" fill="currentColor"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.4" fill="currentColor"/>'),
  infinity: svg(`<path d="M7 8.5c-2 0-3.5 1.6-3.5 3.5S5 15.5 7 15.5c3.5 0 6.5-7 10-7 2 0 3.5 1.6 3.5 3.5S19 15.5 17 15.5c-3.5 0-6.5-7-10-7z"
    fill="none" stroke="currentColor" stroke-width="2.4"/>`),
};

// ster met een getal erin, voor een nieuw record
export const starWith = (number) => svg(`<path d="${STAR_PATH}" fill="#ffd43b" stroke="#c62828" stroke-width="1"/>
  <text x="12" y="14.6" text-anchor="middle" font-size="6.4" font-weight="700" fill="#7a2a00">${number}</text>`);

// voortgangsring met het beste percentage (menu)
export function ring(percent) {
  const dash = (percent / 100) * 94.25;
  return `<svg viewBox="0 0 36 36" aria-hidden="true">
    <circle cx="18" cy="18" r="15" fill="none" stroke="#ddd6ff" stroke-width="5"/>
    <circle cx="18" cy="18" r="15" fill="none" stroke="#ffb300" stroke-width="5" stroke-dasharray="${dash} 94.25" transform="rotate(-90 18 18)"/>
    ${percent ? `<text x="18" y="21.5" text-anchor="middle" font-size="10" font-weight="700" fill="#2a1a66">${percent}</text>` : ''}
  </svg>`;
}
