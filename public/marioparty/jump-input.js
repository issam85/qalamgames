// Springen en salto's: speler 1 springt met spatie en doet een salto met A of D;
// speler 2 met pijl omhoog en ← of →. De salto-knop werkt vanaf de grond (meteen een
// salto-sprong) en in de lucht. Alleen: dan tellen beide sets.
// Aanraken: tik op je helft = springen, in de lucht nog een keer tikken = salto.
// Sterrenjacht loopt met A/D en de pijltjes, en heeft daarom eigen toetsen (STAR_KEYS)
// en een duw-knop.
export const DEFAULT_KEYS = {
  jump: { 'Speler 1': ['Space'], 'Speler 2': ['ArrowUp'] },
  trick: { 'Speler 1': ['KeyA', 'KeyD'], 'Speler 2': ['ArrowLeft', 'ArrowRight'] },
};
export const STAR_KEYS = {
  jump: { 'Speler 1': ['Space'], 'Speler 2': ['ArrowUp'] },
  trick: { 'Speler 1': ['KeyW'], 'Speler 2': ['Enter', 'NumpadEnter'] },
  push: { 'Speler 1': ['KeyS'], 'Speler 2': ['ArrowDown'] },
};
export const JUMP_LABELS = { 'Speler 1': 'SPATIE springen, A of D salto', 'Speler 2': 'PIJL OMHOOG springen, ← of → salto' };

// actions: { jump(i), trick(i), push(i) } (trick ook vanaf de grond); keys: per actie de
// toetsen per speler; canPress(): spel loopt; inAir(i): speler i zweeft (voor het
// tikken). topZone: alleen tikken in dit bovenste deel van het veld telt (0 = overal)
export function createJumpInput(players, stage, { jump, trick, push, canPress, inAir, topZone = 0, keys = DEFAULT_KEYS }) {
  const humans = players.map((p, i) => (p.control === 'CPU' ? -1 : i)).filter((i) => i >= 0);
  const actions = { jump, trick, push };
  const keysOf = (set, i) => {
    const p = players[i];
    if (p.control === 'CPU') return [];
    if (humans.length === 1) return [...set['Speler 1'], ...set['Speler 2']];
    return set[p.control];
  };
  // per speler: toetscode → actie
  const map = players.map((_, i) => {
    const m = {};
    Object.entries(keys).forEach(([action, set]) => {
      if (actions[action]) keysOf(set, i).forEach((code) => { m[code] = action; });
    });
    return m;
  });

  const onKey = (e) => {
    if (e.repeat || !canPress()) return;
    players.forEach((_, i) => {
      const action = map[i][e.code];
      if (!action) return;
      e.preventDefault();
      actions[action](i);
    });
  };
  const onPointer = (e) => {
    if (!canPress() || humans.length === 0) return;
    const box = stage.getBoundingClientRect();
    if (topZone && (e.clientY - box.top) / box.height > topZone) return;
    e.preventDefault();
    const right = e.clientX - box.left > box.width / 2;
    const idx = humans.length > 1 && right ? humans[1] : humans[0];
    if (inAir(idx)) trick(idx);
    else jump(idx);
  };

  return {
    attach() {
      window.addEventListener('keydown', onKey);
      stage.addEventListener('pointerdown', onPointer);
    },
    detach() {
      window.removeEventListener('keydown', onKey);
      stage.removeEventListener('pointerdown', onPointer);
    },
  };
}
