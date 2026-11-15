// Lopen op het strand en zwemmen in de zee: pijltjes of WASD, je vinger vasthouden waar
// de prinses heen moet, of één korte tik: dan loopt ze vanzelf naar die plek (ook met de
// muis). Het canvas past met object-fit: contain in zijn vak; de plek van de vinger wordt
// omgerekend naar het logische vak 960 × 540. Toetsen tellen alleen op het eigen scherm.
const KEYS = {
  ArrowLeft: ['x', -1], KeyA: ['x', -1], ArrowRight: ['x', 1], KeyD: ['x', 1],
  ArrowUp: ['y', -1], KeyW: ['y', -1], ArrowDown: ['y', 1], KeyS: ['y', 1],
};
const TAP_MS = 250; // korter vasthouden = een tik
const TAP_PX = 15; // en niet verder bewogen dan dit

// lift = hoeveel de prinses onder de vinger staat (0: haar voeten precies op je vinger)
export function beachInput(canvas, lift = 0) {
  const screen = canvas.closest('.screen');
  const active = () => !screen || screen.classList.contains('active');
  const held = new Set();
  let point = null; // { x, y } op het scherm (logisch), zolang de vinger erop is
  let down = null; // waar en wanneer de vinger neerkwam
  let tap = null; // een tik, nog op het scherm (de camera kan nog schuiven)
  let goal = null; // waar ze na een tik heen loopt, in de wereld

  const at = (e) => {
    const r = canvas.getBoundingClientRect();
    const scale = Math.min(r.width / 960, r.height / 540);
    return { x: (e.clientX - r.left - (r.width - 960 * scale) / 2) / scale, y: (e.clientY - r.top - (r.height - 540 * scale) / 2) / scale };
  };
  window.addEventListener('keydown', (e) => {
    if (!KEYS[e.code] || !active()) return;
    e.preventDefault();
    held.add(e.code);
    goal = null;
    tap = null;
  });
  window.addEventListener('keyup', (e) => held.delete(e.code));
  window.addEventListener('blur', () => held.clear());
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // geen echte vinger (een test)
    }
    point = at(e);
    down = { ...point, t: performance.now() };
    goal = null;
    tap = null;
  });
  canvas.addEventListener('pointermove', (e) => { if (point) point = at(e); });
  const stop = () => {
    if (down && point && performance.now() - down.t < TAP_MS && Math.hypot(point.x - down.x, point.y - down.y) < TAP_PX) tap = point;
    point = null;
    down = null;
  };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', () => { point = null; down = null; });

  return {
    // richting van de toetsen: { x, y } met -1, 0 of 1
    dir() {
      const d = { x: 0, y: 0 };
      held.forEach((code) => { d[KEYS[code][0]] += KEYS[code][1]; });
      return d;
    },
    // waar ze heen moet, in de wereld (cam = linkerkant van het scherm): de vinger, of na
    // een tik het vaste doel
    target(cam) {
      if (point) return { x: point.x + cam, y: point.y + lift };
      if (tap) {
        goal = { x: tap.x + cam, y: tap.y + lift };
        tap = null;
      }
      return goal;
    },
    goal: () => goal,
    clearGoal() {
      goal = null;
      tap = null;
    },
    clear() {
      held.clear();
      point = null;
      down = null;
      tap = null;
      goal = null;
    },
  };
}
