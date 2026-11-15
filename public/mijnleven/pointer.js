// Volgt muis of vinger op een tekening. De plek wordt omgerekend naar het vak van de
// SVG (viewBox), zodat het klopt bij elke schermgrootte. De tekening wordt bij elke
// beweging opnieuw gemaakt; daarom houdt el zelf de vinger vast (pointer capture),
// anders raakt een tablet het slepen kwijt. Alleen de eerste vinger telt: een tweede
// vinger (of een hand op het scherm) verstoort het slepen niet.
// handlers: down(p), move(p, pressed) met p = null als de muis weg is, en up().
// p = { x, y, touch }: touch = het is een vinger (dan staat het plaatje iets hoger)
export function trackPointer(el, { down, move, up }) {
  let active = null; // de vinger of muis die nu drukt
  const at = (e) => {
    const svg = el.querySelector('svg');
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    return { x: p.x, y: p.y, touch: e.pointerType === 'touch' };
  };
  const mine = (e) => active === null || e.pointerId === active;
  const release = (e) => {
    if (active === null || e.pointerId !== active) return;
    active = null;
    up();
  };
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    // een tweede vinger doet niets; een nieuwe eerste vinger neemt het over
    if (active !== null && !e.isPrimary) return;
    active = e.pointerId;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // geen echte muis of vinger (een test): slepen werkt dan ook zo
    }
    down(at(e));
  });
  el.addEventListener('pointermove', (e) => {
    if (mine(e)) move(at(e), active !== null);
  });
  el.addEventListener('pointerleave', (e) => {
    if (mine(e)) move(null, false);
  });
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
}

// Tekent hooguit één keer per beeldje, hoe vaak je ook vraagt: bij slepen komen er
// veel meer bewegingen binnen dan het scherm kan laten zien.
export function onFrame(draw) {
  let queued = false;
  return () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      draw();
    });
  };
}
