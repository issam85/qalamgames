// Het paneel van de kapper: het gereedschap, de knopenmeter, de kapsels en de
// haarkleuren.
import { STYLES, HAIR_COLORS, SPOTS, knotsLeft } from './hair.js';
import { TOOLS, toolIcon } from './salon-tools.js';
import { styleThumb } from './thumbs-hair.js';
import { roomScreen } from './screen.js';
import { button, swatch, keyed } from './ui.js';

roomScreen({
  room: 'kapper', title: 'Kapper', nav: 'Gereedschap', stage: 'salon-stage', heading: 'Haar',
  extra: '<div id="kapper-styles" class="items"></div><div id="kapper-colors" class="swatches" aria-label="Haarkleur"></div>',
});
const toolsEl = document.getElementById('kapper-nav');
const stylesEl = document.getElementById('kapper-styles');
const colorsEl = document.getElementById('kapper-colors');
const meterEl = document.getElementById('kapper-meter');
const labelEl = document.getElementById('kapper-label');

// on = wat de knoppen doen: { tool(tool), style(nummer, uitleg), color(kleur) }
export function renderSalonPanel(hair, tool, on) {
  const left = knotsLeft(hair);
  toolsEl.replaceChildren(...TOOLS.map((t) => keyed(button('cat', t.label, t === tool, () => on.tool(t), toolIcon(t.key)), t.key)));
  stylesEl.replaceChildren(...STYLES.map(([label, text], i) => button(
    'item', label, hair.style === i && !hair.hijab, () => on.style(i, text), styleThumb(i, hair.color, hair.ends),
  )));
  colorsEl.replaceChildren(...HAIR_COLORS.map(([hex, name]) => swatch(hex, name, hair.color === hex, () => on.color(hex))));
  labelEl.textContent = left === 0 ? 'Helemaal glad!' : `${left} ${left === 1 ? 'knoop' : 'knopen'}`;
  meterEl.style.width = `${100 - (left / SPOTS.length) * 100}%`;
}
