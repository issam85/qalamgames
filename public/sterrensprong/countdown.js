// 3-2-1 na de pauze: grote cijfers midden in beeld voordat het spel weer begint.
export const COUNT_STEP = 0.8; // seconden per cijfer
export const COUNTDOWN = 3 * COUNT_STEP;

let shown = 0;

// left = seconden die nog over zijn; 0 of minder = weg
export function showCount(left) {
  const n = left > 0 ? Math.ceil(left / COUNT_STEP) : 0;
  if (n === shown) return;
  shown = n;
  const element = document.getElementById('count');
  element.hidden = !n;
  if (!n) return;
  element.textContent = n;
  element.classList.remove('pop');
  void element.offsetWidth; // de animatie opnieuw laten beginnen
  element.classList.add('pop');
}
