// Invoer van Sterrenjacht: links/rechts ingedrukt houden. Speler 1 met A/D, speler 2
// met de pijltjes. Aanraken: met één speler is de linkerhelft links en de rechterhelft
// rechts; met twee spelers heeft elke speler zijn eigen helft, in tweeën gedeeld.
const KEYS = {
  'Speler 1': { KeyA: -1, KeyD: 1, ArrowLeft: -1, ArrowRight: 1 },
  'Speler 2': { ArrowLeft: -1, ArrowRight: 1 },
};
export const MOVE_LABELS = { 'Speler 1': 'A / D', 'Speler 2': '← / →' };

export function createMoveInput(players, stage) {
  const humans = players.map((p, i) => (p.control === 'CPU' ? -1 : i)).filter((i) => i >= 0);
  // met twee spelers gebruikt speler 1 alleen A/D, zodat de pijltjes van speler 2 zijn
  const keymap = players.map((p) => {
    if (p.control === 'CPU') return {};
    if (p.control === 'Speler 1' && humans.length > 1) return { KeyA: -1, KeyD: 1 };
    return KEYS[p.control];
  });
  const held = players.map(() => ({ left: false, right: false }));
  const pointers = new Map(); // pointerId → { idx, dir }

  const onKey = (down) => (e) => {
    players.forEach((_, i) => {
      const dir = keymap[i][e.code];
      if (dir === undefined) return;
      e.preventDefault();
      held[i][dir < 0 ? 'left' : 'right'] = down;
    });
  };
  const onKeyDown = onKey(true);
  const onKeyUp = onKey(false);

  const sideOf = (e) => {
    const box = stage.getBoundingClientRect();
    const f = (e.clientX - box.left) / box.width;
    if (humans.length < 2) return { idx: humans[0], dir: f < 0.5 ? -1 : 1 };
    const idx = f < 0.5 ? humans[0] : humans[1];
    return { idx, dir: (f % 0.5) < 0.25 ? -1 : 1 };
  };
  const onPointerDown = (e) => {
    if (humans.length === 0) return;
    e.preventDefault();
    pointers.set(e.pointerId, sideOf(e));
  };
  const onPointerUp = (e) => pointers.delete(e.pointerId);

  return {
    attach() {
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      stage.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    },
    detach() {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      stage.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    },
    // -1, 0 of 1 voor speler idx
    dir(idx) {
      let d = (held[idx].right ? 1 : 0) - (held[idx].left ? 1 : 0);
      pointers.forEach((p) => { if (p.idx === idx) d = p.dir; });
      return d;
    },
  };
}
