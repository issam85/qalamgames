// Wat het gereedschap van de kapper met het haar doet. Losse functies zonder scherm,
// zodat ze makkelijk te testen zijn.
import { SPOTS, VLECHTEN, HATS } from './hair.js';
import { STRAND_X, MIN_END } from './hair-styles.js';

export const DRY_STEPS = 40; // zo lang föhnen tot het glanst
export const TAP_DRY = 5; // een tik met de föhn telt ook

// p = plek in het vak van de tekening; het haar zit rond het hoofd en eronder
export const onHair = (p) => p.x > 70 && p.x < 230 && p.y > 5 && p.y < 345;

// Borstel of kam op plek p. Een haal over een knoop telt één keer, tot je er weer
// vanaf bent (inside onthoudt waar je overheen gaat). Geeft de nieuwe knopen terug,
// of null als er niets veranderde
export function untangle(knots, p, power, inside) {
  const next = [...knots];
  let changed = false;
  SPOTS.forEach(([x, y], i) => {
    const near = Math.hypot(p.x - x, p.y - y) < 26;
    if (near && !inside.has(i) && next[i] > 0) {
      next[i] = Math.max(0, next[i] - power);
      changed = true;
    }
    if (near) inside.add(i);
    else inside.delete(i);
  });
  return changed ? next : null;
}

// De schaar gaat van a naar b (plekken in de tekening). Elke lok die hij kruist wordt
// op die hoogte afgeknipt. Geeft { ends, pieces } terug (pieces = de stukjes die
// vallen), of null als er niets geknipt is
export function cut(ends, a, b) {
  const pieces = [];
  const next = ends.map((end, i) => {
    const x = STRAND_X[i];
    if (x < Math.min(a.x, b.x) - 7 || x > Math.max(a.x, b.x) + 7) return end;
    const part = a.x === b.x ? 1 : Math.min(1, Math.max(0, (x - a.x) / (b.x - a.x)));
    const y = Math.round(a.y + (b.y - a.y) * part);
    if (y < MIN_END || y > end - 4) return end;
    pieces.push({ x, y, h: end - y });
    return y;
  });
  return pieces.length ? { ends: next, pieces } : null;
}

// Een tik met puntkam, hoed of hoofddoek. Geeft { patch, text } terug:
// patch = wat er aan het haar verandert, text = wat de kapper erbij zegt.
// owned = wat er in de winkel gekocht is ('hat:2' enzovoort)
export function tapHair(toolKey, hair, owned = []) {
  if (toolKey === 'hoofddoek') return { patch: { hijab: !hair.hijab, hat: 0 } };
  if (hair.hijab) return { text: 'Doe eerst je hoofddoek af.' };
  if (toolKey === 'puntkam') return { patch: { style: VLECHTEN }, text: 'Een mooie scheiding en twee vlechten!' };
  if (toolKey === 'hoed') {
    // de hoed, en daarna om de beurt de haarspullen uit de winkel
    const options = [0, ...HATS.map((_, i) => i).filter((i) => i === 1 || owned.includes(`hat:${i}`))];
    const hat = options[(options.indexOf(hair.hat) + 1) % options.length];
    return { patch: { hat }, text: hat ? `${HATS[hat][0]}!` : '' };
  }
  return {};
}
