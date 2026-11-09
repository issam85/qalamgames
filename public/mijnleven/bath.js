// De badkamer zonder scherm: de plekken die je wast en wat spons, douche en handdoek
// ermee doen. Losse functies, zo te testen.
// Een plek gaat van 0 (vies) → 1 (schuim) → 2 (nat) → 3 (schoon en droog).
export const SPOTS = [[150, 42], [98, 92], [202, 92], [150, 208], [92, 234], [208, 234], [118, 294], [186, 294]];
export const STEPS = ['spons', 'douche', 'handdoek']; // STEPS[stand] = wat je nu nodig hebt
export const CLEAN = STEPS.length;
export const BRUSH_STEPS = 40; // zo lang poetsen tot je tanden blinken
const TEETH_WEIGHT = 6; // hoe zwaar de tanden tellen in de meter
const REACH = 34;

export const freshBath = () => ({ spots: SPOTS.map(() => 0), teeth: false, day: '' });

// elke nieuwe dag begin je weer vies
export const newDay = (bath, today) => (bath.day === today ? bath : { ...freshBath(), day: today });

export const washed = (bath) => bath.spots.every((s) => s === CLEAN);

// 0 – 1 voor de meter
export function progress(bath) {
  const sum = bath.spots.reduce((a, s) => a + s, 0) + (bath.teeth ? TEETH_WEIGHT : 0);
  return sum / (SPOTS.length * CLEAN + TEETH_WEIGHT);
}

// Sleep met spons, douche of handdoek over plek p. Geeft de nieuwe plekken terug, of
// null als er niets veranderde
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

export const onFace = (p) => Math.hypot(p.x - 150, p.y - 105) < 56;
export const onMouth = (p) => Math.hypot(p.x - 150, p.y - 128) < 30;
