// Vliegstukken: door een poort op het tapijt, tussen vloer en plafond door poortjes, weer lopen.
// Vasthouden = omhoog, loslaten = zakken. Alle randen liggen op hele blokken, zodat wat je
// ziet precies is wat je raakt.
const CEILING = 7; // onderkant van het plafond
const BOTTOMS = [2, 4, 1, 3, 2, 4, 3, 1]; // onderkant van elke opening, om en om hoog en laag

const block = (x, y, w, h) => ({ type: 'block', x, y, w, h });
const thorns = (x, w) => ({ type: 'thorn', x, y: 0, w, h: 0.5 });

// gates = aantal openingen, gap = hoe hoog een opening is (3 makkelijk, 2 moeilijk)
export const flight = (gates, gap) => (x, tempo) => {
  const lead = 6;
  const step = Math.ceil(tempo.speed * 0.6) + 2;
  const parts = [];
  for (let i = 0; i < gates; i++) {
    const bottom = Math.min(BOTTOMS[i % BOTTOMS.length], CEILING - gap);
    const at = x + lead + i * step;
    if (bottom > 0) parts.push(block(at, 0, 1, bottom));
    parts.push(block(at, bottom + gap, 1, CEILING - bottom - gap));
  }
  const end = x + lead + (gates - 1) * step + 6;
  parts.push(block(x + 2, CEILING, end - x - 2, 1), thorns(x + 3, end - x - 4));
  return {
    parts,
    portals: [{ x: x + 1, mode: 'fly' }, { x: end, mode: 'run' }],
    width: end - x + 8,
  };
};
