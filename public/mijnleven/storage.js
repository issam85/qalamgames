// Bewaart het spel op dit apparaat: de outfit, het haar, de sterren en de dag van de
// laatste beloning per kamer. In een privévenster lukt opslaan niet; dan geldt het alleen voor dit bezoek.
import { defaultOutfit, CATS, SWATCHES } from './data.js';
import { freshHair, STYLES, HAIR_COLORS, SPOTS } from './hair.js';

const KEY = 'mijnleven';

// alleen een outfit met geldige keuzes en kleuren, anders de standaard
function validOutfit(outfit) {
  if (!outfit || !outfit.choice || !outfit.color) return false;
  const colors = SWATCHES.map(([hex]) => hex);
  return CATS.every((cat) => Number.isInteger(outfit.choice[cat.key])
    && outfit.choice[cat.key] >= 0 && outfit.choice[cat.key] < cat.items.length
    && colors.includes(outfit.color[cat.key]));
}

function validHair(hair) {
  return Boolean(hair) && Number.isInteger(hair.style) && hair.style >= 0 && hair.style < STYLES.length
    && [0, 1, 2].includes(hair.length) && HAIR_COLORS.some(([hex]) => hex === hair.color)
    && Array.isArray(hair.knots) && hair.knots.length === SPOTS.length
    && hair.knots.every((hp) => typeof hp === 'number' && hp >= 0)
    && typeof hair.day === 'string';
}

export function loadGame() {
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    data = {};
  }
  return {
    outfit: validOutfit(data.outfit) ? data.outfit : defaultOutfit(),
    stars: Number.isInteger(data.stars) && data.stars >= 0 ? data.stars : 0,
    starDay: typeof data.starDay === 'string' ? data.starDay : '',
    hair: validHair(data.hair) ? { ...freshHair(), ...data.hair } : freshHair(),
    kapperDay: typeof data.kapperDay === 'string' ? data.kapperDay : '',
  };
}

export function saveGame(game) {
  try {
    localStorage.setItem(KEY, JSON.stringify(game));
  } catch {
    // opslaan geblokkeerd: het spel werkt gewoon door
  }
}
