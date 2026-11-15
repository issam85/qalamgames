// Bewaart het spel op dit apparaat: welke prinses, wat ze aanheeft, wat ze op het
// strand en in de zee gevonden heeft en wat ze daarmee heeft vrijgespeeld. In een privévenster
// lukt opslaan niet; dan geldt het alleen voor dit bezoek.
import { PRINCESSES, CATS, SWATCHES, MATCH, defaultOutfit, hasItem } from './data.js';
import { validLooks } from './hair-pick.js';

const KEY = 'schelpkristal';
const COLORS = SWATCHES.map(([hex]) => hex);

// Per soort nakijken: een keuze en een kleur die bestaan. Wat ontbreekt (een ouder spel had
// nog geen zwemkleding of sieraden) of niet meer klopt (de oude zwemkleur #5ec8ff), komt uit
// de standaard; de rest blijft zoals het was.
export function validOutfit(saved) {
  const def = defaultOutfit();
  if (!saved || typeof saved !== 'object') return def;
  const choice = saved.choice || {};
  const color = saved.color || {};
  CATS.forEach(({ key, items }) => {
    const i = choice[key];
    if (Number.isInteger(i) && i >= 0 && i < items.length) def.choice[key] = i;
    if (COLORS.includes(color[key]) || (key === 'ketting' && color[key] === MATCH)) def.color[key] = color[key];
  });
  def.hood = saved.hood === true;
  return def;
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
    outfit: validOutfit(saved.outfit),
    looks: validLooks(saved.looks), // haar en gezicht per prinses
    shells: count(saved.shells),
    crystals: count(saved.crystals),
    pearls: count(saved.pearls),
    owned: Array.isArray(saved.owned) ? saved.owned.filter((key) => typeof key === 'string' && CATS.some((c) => {
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
