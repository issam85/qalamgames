// Het paneel van de kapper: het gereedschap, de knopenmeter, de kapsels en de
// haarkleuren.
import { STYLES, HAIR_COLORS, SPOTS, knotsLeft } from './hair.js';
import { TOOLS } from './salon-tools.js';
import { button, swatch } from './ui.js';

const toolsEl = document.getElementById('kapper-tools');
const stylesEl = document.getElementById('kapper-styles');
const colorsEl = document.getElementById('kapper-colors');
const meterEl = document.getElementById('kapper-meter');
const labelEl = document.getElementById('kapper-label');

// on = wat de knoppen doen: { tool(tool), style(nummer, uitleg), color(kleur) }
export function renderSalonPanel(hair, tool, on) {
  const left = knotsLeft(hair);
  toolsEl.replaceChildren(...TOOLS.map((t) => button('cat', t.label, t === tool, () => on.tool(t))));
  stylesEl.replaceChildren(...STYLES.map(([label, text], i) => button(
    'item', label, hair.style === i && !hair.hijab, () => on.style(i, text),
  )));
  colorsEl.replaceChildren(...HAIR_COLORS.map(([hex, name]) => swatch(hex, name, hair.color === hex, () => on.color(hex))));
  labelEl.textContent = left === 0 ? 'Helemaal glad!' : `${left} ${left === 1 ? 'knoop' : 'knopen'}`;
  meterEl.style.width = `${100 - (left / SPOTS.length) * 100}%`;
}
