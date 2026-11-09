// De tekeningen van de moskee: de wasplaats voor wudu (met de stappen die al gedaan
// zijn) en de lucht bij elk gebed, met de moskee en een gebedskleed.
import { WUDU, PRAYERS, askedPrayer, prayersDone, wuduDone } from './mosque.js';
import { sceneSvg } from './ui.js';

const dots = (list, r) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
const WASH = '<rect x="30" y="0" width="240" height="340" rx="14" fill="#d8f3f0"/>'
  + '<g stroke="#fff" stroke-width="2" opacity="0.8"><path d="M30 70h240M30 140h240M30 210h240M110 0v280M190 0v280"/></g>'
  + '<rect x="30" y="280" width="240" height="60" fill="#8fd0c8"/>'
  + '<rect x="52" y="96" width="14" height="40" rx="5" fill="#d4af37"/><path d="M59 110 h30 v14" fill="none" stroke="#d4af37" stroke-width="9" stroke-linecap="round"/>'
  + '<path d="M89 130 V236" stroke="#8ad8ff" stroke-width="7" stroke-linecap="round"/>'
  + '<path d="M46 236 H132 L122 276 H56 Z" fill="#fff" stroke="#b9e3de" stroke-width="3"/><ellipse cx="89" cy="238" rx="38" ry="7" fill="#bfe6ff"/>'
  + '<text x="90" y="66" text-anchor="middle" font-size="15" fill="#b8860b">Bismillah</text>';

// de zeven stappen: wat gedaan is krijgt een vinkje en zijn naam, de rest een nummer
export function wuduSvg(mosque) {
  const rows = WUDU.map((name, i) => {
    const y = 34 + i * 35;
    const ok = i < mosque.wudu;
    return `<rect x="150" y="${y - 14}" width="108" height="28" rx="14" fill="#fff" stroke="${ok ? '#43a047' : '#b9e3de'}" stroke-width="3"/>`
      + `<circle cx="166" cy="${y}" r="10" fill="${ok ? '#43a047' : '#1e8f84'}"/><text x="166" y="${y + 4}" text-anchor="middle" font-size="11" fill="#fff">${ok ? '✓' : i + 1}</text>`
      + `<text x="182" y="${y + 4}" font-size="12" fill="${ok ? '#1b5e20' : '#9bb8b4'}">${ok ? name : '?'}</text>`;
  }).join('');
  const shine = wuduDone(mosque) ? `<g fill="#ffd43b">${dots([[60, 180], [118, 170], [70, 300], [116, 306]], 5)}</g>` : '';
  return sceneSvg('De wasplaats voor wudu', WASH + rows + shine);
}

// per gebed: de lucht (boven, onder), de zon of maan en de kleur van de moskee
const SKY = [
  { top: '#2b3a67', low: '#f7b7a3', sun: [250, 234, '#ffcf87'], dark: true },
  { top: '#4db4f5', low: '#cdeeff', sun: [150, 54, '#ffe066'] },
  { top: '#6fb7f0', low: '#ffe2b0', sun: [70, 122, '#ffc24d'] },
  { top: '#4a3470', low: '#ff9a5a', sun: [62, 234, '#ff7a3d'], dark: true },
  { top: '#0b1030', low: '#1d2a5a', moon: true, dark: true },
];
const STARS = `<g fill="#fff" opacity="0.9">${dots([[60, 40], [104, 78], [150, 30], [198, 66], [240, 34], [226, 112], [76, 124], [128, 108]], 2)}</g>`;
const MOON = '<path d="M206 40 A22 22 0 1 0 228 76 A17 17 0 1 1 206 40 Z" fill="#fff3c4"/>';

function mosqueSvg(dark) {
  const wall = dark ? '#1c3b4a' : '#2f9c8f';
  return `<g fill="${wall}"><rect x="84" y="176" width="112" height="60"/><path d="M96 178 C96 124 184 124 184 178 Z"/>`
    + '<rect x="208" y="96" width="22" height="140"/><path d="M204 100 L219 62 L234 100 Z"/></g>'
    + '<path d="M140 124 v-12 M219 62 v-10" stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>'
    + '<path d="M128 236 V204 C128 186 152 186 152 204 V236 Z" fill="#ffd98a"/>';
}

const MAT = '<path d="M106 262 H194 L206 330 H94 Z" fill="#c0392b"/><path d="M114 270 H186 L194 322 H106 Z" fill="none" stroke="#ffd43b" stroke-width="3"/>'
  + '<path d="M136 318 V296 C136 280 164 280 164 296 V318 Z" fill="#ffd43b" opacity="0.85"/>';

export function prayerSvg(mosque) {
  const done = prayersDone(mosque);
  const sky = SKY[done ? 4 : PRAYERS.indexOf(askedPrayer(mosque))];
  const light = sky.moon ? MOON + STARS : `<circle cx="${sky.sun[0]}" cy="${sky.sun[1]}" r="24" fill="${sky.sun[2]}"/>`;
  const title = done ? '<text x="150" y="150" text-anchor="middle" font-size="18" fill="#ffd43b">Alle vijf gebeden!</text>' : '';
  return sceneSvg('De moskee', `<defs><linearGradient id="lucht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky.top}"/><stop offset="1" stop-color="${sky.low}"/></linearGradient></defs>`
    + `<rect x="30" y="0" width="240" height="340" rx="14" fill="url(#lucht)"/>${light}${mosqueSvg(sky.dark)}`
    + `<rect x="30" y="236" width="240" height="104" fill="${sky.dark ? '#24424a' : '#7fc8a0'}"/>${MAT}${title}`);
}
