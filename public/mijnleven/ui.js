// Kleine hulpjes voor de schermen.
import { scoped } from './glans.js';

// een knop die "aan" kan staan (aria-pressed), zoals een categorie, soort of kleur
export function button(className, label, pressed, onClick) {
  const btn = document.createElement('button');
  btn.className = className;
  btn.textContent = label;
  btn.setAttribute('aria-pressed', String(pressed));
  btn.addEventListener('click', onClick);
  return btn;
}

// een rond kleurknopje
export function swatch(hex, name, pressed, onClick) {
  const btn = button('swatch', '', pressed, onClick);
  btn.style.background = hex;
  btn.setAttribute('aria-label', name);
  return btn;
}

// een tekening van een kamer, in hetzelfde vak als de kapper (30,0 – 270,340)
export const sceneSvg = (label, inner) => scoped(`<svg viewBox="30 0 240 340" role="img" aria-label="${label}">${inner}</svg>`);

// het plaatje dat met muis of vinger meebeweegt; p = { x, y } in het vak van de tekening
export function cursorSvg(glyph, p, turn = -20) {
  if (!p) return '';
  return `<g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${turn})" opacity="0.95" pointer-events="none">${glyph}</g>`;
}

// De dag in het spel: de echte datum, plus het aantal nachten dat je geslapen hebt.
// Zo begint er een nieuwe dag als je gaat slapen, en ook als het echt morgen is.
let nights = 0;
export const setNights = (count) => { nights = count; };
export const today = () => {
  const date = new Date().toISOString().slice(0, 10);
  return nights ? `${date}/${nights}` : date;
};
