// Bewaart het spel op dit apparaat: de outfit, de sterren en de dag van de laatste
// beloning. In een privévenster lukt opslaan niet; dan geldt het alleen voor dit bezoek.
import { defaultOutfit, CATS, SWATCHES } from './data.js';

const KEY = 'mijnleven';

// alleen een outfit met geldige keuzes en kleuren, anders de standaard
function validOutfit(outfit) {
  if (!outfit || !outfit.choice || !outfit.color) return false;
  const colors = SWATCHES.map(([hex]) => hex);
  return CATS.every((cat) => Number.isInteger(outfit.choice[cat.key])
    && outfit.choice[cat.key] >= 0 && outfit.choice[cat.key] < cat.items.length
    && colors.includes(outfit.color[cat.key]));
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
  };
}

export function saveGame(game) {
  try {
    localStorage.setItem(KEY, JSON.stringify(game));
  } catch {
    // opslaan geblokkeerd: het spel werkt gewoon door
  }
}
