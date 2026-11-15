// Het paneel van Moskee en Mekka: de drie onderdelen (met een vinkje als ze af zijn),
// de meter en de knoppen: de stappen van wudu, de gebeden met hun lucht, Zamzam en
// aan het eind de link naar het Hajj-spel. Alles met een plaatje.
import { WUDU, WUDU_SHELF, PRAYERS, wuduDone, prayersDone, journeyStep, progress } from './mosque.js';
import { wuduIcon, partIcon } from './wudu-icons.js';
import { skyTile } from './mosque-scene.js';
import { roomScreen } from './screen.js';
import { button, keyed } from './ui.js';

roomScreen({
  room: 'moskee', title: 'Moskee en Mekka', nav: 'Wat ga je doen', stage: 'cook-stage',
  extra: '<div id="moskee-items" class="items"></div>',
});
const el = (name) => document.getElementById(`moskee-${name}`);
export const PARTS = [['wudu', 'Wudu'], ['gebed', 'Gebed'], ['mekka', 'Reis naar Mekka']];

function items(m, part, on) {
  if (part === 'wudu') return WUDU_SHELF.map((i) => keyed(button('item', WUDU[i], i < m.wudu, () => on.wudu(i), wuduIcon(i)), `stap-${i}`));
  if (part === 'gebed') return PRAYERS.map((p, i) => button('item', p.name, false, () => on.prayer(i), skyTile(i)));
  if (journeyStep(m) === 'zamzam') return [button('btn gold', 'Drink Zamzam', false, on.zamzam)];
  if (journeyStep(m) !== 'klaar') return [];
  const link = document.createElement('a');
  link.className = 'btn gold';
  link.href = '/#hajj';
  link.target = '_top';
  link.textContent = 'Speel het Hajj-spel';
  return [link];
}

export function mosqueMeter(m, part) {
  const amount = progress(m, part);
  el('label').textContent = amount === 1 ? 'Klaar!' : `${Math.round(amount * 100)}%`;
  el('meter').style.width = `${amount * 100}%`;
}

// on = wat de knoppen doen: { part(onderdeel), wudu(stap), prayer(gebed), zamzam() }
export function renderMosquePanel(m, part, on) {
  // een onderdeel dat af is krijgt een vinkje
  const ok = { wudu: wuduDone(m), gebed: prayersDone(m), mekka: journeyStep(m) === 'klaar' };
  el('nav').replaceChildren(...PARTS.map(([key, label]) => keyed(button(
    'cat', ok[key] ? `${label} ✓` : label, key === part, () => on.part(key), partIcon(key),
  ), key)));
  el('title').textContent = PARTS.find(([key]) => key === part)[1];
  mosqueMeter(m, part);
  el('items').replaceChildren(...items(m, part, on));
}
