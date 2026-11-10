// Bewaart het spel op dit apparaat: welke prinses, wat ze aanheeft, wat ze op het
// strand en in de zee gevonden heeft en wat ze daarmee heeft vrijgespeeld. In een privévenster
// lukt opslaan niet; dan geldt het alleen voor dit bezoek.
import { PRINCESSES, CATS, SWATCHES, MATCH, defaultOutfit, hasItem } from './data.js';

const KEY = 'schelpkristal';
const COLORS = SWATCHES.map(([hex]) => hex);

// een ouder spel had nog geen zwemkleding: wat ontbreekt komt uit de standaard
function fillOutfit(saved) {
  if (!saved || !saved.choice || !saved.color) return null;
  const def = defaultOutfit();
  return { choice: { ...def.choice, ...saved.choice }, color: { ...def.color, ...saved.color }, hood: saved.hood === true };
}

function validOutfit(outfit) {
  if (!outfit) return false;
  return CATS.every((cat) => Number.isInteger(outfit.choice[cat.key])
    && outfit.choice[cat.key] >= 0 && outfit.choice[cat.key] < cat.items.length
    && (COLORS.includes(outfit.color[cat.key]) || (cat.key === 'ketting' && outfit.color[cat.key] === MATCH)));
}

const count = (n) => (Number.isInteger(n) && n >= 0 ? n : 0);

export function loadGame() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    saved = {};
  }
  const game = {
    princess: Number.isInteger(saved.princess) && saved.princess >= 0 && saved.princess < PRINCESSES.length ? saved.princess : 0,
    outfit: validOutfit(fillOutfit(saved.outfit)) ? fillOutfit(saved.outfit) : defaultOutfit(),
    shells: count(saved.shells),
    crystals: count(saved.crystals),
    pearls: count(saved.pearls),
    owned: Array.isArray(saved.owned) ? saved.owned.filter((key) => CATS.some((c) => {
      const [cat, i] = key.split(':');
      return c.key === cat && Boolean(c.prices[Number(i)]);
    })) : [],
  };
  // iets aan dat (nog) op slot zit: dan weer wat je in het begin aanhad
  CATS.forEach(({ key }) => {
    if (!hasItem(game.owned, key, game.outfit.choice[key])) game.outfit.choice[key] = defaultOutfit().choice[key];
  });
  return game;
}

export function saveGame(game) {
  try {
    localStorage.setItem(KEY, JSON.stringify(game));
  } catch {
    // opslaan lukt niet (privévenster): dan alleen voor nu
  }
}
