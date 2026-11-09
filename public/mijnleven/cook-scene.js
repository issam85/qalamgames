// De tekening van de keuken: de muur en het aanrecht, het recept, de kom met wat erin
// zit, en (uit cook-stove.js) het fornuis en het gerecht.
import { INGREDIENTS } from './recipes.js';
import { recipeOf, phase, BOWL } from './cook.js';
import { stoveSvg, dishSvg } from './cook-stove.js';
import { sceneSvg } from './ui.js';

const ROOM = '<rect x="30" y="0" width="240" height="340" rx="14" fill="#fff3d6"/>'
  + '<g stroke="#fff" stroke-width="2" opacity="0.8"><path d="M30 60h240M30 120h240M30 180h240M90 0v230M150 0v230M210 0v230"/></g>'
  + '<rect x="30" y="234" width="240" height="106" fill="#c98f5a"/><rect x="30" y="228" width="240" height="10" fill="#e0a872"/>';
// waar de ingrediënten in de kom liggen
const PLACES = [[-32, -2], [28, -4], [-4, 6], [6, -8]];

// het briefje met het recept: wat erin zit krijgt een vinkje
function noteSvg(recipe, added) {
  const rows = recipe.need.map((key, i) => {
    const x = 60 + (i % 2) * 98;
    const y = 54 + Math.floor(i / 2) * 25;
    const ok = i < added.length;
    return `<circle cx="${x}" cy="${y}" r="9" fill="${ok ? '#43a047' : '#c2419a'}"/>`
      + `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" fill="#fff">${ok ? '✓' : i + 1}</text>`
      + `<text x="${x + 14}" y="${y + 4}" font-size="12" fill="${ok ? '#1b5e20' : '#3a2a4d'}">${INGREDIENTS[key][0]}</text>`;
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
  return `<path d="M72 ${y} C76 252 118 264 150 264 C182 264 224 252 228 ${y} Z" fill="#5ec8ff"/>`
    + '<path d="M84 214 C104 238 196 238 216 214" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.6"/>'
    + `<ellipse cx="${x}" cy="${y}" rx="78" ry="20" fill="#8ad8ff"/><ellipse cx="${x}" cy="${y}" rx="68" ry="15" fill="#3d9fd6"/>${blobs}${mixed}`;
}

// heat = hoe ver het is bij het vuur (0 – 1); extra = de lepel bij de muis
export function kitchenSvg(cook, heat, extra = '') {
  const recipe = recipeOf(cook);
  const step = phase(cook);
  let inner = noteSvg(recipe, cook.added) + bowlSvg(cook, recipe);
  if (step === 'vuur') inner = stoveSvg(recipe, cook.round, heat);
  else if (step === 'klaar') inner = dishSvg(recipe);
  return sceneSvg(`De keuken: ${recipe.label}`, ROOM + inner + extra);
}
