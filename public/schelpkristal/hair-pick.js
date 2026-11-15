// Haar kiezen in het kleedhokje: kapsel en kleur, per prinses bewaard in game.looks
// (Lina kan roze haar hebben terwijl Sara bruin houdt).
import { PRINCESSES, HAIR_STYLES, HAIR_COLORS } from './data.js';
import { setLooks } from './princess.js';

export const HAIR_CAT = { key: 'haar', label: 'Haar', items: HAIR_STYLES.map((s) => s.label) };

// het haar van de gekozen prinses: wat je koos, anders hoe ze begon
export function lookOf(game) {
  const pr = PRINCESSES[game.princess];
  return { hair: pr.hair, style: pr.style, ...(game.looks[game.princess] || {}) };
}

export function changeLook(game, patch) {
  game.looks = { ...game.looks, [game.princess]: { ...lookOf(game), ...patch } };
  setLooks(game.looks);
}

// alleen wat bestaat: een kapsel en kleur uit de lijsten, per nummer van een prinses
export function validLooks(saved) {
  const looks = {};
  if (!saved || typeof saved !== 'object') return looks;
  PRINCESSES.forEach((_, i) => {
    const look = saved[i];
    if (look && HAIR_STYLES.some((s) => s.key === look.style) && HAIR_COLORS.some(([hex]) => hex === look.hair)) {
      looks[i] = { style: look.style, hair: look.hair };
    }
  });
  return looks;
}
