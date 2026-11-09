// Koken zonder scherm: wat er in de kom zit, hoe ver je bent met roeren en hoe vaak
// je bij het vuur op tijd was. Losse functies, zo te testen.
// cook = { recipe: sleutel, added: [ingrediënten in de kom], stir: 0 – 1, round: aantal keer goed }
import { RECIPES } from './recipes.js';

export const BOWL = { x: 150, y: 178 }; // midden van de kom in de tekening
export const GOOD = [0.58, 0.84]; // het groene stuk van de balk bij het vuur
export const BAKE_MS = 3200; // zo lang duurt het tot het aanbrandt
const STIR_TURNS = 4; // zoveel rondjes roeren

export const freshCook = (key) => ({ recipe: key, added: [], stir: 0, round: 0 });
export const recipeOf = (cook) => RECIPES.find((r) => r.key === cook.recipe);

// 'kom' (ingrediënten erin) → 'roeren' → 'vuur' → 'klaar'
export function phase(cook) {
  const recipe = recipeOf(cook);
  if (cook.added.length < recipe.need.length) return 'kom';
  if (cook.stir < 1) return 'roeren';
  return cook.round < recipe.rounds ? 'vuur' : 'klaar';
}

// 0 – 1 voor de meter: elke stap telt voor een derde
export function progress(cook) {
  const recipe = recipeOf(cook);
  return (cook.added.length / recipe.need.length + cook.stir + cook.round / recipe.rounds) / 3;
}

// Doe een ingrediënt in de kom. Geeft de nieuwe stand terug, of null als het niet aan
// de beurt is
export function add(cook, key) {
  if (key !== recipeOf(cook).need[cook.added.length]) return null;
  return { ...cook, added: [...cook.added, key] };
}

export const inBowl = (p) => Math.abs(p.x - BOWL.x) < 95 && Math.abs(p.y - BOWL.y) < 70;
// de kom is een platte ovaal: reken de hoogte zwaarder mee
const angle = (p) => Math.atan2((p.y - BOWL.y) * 3, p.x - BOWL.x);

// De lepel gaat van from naar to: elk stukje rond het midden telt mee
export function stir(cook, from, to) {
  if (!inBowl(from) || !inBowl(to)) return cook;
  let turn = Math.abs(angle(to) - angle(from));
  if (turn > Math.PI) turn = 2 * Math.PI - turn;
  return { ...cook, stir: Math.min(1, cook.stir + turn / (STIR_TURNS * 2 * Math.PI)) };
}

// heat = 0 (net op het vuur) – 1 (aangebrand)
export function judge(heat) {
  if (heat < GOOD[0]) return 'early';
  return heat <= GOOD[1] ? 'good' : 'late';
}
