// Springen en salto's: speler 1 springt met spatie en doet in de lucht een salto met
// A of D; speler 2 met pijl omhoog en ← of →. Alleen: dan tellen beide sets.
// Aanraken: tik op je helft = springen, in de lucht nog een keer tikken = salto.
const JUMP_KEYS = { 'Speler 1': ['Space'], 'Speler 2': ['ArrowUp'] };
const TRICK_KEYS = { 'Speler 1': ['KeyA', 'KeyD'], 'Speler 2': ['ArrowLeft', 'ArrowRight'] };
export const JUMP_LABELS = { 'Speler 1': 'SPATIE, salto A of D', 'Speler 2': 'PIJL OMHOOG, salto ← of →' };

// jump(i), trick(i): acties; canPress(): spel loopt; inAir(i): speler i zweeft.
// topZone: alleen tikken in dit bovenste deel van het veld telt (0 = overal)
export function createJumpInput(players, stage, { jump, trick, canPress, inAir, topZone = 0 }) {
  const humans = players.map((p, i) => (p.control === 'CPU' ? -1 : i)).filter((i) => i >= 0);
  const keysOf = (set, i) => {
    const p = players[i];
    if (p.control === 'CPU') return [];
    if (humans.length === 1) return [...set['Speler 1'], ...set['Speler 2']];
    return set[p.control];
  };
  const jumpKeys = players.map((_, i) => keysOf(JUMP_KEYS, i));
  const trickKeys = players.map((_, i) => keysOf(TRICK_KEYS, i));

  const onKey = (e) => {
    if (e.repeat || !canPress()) return;
    players.forEach((_, i) => {
      if (jumpKeys[i].includes(e.code)) {
        e.preventDefault();
        jump(i);
      } else if (trickKeys[i].includes(e.code)) {
        if (inAir(i)) {
          e.preventDefault();
          trick(i);
        }
      }
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
