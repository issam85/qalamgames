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

// een rond kleurknopje; hex = null voor "zoals de jurk" (een regenboogje)
export function swatch(hex, name, pressed, onClick) {
  const btn = button('swatch', '', pressed, onClick);
  if (hex) btn.style.background = hex;
  else btn.classList.add('match');
  btn.setAttribute('aria-label', name);
  btn.title = name;
  return btn;
}

// een knop met een plaatje en het woord klein eronder (voor wie nog niet leest)
export function withPicture(btn, picture, label) {
  btn.innerHTML = `<span class="pic">${picture}</span><span class="name">${label}</span>`;
  btn.setAttribute('aria-label', label);
  return btn;
}
