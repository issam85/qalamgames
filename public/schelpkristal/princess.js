// De prinses: bouwt de SVG op uit haar haar, huid en gekozen kleren, laag voor laag,
// in de Glans-stijl. Vak 300 × 520: hoofd rond (150, 118), schouders op 196, handen op
// (90, 330) en (210, 330), voeten rond x = 120 en 180.
import { PRINCESSES, MATCH, FACE, defaultOutfit } from './data.js';
import { DRESSES, bodice, sleeves, dressPattern } from './dresses.js';
import { CROWNS, NECKLACES, SHOES } from './jewels.js';
import { EARRINGS, BRACELETS, HAIR_PINS, replacesTie } from './extras.js';
import { hairBack, hairCrown, hairFront } from './hair.js';
import { paint, skinPaint, svg, mirror, irisFill, dark, sparkle, dots, INK } from './glans.js';
import { pants, tunic, pattern, hood, sleeves as swimSleeves } from './swim.js';

// eigen haar en gezicht per prinses (uit het kleedhokje); app.js geeft game.looks door
let looks = {};
export const setLooks = (saved) => { looks = saved || {}; };
const princessOf = (i, look) => ({ ...PRINCESSES[i], ...(looks[i] || {}), ...(look || {}) });

// wit valt weg tegen een lichte achtergrond: dan een heel lichte grijstint
const soft = (hex) => (hex === '#ffffff' ? '#f4f4f4' : hex);

// wimpers kort of lang (de prinsen hebben er geen)
const LASHES = {
  kort: 'M120 116 l-3.5 -3 M123 107 l-3 -3.5 M127 104.5 l-1.5 -4',
  lang: 'M120 116 l-7 -3.5 M122.5 108.5 l-5.5 -6 M127 104.5 l-2.5 -7.5 M132.5 103.5 l0.5 -6.5',
};
const eye = (iris, lashes) => `<ellipse cx="131" cy="118" rx="10" ry="12.5" fill="#fff"/><circle cx="132" cy="120" r="7.2" fill="${iris}"/><circle cx="132.5" cy="121" r="4.2" fill="#1d1016"/>`
  + '<circle cx="128.5" cy="116" r="3" fill="#fff"/><circle cx="135" cy="124" r="1.4" fill="#fff" opacity="0.9"/>'
  + `<path d="M120 116 Q131 101.5 142 115" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`
  + (lashes ? `<path d="${LASHES[lashes]}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>` : '');
