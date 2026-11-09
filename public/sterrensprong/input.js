// Eén knop: spatie, pijl omhoog, W, klik of tik.
const KEYS = new Set(['Space', 'ArrowUp', 'KeyW']);

export function createInput(onPress) {
  const keys = new Set();
  let pointers = 0;
  let pressed = false;

  function press() {
    pressed = true;
    onPress();
  }

  window.addEventListener('keydown', (e) => {
    if (!KEYS.has(e.code)) return;
    e.preventDefault();
    if (e.repeat || keys.has(e.code)) return;
    keys.add(e.code);
    press();
  });
  window.addEventListener('keyup', (e) => keys.delete(e.code));
  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, .menu')) return; // knoppen zijn geen sprong
    pointers++;
    press();
  });
  const release = () => { pointers = Math.max(0, pointers - 1); };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  window.addEventListener('blur', () => {
    keys.clear();
    pointers = 0;
  });

  return {
    held: () => keys.size > 0 || pointers > 0,
    takePress() {
      const was = pressed;
      pressed = false;
      return was;
    },
  };
}
