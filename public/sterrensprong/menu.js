// Het startscherm: kies een wereld en de kleuren van je lantaarn.
import { COMBOS, BODY_COLORS, METAL_COLORS } from './skins.js';
import { bestOf } from './progress.js';

const $ = (id) => document.getElementById(id);

function makeSwatch(parent, label, background, onClick) {
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

function buildColors(skin, onSkin) {
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
    onSkin({ ...skin });
  }
  COMBOS.forEach((combo) => {
    const background = `linear-gradient(180deg, ${combo.metal} 0 42%, ${combo.body} 42% 100%)`;
    const button = makeSwatch($('combos'), combo.name, background, () => pick({ body: combo.body, metal: combo.metal }));
    items.push({ button, active: () => skin.body === combo.body && skin.metal === combo.metal });
  });
  BODY_COLORS.forEach((body) => {
    const button = makeSwatch($('bodies'), 'Licht', body, () => pick({ body }));
    items.push({ button, active: () => skin.body === body });
  });
  METAL_COLORS.forEach((metal) => {
    const button = makeSwatch($('metals'), 'Dak en rand', metal, () => pick({ metal }));
    items.push({ button, active: () => skin.metal === metal });
  });
  refresh();
}

function buildWorlds(worlds, progress, selected, onWorld) {
  let current = selected;
  const cards = worlds.map((level, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'world';
    button.innerHTML = '<b></b><span></span>';
    button.firstChild.textContent = `${index + 1}. ${level.name}`;
    button.addEventListener('click', () => {
      if (index === current) return;
      current = index;
      onWorld(index);
      refresh();
    });
    $('worlds').append(button);
    return button;
  });

  function refresh() {
    cards.forEach((button, index) => {
      const open = index < progress.unlocked;
      button.disabled = !open;
      button.classList.toggle('on', index === current);
      button.setAttribute('aria-pressed', index === current);
      const best = bestOf(progress, worlds[index]);
      let text = 'Nog niet gespeeld';
      if (!open) text = `Op slot: haal eerst ${worlds[index - 1].name}`;
      else if (best === 100) text = 'Gehaald!';
      else if (best > 0) text = `Beste: ${best}%`;
      button.lastChild.textContent = text;
    });
  }
  refresh();
  return (index) => {
    current = index;
    refresh();
  };
}

export function createMenu({ skin, worlds, progress, selected }, actions) {
  buildColors({ ...skin }, actions.onSkin);
  const setWorld = buildWorlds(worlds, progress, selected, actions.onWorld);
  $('start').addEventListener('click', actions.onStart);
  $('practice').addEventListener('click', actions.onPractice);
  const menu = {
    update: setWorld,
    show(on) {
      $('menu').hidden = !on;
      document.body.classList.toggle('in-menu', on);
    },
  };
  menu.show(true);
  return menu;
}
