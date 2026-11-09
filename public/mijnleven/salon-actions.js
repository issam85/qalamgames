// Wat het gereedschap van de kapper met het haar doet. Losse functies zonder scherm,
// zodat ze makkelijk te testen zijn.
import { SPOTS, VLECHTEN } from './hair.js';

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

// Een tik met puntkam, schaar, hoed of hoofddoek. Geeft { patch, text } terug:
// patch = wat er aan het haar verandert, text = wat de kapper erbij zegt
export function tapHair(toolKey, hair) {
  if (toolKey === 'hoofddoek') return { patch: { hijab: !hair.hijab, hat: false } };
  if (hair.hijab) return { text: 'Doe eerst je hoofddoek af.' };
  if (toolKey === 'schaar' && hair.length === 0) return { text: 'Korter kan niet. Morgen is het weer gegroeid.' };
  if (toolKey === 'schaar') return { patch: { length: hair.length - 1 }, text: 'Knip, knip!' };
  if (toolKey === 'puntkam') return { patch: { style: VLECHTEN }, text: 'Een mooie scheiding en twee vlechten!' };
  if (toolKey === 'hoed') return { patch: { hat: !hair.hat } };
  return {};
}
