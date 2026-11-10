// Lopen op het strand: pijltjes of WASD, of op een tablet je vinger vasthouden waar de
// prinses heen moet (ook met de muis). Het canvas past met object-fit: contain in zijn
// vak; de plek van de vinger wordt omgerekend naar het logische vak 960 × 540.
const KEYS = {
  ArrowLeft: ['x', -1], KeyA: ['x', -1], ArrowRight: ['x', 1], KeyD: ['x', 1],
  ArrowUp: ['y', -1], KeyW: ['y', -1], ArrowDown: ['y', 1], KeyS: ['y', 1],
};

// lift = hoeveel de prinses onder de vinger staat (op het strand staan haar voeten
// iets lager dan je vinger; in de zee zwemt ze er precies naartoe)
export function beachInput(canvas, lift = 40) {
  const held = new Set();
  let point = null; // { x, y } op het scherm (logisch), zolang de vinger erop is

  const at = (e) => {
    const r = canvas.getBoundingClientRect();
    const scale = Math.min(r.width / 960, r.height / 540);
    return { x: (e.clientX - r.left - (r.width - 960 * scale) / 2) / scale, y: (e.clientY - r.top - (r.height - 540 * scale) / 2) / scale };
  };
  const onKey = (down) => (e) => {
    if (!KEYS[e.code]) return;
    e.preventDefault();
    if (down) held.add(e.code);
    else held.delete(e.code);
  };
  window.addEventListener('keydown', onKey(true));
  window.addEventListener('keyup', onKey(false));
  window.addEventListener('blur', () => held.clear());
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // geen echte vinger (een test)
    }
    point = at(e);
  });
  canvas.addEventListener('pointermove', (e) => { if (point) point = at(e); });
  const stop = () => { point = null; };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);

  return {
    // richting van de toetsen: { x, y } met -1, 0 of 1
    dir() {
      const d = { x: 0, y: 0 };
      held.forEach((code) => { d[KEYS[code][0]] += KEYS[code][1]; });
      return d;
    },
    // waar de vinger is, in de wereld (cam = linkerkant van het scherm)
    target: (cam) => (point ? { x: point.x + cam, y: point.y + lift } : null),
    clear() {
      held.clear();
      point = null;
    },
  };
}
