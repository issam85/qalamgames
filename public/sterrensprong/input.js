// Eén knop: spatie, pijl omhoog, W, klik of tik. Elke vinger telt apart (pointerId).
const KEYS = new Set(['Space', 'ArrowUp', 'KeyW']);

export function createInput(onPress) {
  const keys = new Set();
  const pointers = new Set();
  let pressed = false;
  let armed = true; // na terugkomen telt vasthouden pas weer als alles een keer los is geweest

  const down = () => keys.size > 0 || pointers.size > 0;
  function lift() {
    if (!down()) armed = true;
  }

  function press(source) {
    pressed = true;
    onPress(source);
  }

  window.addEventListener('keydown', (e) => {
    if (!KEYS.has(e.code)) return;
    e.preventDefault();
    if (e.repeat || keys.has(e.code)) return;
    keys.add(e.code);
    press('key');
  });
  window.addEventListener('keyup', (e) => {
    keys.delete(e.code);
    lift();
  });
  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, .menu, .overlay')) return; // knoppen en menu zijn geen sprong
    pointers.add(e.pointerId);
    press('pointer');
  });
  const release = (e) => {
    pointers.delete(e.pointerId);
    lift();
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  // muis het venster uit: dan komt er geen pointerup meer
  document.documentElement.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') release(e);
  });
  window.addEventListener('contextmenu', (e) => e.preventDefault()); // lang drukken = geen menu
  window.addEventListener('blur', () => {
    keys.clear();
    pointers.clear();
    lift();
  });

  return {
    held: () => armed && down(),
    // na een botsing of pauze: een vinger of toets die nog neer is, springt niet meteen
    requireRelease() {
      armed = false;
      lift();
    },
    takePress() {
      const was = pressed;
      pressed = false;
      return was;
    },
  };
}
