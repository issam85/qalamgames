// Haar en gezicht kiezen in het kleedhokje, per prinses bewaard in game.looks (Lina kan
// roze haar en lange wimpers hebben terwijl Sara bruin haar en sproetjes houdt).
// lookChoices() maakt de knoppen en kleurrijen voor Haar en Gezicht.
import { PRINCESSES, HAIR_STYLES, HAIR_COLORS, EYE_COLORS, LIP_COLORS, MOUTHS, FACE } from './data.js';
import { setLooks } from './princess.js';
import { button, swatch, withPicture } from './ui.js';
import { lookPicture } from './pictures.js';
import { CAT_ICONS } from './icons.js';

export const HAIR_CAT = { key: 'haar', label: 'Haar' };
export const FACE_CAT = { key: 'gezicht', label: 'Gezicht' };

// haar en gezicht van de gekozen prinses: wat je koos, anders hoe ze begon
export function lookOf(game) {
  const pr = PRINCESSES[game.princess];
  return { hair: pr.hair, style: pr.style, eyes: pr.eyes, ...FACE, ...(game.looks[game.princess] || {}) };
}

export function changeLook(game, patch) {
  game.looks = { ...game.looks, [game.princess]: { ...lookOf(game), ...patch } };
  setLooks(game.looks);
}

// per veld nakijken: wat niet (meer) bestaat valt weg, de rest blijft
const inList = (list) => (v) => list.some(([hex]) => hex === v);
const CHECK = {
  style: (v) => HAIR_STYLES.some((s) => s.key === v),
  hair: inList(HAIR_COLORS),
  eyes: inList(EYE_COLORS),
  lips: inList(LIP_COLORS),
  mouth: (v) => Number.isInteger(v) && v >= 0 && v < MOUTHS.length,
  lashes: (v) => v === 'kort' || v === 'lang',
  blush: (v) => typeof v === 'boolean',
  freckles: (v) => typeof v === 'boolean',
  glitter: (v) => typeof v === 'boolean',
};
export function validLooks(saved) {
  const looks = {};
  if (!saved || typeof saved !== 'object') return looks;
  PRINCESSES.forEach((_, i) => {
    const look = saved[i];
    if (!look || typeof look !== 'object') return;
    const ok = Object.fromEntries(Object.entries(CHECK).filter(([key, check]) => check(look[key])).map(([key]) => [key, look[key]]));
    if (Object.keys(ok).length) looks[i] = ok;
  });
  return looks;
}

// De knoppen voor Haar of Gezicht: { tiles, colorRows }. pick(patch) past het aan.
export function lookChoices(cat, game, pick) {
  const look = lookOf(game);
  const { princess, outfit } = game;
  const tile = (label, patch, pressed, onClick = () => pick(patch)) => withPicture(button('item', label, pressed, onClick),
    lookPicture(cat, princess, outfit, patch), label);
  const colors = (key, list, icon) => ({
    key, icon, swatches: list.map(([hex, name]) => swatch(hex, name, look[key] === hex, () => pick({ [key]: hex }))),
  });
  if (cat === 'haar') {
    return {
      tiles: HAIR_STYLES.map((s) => tile(s.label, { style: s.key }, look.style === s.key)),
      colorRows: [colors('hair', HAIR_COLORS, CAT_ICONS.haar)],
    };
  }
  const toggle = (key, label) => tile(label, { [key]: true }, look[key], () => pick({ [key]: !look[key] }));
  return {
    tiles: [
      ...MOUTHS.map((label, k) => tile(label, { mouth: k }, look.mouth === k)),
      tile('Korte wimpers', { lashes: 'kort' }, look.lashes === 'kort'),
      tile('Lange wimpers', { lashes: 'lang' }, look.lashes === 'lang'),
      toggle('blush', 'Blosjes'), toggle('freckles', 'Sproetjes'), toggle('glitter', 'Glitter'),
    ],
    colorRows: [colors('eyes', EYE_COLORS, CAT_ICONS.ogen), colors('lips', LIP_COLORS, CAT_ICONS.lippen)],
  };
}
