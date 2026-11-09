// Kleine hulpjes voor de schermen.

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

export const today = () => new Date().toISOString().slice(0, 10);
