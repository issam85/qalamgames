// Het kleurenscherm: kies een combinatie, of zelf het licht en het dak.
import { COMBOS, BODY_COLORS, METAL_COLORS } from './skins.js';

const $ = (id) => document.getElementById(id);

function makeButton(parent, label, background, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'swatch';
  button.style.background = background;
  button.setAttribute('aria-label', label);
  button.title = label;
  button.addEventListener('click', onClick);
  parent.append(button);
  return button;
}

export function createMenu(startSkin, { onChange, onStart }) {
  const skin = { ...startSkin };
  const items = [];

  function refresh() {
    items.forEach(({ button, active }) => {
      const on = active();
      button.classList.toggle('on', on);
      button.setAttribute('aria-pressed', on);
    });
  }

  function pick(change) {
    Object.assign(skin, change);
    refresh();
    onChange({ ...skin });
  }

  COMBOS.forEach((combo) => {
    const background = `linear-gradient(180deg, ${combo.metal} 0 42%, ${combo.body} 42% 100%)`;
    const button = makeButton($('combos'), combo.name, background, () => pick({ body: combo.body, metal: combo.metal }));
    items.push({ button, active: () => skin.body === combo.body && skin.metal === combo.metal });
  });
  BODY_COLORS.forEach((body) => {
    const button = makeButton($('bodies'), 'Licht', body, () => pick({ body }));
    items.push({ button, active: () => skin.body === body });
  });
  METAL_COLORS.forEach((metal) => {
    const button = makeButton($('metals'), 'Dak en rand', metal, () => pick({ metal }));
    items.push({ button, active: () => skin.metal === metal });
  });
  $('start').addEventListener('click', onStart);
  refresh();

  return {
    show(on) {
      $('menu').hidden = !on;
      document.body.classList.toggle('in-menu', on);
    },
  };
}
