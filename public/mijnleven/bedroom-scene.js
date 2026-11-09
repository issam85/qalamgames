// De tekeningen van de slaapkamer: de kamer met het bed (overdag, in pyjama of
// 's nachts slapend) en het muziekdoosje met acht toetsen.
import { dollSvg, face, arms, soft, SKIN } from './doll.js';
import { STYLE_SVG } from './hair-styles.js';
import { sceneSvg } from './ui.js';

export const PYJAMAS = ['Effen', 'Sterren', 'Strepen', 'Stippen'];
const dots = (list, r) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
const STAR = 'l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z';
// het patroon op het pyjamajasje, zelfde volgorde als PYJAMAS
const PATTERN = [
  '',
  `<g fill="#ffd43b"><path d="M124 190 ${STAR}"/><path d="M168 240 ${STAR}"/><path d="M132 268 ${STAR}"/></g>`,
  '<g fill="#fff" opacity="0.6"><rect x="108" y="180" width="84" height="12"/><rect x="106" y="220" width="88" height="12"/><rect x="104" y="260" width="92" height="12"/></g>',
  `<g fill="#fff" opacity="0.8">${dots([[128, 186], [170, 200], [142, 232], [176, 256], [124, 274], [156, 288]], 7)}</g>`,
];

const ROOM = '<rect x="30" y="0" width="240" height="340" rx="14" fill="#e9defc"/>'
  + '<rect x="56" y="24" width="64" height="70" rx="8" fill="#1d2a5a" stroke="#fff" stroke-width="5"/><path d="M98 40 A16 16 0 1 0 108 68 A13 13 0 1 1 98 40 Z" fill="#fff3c4"/>'
  + `<g fill="#fff">${dots([[68, 40], [78, 76], [106, 82]], 1.8)}</g>`
  + '<rect x="30" y="270" width="240" height="70" fill="#d8b98c"/><ellipse cx="150" cy="312" rx="100" ry="18" fill="#b79cf2" opacity="0.6"/>';
const BED = '<rect x="40" y="164" width="16" height="120" rx="6" fill="#b5793a"/><rect x="170" y="216" width="12" height="68" rx="5" fill="#b5793a"/>'
  + '<rect x="52" y="226" width="124" height="40" rx="8" fill="#fff" stroke="#e6d6f5" stroke-width="2"/><ellipse cx="80" cy="222" rx="24" ry="11" fill="#fff" stroke="#e6d6f5" stroke-width="2"/>';
const blanket = (color) => `<rect x="100" y="216" width="78" height="54" rx="10" fill="${color}"/><rect x="100" y="216" width="78" height="12" rx="6" fill="#fff" opacity="0.7"/>`;

// het meisje staat naast het bed: in haar pyjama (los haar), of nog in haar kleren
function standing(look) {
  const place = 'x="138" y="96" width="135" height="234"';
  if (!look.inPyjama) return dollSvg(look.outfit, look.makeup).replace('<svg ', `<svg ${place} `);
  const c = soft(look.pyjama.color);
  const leg = `<path d="M106 300 L148 300 L146 494 L110 494 Z" fill="${c}"/><ellipse cx="128" cy="500" rx="24" ry="9" fill="#fff" stroke="#e6d6f5" stroke-width="2"/>`;
  const [back, front] = STYLE_SVG[0](look.hair.color, look.hair.ends);
  return `<svg ${place} viewBox="0 0 300 520">${back}${leg}<g transform="translate(300 0) scale(-1 1)">${leg}</g>`
    + `<path d="M110 150 L190 150 L198 312 L102 312 Z" fill="${c}"/>${PATTERN[look.pyjama.kind]}${arms(c)}${front}${face(look.makeup)}</svg>`;
}

// ze ligt in bed: alleen haar hoofd op het kussen, ogen dicht
function asleep(look) {
  return `<ellipse cx="82" cy="212" rx="17" ry="19" fill="${SKIN}"/>`
    + `<path d="M65 210 C63 184 101 184 99 210 C92 198 72 198 65 210 Z" fill="${look.hair.color}"/>`
    + '<path d="M72 212 q4 4 8 0 M85 212 q4 4 8 0" fill="none" stroke="#3a2a2a" stroke-width="2.5" stroke-linecap="round"/>'
    + '<path d="M77 221 q5 4 10 0" fill="none" stroke="#c0392b" stroke-width="2.5" stroke-linecap="round"/>'
    + '<text x="108" y="190" font-size="20" fill="#fff">Zzz</text>';
}

// look = { outfit, makeup, hair, pyjama, inPyjama, night }
export function bedroomSvg(look) {
  const cover = blanket(look.inPyjama ? soft(look.pyjama.color) : '#ff9ecf');
  if (!look.night) return sceneSvg('Jouw slaapkamer', ROOM + BED + cover + standing(look));
  return sceneSvg('Je slaapt', `${ROOM + BED + asleep(look) + cover}<rect x="30" y="0" width="240" height="340" rx="14" fill="#0b1030" opacity="0.5"/>`
    + '<text x="150" y="150" text-anchor="middle" font-size="20" fill="#fff3c4">Welterusten...</text>');
}

const KEY_COLORS = ['#e53935', '#ff7a59', '#ffd43b', '#4cd4a0', '#5ec8ff', '#1e88e5', '#b36bff', '#ff8ac8'];
const keyX = (i) => 44 + i * 27;

// welke toets ligt er onder de muis of vinger? -1 = geen
export function keyAt(p) {
  const i = Math.floor((p.x - 44) / 27);
  return p.y > 170 && p.y < 330 && i >= 0 && i < KEY_COLORS.length ? i : -1;
}

// lit = de toets die nu klinkt (-1 = geen)
export function musicSvg(lit) {
  const keys = KEY_COLORS.map((color, i) => `<rect x="${keyX(i)}" y="178" width="23" height="${140 - i * 9}" rx="8" fill="${color}" stroke="#fff" stroke-width="${i === lit ? 5 : 2}" ${i === lit ? '' : 'opacity="0.85"'}/>`).join('');
  const notes = lit >= 0 ? `<text x="${keyX(lit) + 4}" y="166" font-size="22" fill="#c2419a">♪</text>` : '';
  return sceneSvg('Het muziekdoosje', '<rect x="30" y="0" width="240" height="340" rx="14" fill="#e9defc"/>'
    + '<path d="M70 70 L230 70 L214 30 L86 30 Z" fill="#ffd1ec" stroke="#ffd43b" stroke-width="3"/><rect x="62" y="70" width="176" height="68" rx="10" fill="#c2419a" stroke="#ffd43b" stroke-width="3"/>'
    + '<text x="150" y="112" text-anchor="middle" font-size="18" fill="#fff">Muziekdoosje</text>'
    + keys + notes);
}
