// De prinses: bouwt de SVG op uit haar haar, huid en gekozen kleren, laag voor laag,
// in de Glans-stijl. Vak 300 × 520: hoofd rond (150, 118), schouders op 196, handen op
// (90, 330) en (210, 330), voeten rond x = 120 en 180.
import { PRINCESSES, MATCH } from './data.js';
import { DRESSES, bodice, sleeves } from './dresses.js';
import { CROWNS, NECKLACES, SHOES } from './jewels.js';
import { hairBack, hairCrown, hairFront } from './hair.js';
import { paint, skinPaint, svg, mirror, irisFill, INK } from './glans.js';
import { pants, tunic, sleeves as swimSleeves } from './swim.js';

// wit valt weg tegen een lichte achtergrond: dan een heel lichte grijstint
const soft = (hex) => (hex === '#ffffff' ? '#f4f4f4' : hex);

const eye = (iris) => `<ellipse cx="131" cy="118" rx="10" ry="12.5" fill="#fff"/><circle cx="132" cy="120" r="7.2" fill="${iris}"/><circle cx="132.5" cy="121" r="4.2" fill="#1d1016"/>`
  + '<circle cx="128.5" cy="116" r="3" fill="#fff"/><circle cx="135" cy="124" r="1.4" fill="#fff" opacity="0.9"/>'
  + `<path d="M120 116 Q131 101.5 142 115" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`
  + `<path d="M120 116 l-3.5 -3 M123 107 l-3 -3.5 M127 104.5 l-1.5 -4" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
const brow = (c) => `<path d="M119 96.5 Q131 89.5 142 95.5" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/>`;
const MOUTH = '<path d="M138 146 Q150 162 162 146 Q150 152 138 146 Z" fill="#e8605f"/><path d="M138 146 Q150 160 162 146" fill="none" stroke="#b83b3b" stroke-width="2.2" stroke-linecap="round"/>';

function face(pr, skin) {
  return `<ellipse cx="150" cy="118" rx="44" ry="50" fill="${skin.fill}" stroke="${skin.line}" stroke-width="1.2"/>`
    + mirror(eye(irisFill(pr.eyes)) + brow(paint(pr.hair).line))
    + `<path d="M148 134 q2 4 5 1" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2" stroke-linecap="round"/>${MOUTH}`
    + mirror('<ellipse cx="120" cy="138" rx="11" ry="7" fill="url(#blush)"/>');
}

// hals, schouders, benen en armen in de huidkleur
function body(skin) {
  const s = `fill="${skin.fill}" stroke="${skin.line}" stroke-width="1.4"`;
  return {
    legs: mirror(`<rect x="112" y="300" width="16" height="200" rx="8" ${s}/>`),
    torso: `<rect x="138" y="150" width="24" height="56" ${s}/>`
      + `<path d="M150 194 C128 194 112 198 106 212 C104 224 112 234 120 238 L180 238 C188 234 196 224 194 212 C188 198 172 194 150 194 Z" ${s}/>`,
    arms: mirror(`<path d="M116 210 C100 250 92 290 90 322" fill="none" stroke="${skin.line}" stroke-width="20" stroke-linecap="round"/>`
      + `<path d="M116 210 C100 250 92 290 90 322" fill="none" stroke="${skin.c}" stroke-width="17" stroke-linecap="round"/>`
      + `<circle cx="90" cy="330" r="12" ${s}/>`),
  };
}

// princess = nummer in PRINCESSES; outfit = { choice: {…}, color: {…} };
// box = welk stuk je ziet (bij het kiezen alleen het bovenlijf)
export function princessSvg(princess, outfit, label = 'Jouw prinses', box = '0 0 300 520') {
  const pr = PRINCESSES[princess];
  const skin = skinPaint(pr.skin);
  const hair = paint(pr.hair);
  const { choice, color } = outfit;
  const p = (key) => paint(soft(key === 'ketting' && color.ketting === MATCH ? color.jurk : color[key]));
  const dress = DRESSES[choice.jurk];
  const b = body(skin);
  const inner = '<ellipse cx="150" cy="510" rx="90" ry="9" fill="rgba(0,0,0,0.2)"/>'
    + hairBack(pr.style, hair) + (dress.train ? dress.train(p('jurk')) : '')
    + b.legs + b.torso + dress.skirt(p('jurk')) + bodice(dress, p('jurk')) + b.arms + sleeves(dress, p('jurk'))
    + SHOES[choice.schoenen](p('schoenen'), skin) + NECKLACES[choice.ketting](p('ketting'))
    + hairCrown(hair) + face(pr, skin) + hairFront(pr.style, hair) + CROWNS[choice.kroon](p('kroon'));
  return svg(box, label, inner);
}

// Onder de stranddouche en in de zee: in een burkini (swim.js), zonder kroon en
// sieraden; alleen gezicht en handen zijn bloot. Geeft alleen de tekening terug
// (zonder <svg>), voor in een grotere tekening. suit = kleur van de burkini.
export function bathingPrincess(princess, suit = '#5ec8ff') {
  const pr = PRINCESSES[princess];
  const skin = skinPaint(pr.skin);
  const hair = paint(pr.hair);
  const p = paint(suit);
  const s = `fill="${skin.fill}" stroke="${skin.line}" stroke-width="1.4"`;
  return hairBack(pr.style, hair) + `<rect x="138" y="150" width="24" height="52" ${s}/>`
    + pants(p) + tunic(p) + swimSleeves(p) + mirror(`<circle cx="90" cy="330" r="12" ${s}/>`)
    + hairCrown(hair) + face(pr, skin) + hairFront(pr.style, hair);
}
