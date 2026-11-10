// De tekening van de winkel: de etalage met het meisje die past wat je bekijkt, en
// het prijskaartje.
import { dollSvg } from './doll.js';
import { bustSvg } from './hair.js';
import { MAKEUP } from './makeup.js';
import { parseKey } from './shop.js';
import { sceneSvg } from './ui.js';
import { wall, planks, grad, glow, shadow } from './decor.js';
import { paint, defs, gloss } from './glans.js';

const COLORS = ['#ff8ac8', '#5ec8ff', '#ffd43b', '#b36bff', '#4cd4a0', '#ff7a59', '#e0245e', '#2b2b2b', '#c2419a'];
const P = Object.fromEntries(COLORS.map((c) => [c, paint(c)]));
const item = (d, c) => `<path d="${d}" fill="${P[c].fill}" stroke="${P[c].line}" stroke-width="1.2" stroke-linejoin="round"/>`;
const SHOP = defs(Object.values(P)) + wall('#fff3d6', 300) + glow('spot', '#fff8d6') + '<ellipse cx="150" cy="180" rx="100" ry="150" fill="url(#g-spot)"/>'
  // de luifel
  + `<path d="M30 0 H270 V34 L250 48 L230 34 L210 48 L190 34 L170 48 L150 34 L130 48 L110 34 L90 48 L70 34 L50 48 L30 34 Z" fill="${P['#c2419a'].fill}" stroke="${P['#c2419a'].line}" stroke-width="1.5"/>`
  + '<g fill="#fff" opacity="0.55"><rect x="50" y="0" width="20" height="40"/><rect x="90" y="0" width="20" height="40"/><rect x="130" y="0" width="20" height="40"/><rect x="170" y="0" width="20" height="40"/><rect x="210" y="0" width="20" height="40"/><rect x="250" y="0" width="20" height="40"/></g>'
  + '<rect x="30" y="0" width="240" height="6" fill="#fff" opacity="0.5"/>'
  // de planken met spulletjes
  + grad('plank', '#d9a86c', '#b5793a') + '<g fill="url(#g-plank)" stroke="#8a4f22" stroke-width="1.2"><rect x="40" y="96" width="60" height="7" rx="3"/><rect x="40" y="166" width="60" height="7" rx="3"/><rect x="200" y="96" width="60" height="7" rx="3"/><rect x="200" y="166" width="60" height="7" rx="3"/></g>'
  + item('M50 74 h18 a4 4 0 0 1 4 4 v14 a4 4 0 0 1 -4 4 h-18 a4 4 0 0 1 -4 -4 v-14 a4 4 0 0 1 4 -4 z', '#ff8ac8') + item('M78 80 h8 a8 8 0 0 1 0 16 h-8 a8 8 0 0 1 0 -16 z', '#5ec8ff')
  + item('M56 146 a10 10 0 1 0 0.1 0 z', '#ffd43b') + item('M76 146 h14 a4 4 0 0 1 4 4 v12 a4 4 0 0 1 -4 4 h-14 a4 4 0 0 1 -4 -4 v-12 a4 4 0 0 1 4 -4 z', '#b36bff')
  + item('M209 78 h16 a3 3 0 0 1 3 3 v12 a3 3 0 0 1 -3 3 h-16 a3 3 0 0 1 -3 -3 v-12 a3 3 0 0 1 3 -3 z', '#4cd4a0') + item('M246 76 a10 10 0 1 0 0.1 0 z', '#ff7a59')
  + item('M214 150 h2 a8 8 0 0 1 0 16 h-2 a8 8 0 0 1 0 -16 z', '#e0245e') + item('M236 166 l6 -18 6 18z', '#2b2b2b')
  + gloss(54, 80, 4, 3, -30) + gloss(52, 152, 3, 2) + gloss(244, 82, 3, 2)
  + planks(300, '#d8b98c') + grad('podium', '#fff8e6', '#e6cfa0') + '<ellipse cx="150" cy="300" rx="72" ry="11" fill="url(#g-podium)" stroke="#c9a46a" stroke-width="1.5"/>' + shadow(150, 302, 60, 5);

// de prijs, of wat je al hebt
function tag(item, owned) {
  const text = owned ? 'Van jou!' : `${item.price} ★`;
  return `<rect x="96" y="298" width="108" height="34" rx="17" fill="#fff" stroke="#ffd43b" stroke-width="3"/>`
    + `<text x="150" y="321" text-anchor="middle" font-size="17" fill="${owned ? '#1b5e20' : '#8a6400'}">${text}</text>`;
}

// het meisje past het: kleren van top tot teen, make-up en haarspullen van dichtbij
function trying(item, look) {
  const [kind, index] = parseKey(item.key);
  if (item.group === 'kleren') {
    const outfit = { ...look.outfit, choice: { ...look.outfit.choice, [kind]: index } };
    return dollSvg(outfit, look.makeup).replace('<svg ', '<svg x="82" y="52" width="136" height="236" ');
  }
  const hair = { ...look.hair, hijab: item.group === 'makeup' ? look.hair.hijab : false, hat: item.group === 'haar' ? index : look.hair.hat };
  const makeup = item.group === 'makeup' ? { ...look.makeup, [kind]: MAKEUP[kind][index][0] } : look.makeup;
  return bustSvg(look.outfit, hair, makeup).replace('<svg ', '<svg x="60" y="56" width="180" height="236" ');
}

// item = wat je bekijkt (of null), look = { outfit, hair, makeup }, owned = heb je het al
export function shopSvg(item, look, owned) {
  const inside = item ? trying(item, look) + tag(item, owned) : dollSvg(look.outfit, look.makeup).replace('<svg ', '<svg x="82" y="52" width="136" height="236" ');
  return sceneSvg('De winkel', SHOP + inside);
}
