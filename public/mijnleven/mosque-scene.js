// De tekeningen van de moskee: de wasplaats voor wudu (met de stappen die al gedaan
// zijn) en de lucht bij elk gebed, met de moskee en een gebedskleed.
import { WUDU, PRAYERS, askedPrayer, prayersDone, wuduDone } from './mosque.js';
import { sceneSvg } from './ui.js';
import { wall, tiles, grad, glow, sparkles } from './decor.js';
import { gloss, light, dark } from './glans.js';

const dots = (list, r) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
// de wasplaats: tegels met een rij boogjes, een gouden kraan en een witte bak
const ARCHES = `<g fill="none" stroke="#d4af37" stroke-width="2.5">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${30 + i * 40} 30 q20 -26 40 0"/>`).join('')}</g>`;
const WASH = wall('#def5f2') + tiles(0, 280, '#bfe8e2', 40) + tiles(280, 340, '#8fd0c8', 30, 'vloer') + ARCHES
  + grad('goud', '#ffe59a', '#b8860b', 0.4, 1) + grad('bak', '#ffffff', '#dcefec')
  + '<rect x="52" y="96" width="14" height="40" rx="5" fill="url(#g-goud)" stroke="#8a6508" stroke-width="1.2"/><path d="M59 110 h30 v14" fill="none" stroke="#8a6508" stroke-width="11" stroke-linecap="round"/><path d="M59 110 h30 v14" fill="none" stroke="url(#g-goud)" stroke-width="8" stroke-linecap="round"/>'
  + '<path d="M89 130 V236" stroke="#8ad8ff" stroke-width="7" stroke-linecap="round"/><path d="M87 134 V230" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>'
  + '<path d="M46 236 H132 L122 276 H56 Z" fill="url(#g-bak)" stroke="#9fcfc8" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="89" cy="238" rx="38" ry="7" fill="#bfe6ff" stroke="#9fcfc8" stroke-width="1.5"/>' + gloss(70, 254, 6, 12)
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
  const shine = wuduDone(mosque) ? `<g fill="#ffd43b">${dots([[60, 180], [118, 170], [70, 300], [116, 306]], 5)}</g>${sparkles([[100, 160, 5], [130, 300, 4]])}` : '';
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

// de moskee met een koepel, een minaret, gouden maantjes en verlichte ramen
function mosqueSvg(night) {
  const c = night ? '#1f4a5c' : '#2f9c8f';
  const win = night ? '#ffd98a' : '#bfe8e2';
  return grad('muur-m', light(c, 0.25), dark(c, 0.15), 0.4, 1) + grad('koepel', light(c, 0.45), dark(c, 0.1), 0.6, 1)
    + `<rect x="84" y="176" width="112" height="60" fill="url(#g-muur-m)" stroke="${dark(c, 0.4)}" stroke-width="1.5"/>`
    + `<path d="M96 178 C96 124 184 124 184 178 Z" fill="url(#g-koepel)" stroke="${dark(c, 0.4)}" stroke-width="1.5"/>` + gloss(120, 150, 10, 16, -30)
    + `<rect x="208" y="96" width="22" height="140" fill="url(#g-muur-m)" stroke="${dark(c, 0.4)}" stroke-width="1.5"/><path d="M204 100 L219 62 L234 100 Z" fill="url(#g-koepel)" stroke="${dark(c, 0.4)}" stroke-width="1.5"/>`
    + `<g fill="${win}">${[100, 164].map((x) => `<path d="M${x} 222 V206 C${x} 196 ${x + 14} 196 ${x + 14} 206 V222 Z"/>`).join('')}<rect x="214" y="140" width="10" height="16" rx="5"/></g>`
    + '<g fill="none" stroke="#d4af37" stroke-width="3" stroke-linecap="round"><path d="M140 124 v-12"/><path d="M219 62 v-10"/></g><g fill="#d4af37"><path d="M140 112 a5 5 0 1 0 0.1 0z"/><path d="M219 52 a4 4 0 1 0 0.1 0z"/></g>'
    + '<path d="M128 236 V204 C128 186 152 186 152 204 V236 Z" fill="#ffd98a" stroke="#b8860b" stroke-width="1.2"/>';
}

const MAT = grad('kleed-m', '#e05a4a', '#9c2a1e', 0.3, 1) + '<path d="M106 262 H194 L206 330 H94 Z" fill="url(#g-kleed-m)" stroke="#7a1f14" stroke-width="1.5"/><path d="M114 270 H186 L194 322 H106 Z" fill="none" stroke="#ffd43b" stroke-width="3"/>'
  + '<path d="M136 318 V296 C136 280 164 280 164 296 V318 Z" fill="#ffd43b" opacity="0.85"/><g stroke="#ffd43b" stroke-width="2" stroke-linecap="round"><path d="M98 334 v4 M110 334 v4 M122 334 v4 M134 334 v4 M146 334 v4 M158 334 v4 M170 334 v4 M182 334 v4 M194 334 v4"/></g>';

export function prayerSvg(mosque) {
  const done = prayersDone(mosque);
  const sky = SKY[done ? 4 : PRAYERS.indexOf(askedPrayer(mosque))];
  const glowing = sky.moon ? MOON + STARS : `<circle cx="${sky.sun[0]}" cy="${sky.sun[1]}" r="24" fill="${sky.sun[2]}"/>`;
  const title = done ? '<text x="150" y="150" text-anchor="middle" font-size="18" fill="#ffd43b">Alle vijf gebeden!</text>' : '';
  const ground = sky.dark ? grad('gras', '#2e5460', '#1b353d') : grad('gras', '#9ddc9a', '#5fb376');
  return sceneSvg('De moskee', grad('lucht', sky.top, sky.low) + glow('zon', sky.sun ? sky.sun[2] : '#fff3c4')
    + `<rect x="30" y="0" width="240" height="340" rx="14" fill="url(#g-lucht)"/>`
    + (sky.sun ? `<circle cx="${sky.sun[0]}" cy="${sky.sun[1]}" r="60" fill="url(#g-zon)"/>` : '') + `${glowing}${mosqueSvg(sky.dark)}`
    + `${ground}<rect x="30" y="236" width="240" height="104" fill="url(#g-gras)"/>${MAT}${title}`);
}
