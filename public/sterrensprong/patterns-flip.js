// Ondersteboven: door een gele poort val je naar het plafond en loop je daar ondersteboven.
// Springen gaat dan naar beneden. Een mint poort zet alles weer gewoon.
const CEILING = 6; // onderkant van het plafond

const block = (x, y, w, h) => ({ type: 'block', x, y, w, h });
const thorns = (x, w) => ({ type: 'thorn', x, y: 0, w, h: 0.5 });
const hanging = (x, count) =>
  Array.from({ length: count }, (_, i) => ({ type: 'spike', x: x + i, y: CEILING - 1, w: 1, h: 1, dir: 'down' }));

// count = aantal hindernissen; level 1 = losse punten, 2 = ook dubbele en hangende blokken,
// 3 = ook drie punten op een rij
export const upsideDown = (count, level) => (x, tempo) => {
  const parts = [];
  let at = x + 1 + Math.ceil(tempo.speed * 0.5) + 3; // eerst naar het plafond vallen
  for (let i = 0; i < count; i++) {
    if (level >= 2 && i % 3 === 2) {
      // een blok dat naar beneden hangt: spring eronder en loop eronderlangs
      parts.push(block(at, CEILING - 2, 3, 2));
      at += 3 + Math.max(2, Math.round(tempo.jump * 0.45)) + 2;
    } else {
      const size = 1 + (i % level);
      parts.push(...hanging(at, size));
      at += size + Math.ceil(tempo.jump) + 1;
    }
  }
  const end = at + 2;
  parts.push(block(x + 1, CEILING, end - x - 1, 1), thorns(x + 4, end - x - 7));
  return {
    parts,
    portals: [{ x: x + 1, mode: 'flip' }, { x: end, mode: 'run' }],
    width: end - x + 8,
  };
};
