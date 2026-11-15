// Kleine hulpjes voor de schermen.
import { scoped } from './glans.js';

// Een knop die "aan" kan staan (aria-pressed), zoals een categorie, soort of kleur.
// icon = een plaatje (SVG) boven het woord; zo kunnen kinderen die nog niet lezen ook
// kiezen. Het woord blijft er klein onder staan.
export function button(className, label, pressed, onClick, icon = '') {
  const btn = document.createElement('button');
  btn.className = className;
  if (icon) {
    btn.classList.add('has-icon');
    const pic = document.createElement('span');
    pic.className = 'btn-icon';
    pic.innerHTML = icon;
    const word = document.createElement('small');
    word.textContent = label;
    btn.append(pic, word);
  } else btn.textContent = label;
  btn.setAttribute('aria-pressed', String(pressed));
  btn.addEventListener('click', onClick);
  return btn;
}

// een knop met een sleutel (data-key), zodat een kamer hem later kan laten oplichten
export const keyed = (btn, key) => {
  btn.dataset.key = key;
  return btn;
};

// een rond kleurknopje
export function swatch(hex, name, pressed, onClick) {
  const btn = button('swatch', '', pressed, onClick);
  btn.style.background = hex;
  btn.setAttribute('aria-label', name);
  return btn;
}

// een plaatje van een stuk gereedschap (getekend rond 0,0) voor op een knop
export const glyphIcon = (glyph, view = '-34 -34 68 68') => scoped(`<svg viewBox="${view}" aria-hidden="true">${glyph}</svg>`);

// laat een knop even oplichten: "dit moet je nu doen"
export function pulse(btn) {
  if (!btn) return;
  btn.classList.remove('is-next');
  // opnieuw beginnen met de animatie, ook als hij net nog liep
  void btn.offsetWidth;
  btn.classList.add('is-next');
  setTimeout(() => btn.classList.remove('is-next'), 2600);
}

// een tekening van een kamer, in hetzelfde vak als de kapper (30,0 – 270,340)
export const sceneSvg = (label, inner) => scoped(`<svg viewBox="30 0 240 340" role="img" aria-label="${label}">${inner}</svg>`);

// Het plaatje dat met muis of vinger meebeweegt; p = { x, y, touch } in het vak van de
// tekening. Bij een vinger staat het plaatje iets hoger, anders zit je vinger erop.
export function cursorSvg(glyph, p, turn = -20) {
  if (!p) return '';
  const y = p.touch ? p.y - 40 : p.y;
  return `<g transform="translate(${p.x.toFixed(1)} ${y.toFixed(1)}) rotate(${turn})" opacity="0.95" pointer-events="none">${glyph}</g>`;
}

// De dag in het spel: de echte datum (hier, niet in Londen), plus het aantal nachten
// dat je geslapen hebt. Zo begint er een nieuwe dag als je gaat slapen, en ook als
// het echt morgen is.
let nights = 0;
export const setNights = (count) => { nights = count; };
export const localDate = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const today = () => {
  const date = localDate();
  return nights ? `${date}/${nights}` : date;
};
