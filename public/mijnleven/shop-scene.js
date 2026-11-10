// De tekening van de winkel: de etalage met het meisje die past wat je bekijkt, en
// het prijskaartje.
import { dollSvg } from './doll.js';
import { bustSvg } from './hair.js';
import { MAKEUP } from './makeup.js';
import { parseKey } from './shop.js';
import { sceneSvg } from './ui.js';

const SHOP = '<rect x="30" y="0" width="240" height="340" rx="14" fill="#fff3d6"/>'
  // de luifel
  + '<path d="M30 0 H270 V34 L250 48 L230 34 L210 48 L190 34 L170 48 L150 34 L130 48 L110 34 L90 48 L70 34 L50 48 L30 34 Z" fill="#c2419a"/>'
  + '<g fill="#fff" opacity="0.5"><rect x="50" y="0" width="20" height="40"/><rect x="90" y="0" width="20" height="40"/><rect x="130" y="0" width="20" height="40"/><rect x="170" y="0" width="20" height="40"/><rect x="210" y="0" width="20" height="40"/><rect x="250" y="0" width="20" height="40"/></g>'
  // de planken met spulletjes
  + '<rect x="40" y="96" width="60" height="6" rx="3" fill="#b5793a"/><rect x="40" y="166" width="60" height="6" rx="3" fill="#b5793a"/><rect x="200" y="96" width="60" height="6" rx="3" fill="#b5793a"/><rect x="200" y="166" width="60" height="6" rx="3" fill="#b5793a"/>'
  + '<g><rect x="46" y="74" width="18" height="22" rx="4" fill="#ff8ac8"/><rect x="70" y="80" width="24" height="16" rx="8" fill="#5ec8ff"/><circle cx="56" cy="156" r="10" fill="#ffd43b"/><rect x="72" y="146" width="22" height="20" rx="4" fill="#b36bff"/>'
  + '<rect x="206" y="78" width="22" height="18" rx="3" fill="#4cd4a0"/><circle cx="246" cy="86" r="10" fill="#ff7a59"/><rect x="206" y="150" width="18" height="16" rx="8" fill="#e0245e"/><path d="M236 166 l6 -18 6 18z" fill="#2b2b2b"/></g>'
  + '<rect x="30" y="300" width="240" height="40" fill="#d8b98c"/><ellipse cx="150" cy="300" rx="70" ry="10" fill="rgba(0,0,0,0.12)"/>';

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
