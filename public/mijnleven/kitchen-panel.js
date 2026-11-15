// Het paneel van de keuken: de recepten (met een plaatje van het gerecht), de meter en
// de ingrediënten (met plaatjes), of de grote knop bij het vuur.
import { RECIPES, INGREDIENTS } from './recipes.js';
import { recipeOf, phase, progress } from './cook.js';
import { dishThumb } from './cook-stove.js';
import { ingredientIcon } from './ingredient-icons.js';
import { roomScreen } from './screen.js';
import { button, keyed } from './ui.js';

roomScreen({ room: 'keuken', title: 'Keuken', nav: 'Recept', stage: 'cook-stage', extra: '<div id="keuken-items" class="items"></div>' });
const el = (name) => document.getElementById(`keuken-${name}`);

// on = wat de knoppen doen: { choose(recept), pick(ingrediënt), flip() }
export function renderKitchenPanel(cook, on) {
  const recipe = recipeOf(cook);
  const step = phase(cook);
  const part = progress(cook);
  el('nav').replaceChildren(...RECIPES.map((r) => button('cat', r.label, r === recipe, () => on.choose(r), dishThumb(r))));
  el('title').textContent = recipe.label;
  el('label').textContent = step === 'klaar' ? 'Klaar!' : `${Math.round(part * 100)}%`;
  el('meter').style.width = `${part * 100}%`;
  if (step === 'kom') {
    el('items').replaceChildren(...recipe.shelf.map((key) => keyed(button(
      'item', INGREDIENTS[key][0], cook.added.includes(key), () => on.pick(key), ingredientIcon(key),
    ), key)));
  } else el('items').replaceChildren(...(step === 'vuur' ? [keyed(button('btn gold', recipe.action, false, on.flip), 'vuur')] : []));
}

// alleen de meter (tijdens het roeren)
export const kitchenMeter = (cook) => { el('meter').style.width = `${progress(cook) * 100}%`; };
