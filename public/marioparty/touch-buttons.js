// Knoppen op het speelveld voor een tablet: één per speler, links voor speler 1 en
// rechts voor speler 2. Op een computer met muis komen ze niet.
import { TOUCH } from './sprint-input.js';

// onPress(idx) bij een tik; canPress() bepaalt of het spel loopt. Geeft de knoppen
// terug, zodat het spel ze bij het stoppen kan weghalen
export function addTouchButtons(stage, players, label, onPress, canPress) {
  if (!TOUCH) return [];
  const humans = players.map((p, i) => (p.control === 'CPU' ? -1 : i)).filter((i) => i >= 0);
  return humans.map((idx, n) => {
    const btn = document.createElement('button');
    btn.className = `duw-btn ${n === 0 ? 'is-left' : 'is-right'}`;
    btn.textContent = label;
    btn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (canPress()) onPress(idx);
    });
    stage.appendChild(btn);
    return btn;
  });
}
