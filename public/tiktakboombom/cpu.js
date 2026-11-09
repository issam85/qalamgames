// Hoe een computerkind reageert als de bom landt. Geeft soms snel door, aarzelt soms
// en laat hem af en toe vallen. Naarmate de bom sneller knippert, schiet het op.
export function cpuPlan(progress, rng = Math.random) {
  const hurry = 1 - 0.35 * progress;
  const hesitates = rng() < 0.14;
  const hold = hesitates ? 1.1 + rng() * 0.7 : 0.3 + rng() * 0.5;
  return { hold: hold * hurry, drops: rng() < 0.06 };
}
