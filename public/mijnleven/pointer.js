// Volgt muis of vinger op een tekening. De plek wordt omgerekend naar het vak van de
// SVG (viewBox), zodat het klopt bij elke schermgrootte. De tekening wordt bij elke
// beweging opnieuw gemaakt; daarom houdt el zelf de vinger vast (pointer capture),
// anders raakt een tablet het slepen kwijt.
// handlers: down(p), move(p, pressed) met p = null als de muis weg is, en up()
export function trackPointer(el, { down, move, up }) {
  let pressed = false;
  const at = (e) => {
    const svg = el.querySelector('svg');
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    return { x: p.x, y: p.y };
  };
  const release = () => {
    pressed = false;
    up();
  };
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    pressed = true;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // geen echte muis of vinger (een test): slepen werkt dan ook zo
    }
    down(at(e));
  });
  el.addEventListener('pointermove', (e) => move(at(e), pressed));
  el.addEventListener('pointerleave', () => move(null, false));
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
}
