// De knoppen in het kleedhokje voor wat de prinses aanheeft (jurk, patroon, kroon,
// ketting, oorbellen, armband, haarversiering, schoenen, zwemkleding): per rij de dingen
// met een tekening, en per rij een kleurrij. Wat op slot zit krijgt een slotje en de prijs.
import { CATS, SWATCHES, MATCH, hasItem } from './data.js';
import { button, swatch, withPicture } from './ui.js';
import { itemPicture, hoodPicture } from './pictures.js';
import { CAT_ICONS } from './icons.js';
import { priceIcons, priceText } from './unlock.js';

// bij deze soorten is nummer 0 "geen" of "effen": dan ook geen kleurrij
const NONE_FIRST = ['patroon', 'oorbellen', 'armband', 'speld'];
export const catOf = (key) => CATS.find((c) => c.key === key);

// een kopje boven een rij: het icoon van de soort
function header(key) {
  const h = document.createElement('div');
  h.className = 'row-head';
  h.innerHTML = `${CAT_ICONS[key]}<span>${catOf(key).label}</span>`;
  return h;
}

// rows = soorten op dit scherm; shown = de outfit zoals je hem nu ziet (met wat je past);
// act = { change(patch), tryItem(key, i), trial: { key, i } of null }
export function outfitChoices(rows, game, shown, act) {
  const tiles = [];
  rows.forEach((key) => {
    const cat = catOf(key);
    if (rows.length > 1 || key === 'speld') tiles.push(header(key));
    cat.items.forEach((label, i) => {
      const picture = itemPicture(key, i, game.princess, shown);
      if (hasItem(game.owned, key, i)) {
        tiles.push(withPicture(button('item', label, game.outfit.choice[key] === i && !act.trial, () => act.change({ choice: { [key]: i } })), picture, label));
        return;
      }
      const trying = act.trial && act.trial.key === key && act.trial.i === i;
      const btn = withPicture(button('item locked', label, Boolean(trying), () => act.tryItem(key, i)), picture, label);
      const small = document.createElement('small');
      small.innerHTML = priceIcons(cat.prices[i]);
      small.setAttribute('aria-label', priceText(cat.prices[i]));
      btn.append(small);
      tiles.push(btn);
    });
    if (key === 'zwem') {
      [false, true].forEach((hood) => tiles.push(withPicture(button('item', hood ? 'Met capuchon' : 'Zonder capuchon', game.outfit.hood === hood,
        () => act.change({ hood })), hoodPicture(game.princess, shown, hood), hood ? 'Met capuchon' : 'Zonder capuchon')));
    }
  });
  const colorRows = rows.filter((key) => !(NONE_FIRST.includes(key) && shown.choice[key] === 0)).map((key) => {
    const swatches = SWATCHES.map(([hex, name]) => swatch(hex, name, game.outfit.color[key] === hex, () => act.change({ color: { [key]: hex } })));
    if (key === 'ketting') swatches.unshift(swatch(null, 'Past bij je jurk', game.outfit.color.ketting === MATCH, () => act.change({ color: { ketting: MATCH } })));
    return { key, icon: CAT_ICONS[key], swatches };
  });
  return { tiles, colorRows };
}