const brow = (c) => `<path d="M119 96.5 Q131 89.5 142 95.5" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/>`;
// de monden (zelfde volgorde als MOUTHS in data.js) in de kleur van de lippen
const MOUTH_DRAW = [
  (c, l) => `<path d="M138 146 Q150 162 162 146 Q150 152 138 146 Z" fill="${c}"/><path d="M138 146 Q150 160 162 146" fill="none" stroke="${l}" stroke-width="2.2" stroke-linecap="round"/>`,
  (c, l) => `<path d="M136 143 Q150 168 164 143 Q150 147 136 143 Z" fill="#7a2030" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>`
    + '<path d="M139 145 Q150 148 161 145 L160 149 Q150 151 140 149 Z" fill="#fff"/>'
    + `<ellipse cx="150" cy="157" rx="6" ry="3" fill="#ff8a9a"/><path d="M135 142 q2 -1 3 1 M165 142 q-2 -1 -3 1" stroke="${l}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  (c, l) => `<ellipse cx="152" cy="150" rx="6.5" ry="7" fill="${c}" stroke="${l}" stroke-width="1.6"/><path d="M148 150 h8" stroke="${l}" stroke-width="1.6" stroke-linecap="round"/>`
    + `<path d="M172 136 c-3 -4 -8 -1 -5 3 l5 4 5 -4 c3 -4 -2 -7 -5 -3 z" fill="${c}"/>`,
];
const FRECKLES = '<g fill="#a86a48" opacity="0.6">' + dots([[114, 132], [120, 136], [127, 133], [117, 140], [124, 141]], 1.4) + '</g>';
const GLITTER = sparkle(116, 128, 5.5, '#fff6c8') + sparkle(127, 142, 3.4, '#fff6c8') + sparkle(109, 141, 3, '#fff6c8');

// Het gezicht; pr = { eyes, hair } en (bij de prinsessen) wat je koos: lips, mouth, lashes,
// blush, freckles, glitter (zie FACE in data.js). Ook voor de prinsen in prince.js
// (lashes = false: geen wimpers; de rest standaard).
export function face(pr, skin, lashes = true) {
  const f = { ...FACE, ...pr };
  const lips = f.lips;
  return `<ellipse cx="150" cy="118" rx="44" ry="50" fill="${skin.fill}" stroke="${skin.line}" stroke-width="1.2"/>`
    + mirror(eye(irisFill(pr.eyes), lashes && (f.lashes === 'lang' ? 'lang' : 'kort')) + brow(paint(pr.hair).line))
    + '<path d="M148 134 q2 4 5 1" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2" stroke-linecap="round"/>'
    + (MOUTH_DRAW[f.mouth] || MOUTH_DRAW[0])(lips, dark(lips, 0.22))
    + mirror((f.blush ? '<ellipse cx="120" cy="138" rx="11" ry="7" fill="url(#blush)"/>' : '') + (f.freckles ? FRECKLES : '') + (f.glitter ? GLITTER : ''));
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
// look = even een ander kapsel of kleur proberen (voor de plaatjes in het kleedhokje)
// een bewaarde of geleende outfit zonder de nieuwere soorten: wat ontbreekt uit de standaard
const full = (outfit) => {
  const def = defaultOutfit();
  return { choice: { ...def.choice, ...outfit.choice }, color: { ...def.color, ...outfit.color }, hood: Boolean(outfit.hood) };
};

export function princessSvg(princess, outfit, label = 'Jouw prinses', box = '0 0 300 520', look = null) {
  const pr = princessOf(princess, look);
  const skin = skinPaint(pr.skin);
  const hair = paint(pr.hair);
  const { choice, color } = full(outfit);
  const p = (key) => paint(soft(key === 'ketting' && color.ketting === MATCH ? color.jurk : color[key]));
  const dress = DRESSES[choice.jurk];
  const b = body(skin);
  const inner = '<ellipse cx="150" cy="510" rx="90" ry="9" fill="rgba(0,0,0,0.2)"/>'
    + hairBack(pr.style, hair, replacesTie(choice.speld)) + (dress.train ? dress.train(p('jurk')) : '')
    + b.legs + b.torso + dress.skirt(p('jurk')) + dressPattern(dress, choice.patroon, p('patroon'))
    + bodice(dress, p('jurk')) + b.arms + sleeves(dress, p('jurk')) + BRACELETS[choice.armband](p('armband'))
    + SHOES[choice.schoenen](p('schoenen'), skin) + NECKLACES[choice.ketting](p('ketting'))
    + hairCrown(hair) + face(pr, skin) + hairFront(pr.style, hair) + EARRINGS[choice.oorbellen](p('oorbellen'))
    + HAIR_PINS[choice.speld](p('speld'), pr.style) + CROWNS[choice.kroon](p('kroon'));
  return svg(box, label, inner);
}

// Onder de stranddouche en in de zee: in haar burkini uit het kleedhokje (swim.js),
// zonder kroon en sieraden; alleen gezicht en handen zijn bloot. Geeft alleen de
// tekening terug (zonder <svg>), voor in een grotere tekening.
export function bathingPrincess(princess, outfit) {
  const pr = princessOf(princess);
  const skin = skinPaint(pr.skin);
  const hair = paint(pr.hair);
  const { choice, color, hood: hooded } = full(outfit);
  const p = paint(soft(color.zwem));
  const s = `fill="${skin.fill}" stroke="${skin.line}" stroke-width="1.4"`;
  const cap = hooded ? hood(p) : null;
  return (cap ? '' : hairBack(pr.style, hair)) + `<rect x="138" y="150" width="24" height="52" ${s}/>`
    + pants(p) + tunic(p) + pattern(choice.zwem) + swimSleeves(p) + mirror(`<circle cx="90" cy="330" r="12" ${s}/>`)
    + (cap ? cap.back + face(pr, skin) + cap.rim : hairCrown(hair) + face(pr, skin) + hairFront(pr.style, hair));
}

export const swimSvg = (princess, outfit, label = 'Jouw prinses in haar burkini') => svg('0 0 300 520', label, bathingPrincess(princess, outfit));
