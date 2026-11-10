// De douche zonder tekenen: de plekken met zand en wat spons, douche en handdoek
// ermee doen. Losse functies, zo te testen.
// Een plek gaat van 0 (zand) → 1 (schuim) → 2 (nat) → 3 (schoon en droog).
export const SPOTS = [[150, 84], [122, 138], [178, 138], [128, 204], [172, 204], [150, 238], [98, 252], [202, 252]];
export const STEPS = ['spons', 'douche', 'handdoek']; // STEPS[stand] = wat je nu nodig hebt
export const CLEAN = STEPS.length;
const REACH = 34;

export const sandy = () => SPOTS.map(() => 0);
export const washed = (spots) => spots.every((s) => s === CLEAN);
// 0 – 1 voor de meter
export const progress = (spots) => spots.reduce((a, s) => a + s, 0) / (SPOTS.length * CLEAN);

// Sleep met spons, douche of handdoek over plek p. Geeft de nieuwe plekken terug, of
// null als er niets veranderde.
export function wash(spots, p, toolKey) {
  let changed = false;
  const next = spots.map((s, i) => {
    const near = Math.hypot(p.x - SPOTS[i][0], p.y - SPOTS[i][1]) < REACH;
    if (!near || STEPS[s] !== toolKey) return s;
    changed = true;
    return s + 1;
  });
  return changed ? next : null;
}

// is deze stap (spons, douche of handdoek) overal gedaan?
export const stepDone = (spots, toolKey) => spots.every((s) => s > STEPS.indexOf(toolKey));
