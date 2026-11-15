// De tekening van de keuken: de muur en het aanrecht, het recept, de kom met wat erin
// zit, en (uit cook-stove.js) het fornuis en het gerecht.
import { INGREDIENTS } from './recipes.js';
import { recipeOf, phase, BOWL } from './cook.js';
import { stoveSvg, dishSvg } from './cook-stove.js';
import { ingredientSvg } from './ingredient-icons.js';
import { sceneSvg } from './ui.js';
import { wall, tiles, grad, plant, shadow } from './decor.js';
import { gloss } from './glans.js';

// de keuken: muur, tegeltjes boven het aanrecht, een marmeren blad en kastjes
const ROOM = wall('#ffe9c2') + tiles(118, 228, '#ffd9a0', 36) + grad('blad', '#fffdf7', '#e3d7c3') + grad('kastje', '#d9a86c', '#b5793a')
  + '<rect x="30" y="226" width="240" height="14" fill="url(#g-blad)"/><rect x="30" y="226" width="240" height="3" fill="#fff" opacity="0.8"/>'
  + '<rect x="30" y="240" width="240" height="100" fill="#c98f5a"/>'
  + '<g fill="url(#g-kastje)" stroke="#8a4f22" stroke-width="1.5"><rect x="40" y="250" width="100" height="78" rx="6"/><rect x="160" y="250" width="100" height="78" rx="6"/></g>'
  + '<g fill="#ffd43b" stroke="#c9a400" stroke-width="1.2"><circle cx="130" cy="289" r="4.5"/><circle cx="170" cy="289" r="4.5"/></g>'
  + gloss(60, 270, 8, 5, -30) + gloss(180, 270, 8, 5, -30) + shadow(256, 228, 14, 4) + plant(256, 226, 0.55);
// waar de ingrediënten in de kom liggen
const PLACES = [[-32, -2], [28, -4], [-4, 6], [6, -8]];

// het briefje met het recept: nummer, plaatje en naam; wat erin zit krijgt een vinkje
function noteSvg(recipe, added) {
  const rows = recipe.need.map((key, i) => {
    const x = 60 + (i % 2) * 98;
    const y = 54 + Math.floor(i / 2) * 25;
    const ok = i < added.length;
    return `<circle cx="${x}" cy="${y}" r="9" fill="${ok ? '#43a047' : '#c2419a'}"/>`
      + `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" fill="#fff">${ok ? '✓' : i + 1}</text>`
      + ingredientSvg(key, `x="${x + 11}" y="${y - 10}" width="20" height="20"`)
      + `<text x="${x + 32}" y="${y + 4}" font-size="11" fill="${ok ? '#1b5e20' : '#3a2a4d'}">${INGREDIENTS[key][0]}</text>`;
  }).join('');
  return '<rect x="42" y="10" width="216" height="84" rx="12" fill="#fff" stroke="#ffd1ec" stroke-width="3"/>'
    + `<text x="150" y="31" text-anchor="middle" font-size="14" fill="#c2419a">Recept: ${recipe.label}</text>${rows}`;
}

function bowlSvg(cook, recipe) {
  const { x, y } = BOWL;
  const blobs = cook.added.map((key, i) => `<ellipse cx="${x + PLACES[i][0]}" cy="${y + PLACES[i][1]}" rx="24" ry="7" fill="${INGREDIENTS[key][1]}" stroke="rgba(0,0,0,0.15)"/>`).join('');
  // door het roeren wordt het één kleur; de streepjes draaien mee
  const mixed = cook.stir > 0
    ? `<ellipse cx="${x}" cy="${y}" rx="68" ry="15" fill="${recipe.mix}" opacity="${cook.stir.toFixed(2)}"/>`
      + `<g transform="translate(${x} ${y}) scale(1 0.22) rotate(${Math.round(cook.stir * 1440)})" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.6">`
      + '<path d="M-42 0 A42 42 0 0 1 0 -42"/><path d="M42 0 A42 42 0 0 1 0 42"/></g>'
    : '';
  return grad('kom', '#8ad8ff', '#2f8fd0') + `<path d="M72 ${y} C76 252 118 264 150 264 C182 264 224 252 228 ${y} Z" fill="url(#g-kom)" stroke="#1e6fa8" stroke-width="1.5"/>`
    + '<path d="M84 214 C104 238 196 238 216 214" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.6"/>'
    + `<ellipse cx="${x}" cy="${y}" rx="78" ry="20" fill="#8ad8ff"/><ellipse cx="${x}" cy="${y}" rx="68" ry="15" fill="#3d9fd6"/>${blobs}${mixed}`;
}

// heat = hoe ver het is bij het vuur (0 – 1); extra = de lepel bij de muis;
// wider = hoeveel breder het groen bij het vuur is
export function kitchenSvg(cook, heat, extra = '', wider = 0) {
  const recipe = recipeOf(cook);
  const step = phase(cook);
  let inner = noteSvg(recipe, cook.added) + bowlSvg(cook, recipe);
  if (step === 'vuur') inner = stoveSvg(recipe, cook.round, heat, wider);
  else if (step === 'klaar') inner = dishSvg(recipe);
  return sceneSvg(`De keuken: ${recipe.label}`, ROOM + inner + extra);
}
