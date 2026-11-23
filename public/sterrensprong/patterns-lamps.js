// Stukjes met kleurlampen (lamps.js). Elk stukje begint met een lichtzuil, zodat je na een
// checkpoint altijd met de goede kleur begint.
const CEILING = 7;
const other = (tone) => (tone === 'gold' ? 'blue' : 'gold');
const block = (x, y, w, h, tone) => ({ type: 'block', x, y, w, h, tone });
const thorns = (x, w) => ({ type: 'thorn', x, y: 0, w, h: 0.5 });
const beam = (x, tone) => ({ type: 'lamp', beam: true, tone, x, y: 0, w: 0.6, h: 14 });
const orb = (cx, cy, tone) => ({ type: 'lamp', tone, x: cx - 0.8, y: cy - 0.8, w: 1.6, h: 1.6 });

// kennismaken: muren in de kleur die uit staat, daar loop je gewoon doorheen
export const lampWalls = (count) => (x, tempo) => {
  const step = Math.ceil(tempo.speed * 0.6) + 2;
  let tone = 'gold';
  const parts = [beam(x + 1, tone)];
  for (let i = 0; i < count; i++) {
    const at = x + 4 + i * step;
    parts.push(block(at, 0, 1, 4, other(tone)));
    tone = other(tone);
    parts.push(beam(at + Math.round(step / 2), tone));
  }
  return { parts, width: 4 + count * step };
};

// bruggen over de doornen, om en om goud en blauw; de lichtzuil in elk gat zet de volgende aan
export const lampBridges = (count, steps = false) => (x, tempo) => {
  const long = Math.ceil(tempo.speed * 0.5) + 2;
  const gap = 2;
  let tone = 'gold';
  const parts = [beam(x + 1, tone)];
  let at = x + 3;
  for (let i = 0; i < count; i++) {
    const h = steps && i % 2 ? 2 : 1;
    parts.push(block(at, 0, long, h, tone));
    at += long;
    if (i + 1 < count) {
      tone = other(tone);
      parts.push(beam(at + gap / 2 - 0.3, tone));
      at += gap;
    }
  }
  parts.push(thorns(x + 3, at - x - 3));
  return { parts, width: at - x + 3 };
};

// zelf schakelen: spring in de zwevende lamp boven het gat, anders is de volgende brug er niet
export const lampOrbs = (count) => (x, tempo) => {
  const long = Math.ceil(tempo.speed * 0.45) + 3;
  const gap = 2;
  let tone = 'gold';
  const parts = [beam(x + 1, tone)];
  let at = x + 3;
  for (let i = 0; i < count; i++) {
    parts.push(block(at, 0, long, 1, tone));
    at += long;
    if (i + 1 < count) {
      tone = other(tone);
      parts.push(orb(at + gap / 2, 3, tone));
      at += gap;
    }
  }
  parts.push(thorns(x + 3, at - x - 3));
  return { parts, width: at - x + 3 };
};

// vliegen door muren van plafond tot vloer: vlieg door de lamp in de andere kleur dan de muur.
// traps = ook een lamp in de kleur van de muur, op de andere hoogte (die maakt de muur vast)
export const lampFlight = (gates, traps = false) => (x, tempo) => {
  const lead = Math.ceil(tempo.speed * 1.4) + 4;
  const step = Math.ceil(tempo.speed * 0.7) + 5;
  let wall = 'gold';
  const parts = [beam(x + 0.4, wall)];
  for (let i = 0; i < gates; i++) {
    const at = x + lead + i * step;
    const [low, high] = i % 2 ? [5, 1.6] : [1.6, 5];
    const lampX = at - Math.ceil(step / 2);
    parts.push(block(at, 0, 1, CEILING, wall), orb(lampX, low, other(wall)));
    if (traps) parts.push(orb(lampX, high, wall));
    wall = other(wall);
  }
  const end = x + lead + (gates - 1) * step + 6;
  parts.push(block(x + 2, CEILING, end - x - 2, 1), thorns(x + lead - 3, end - x - lead - 1));
  return {
    parts,
    portals: [{ x: x + 1, mode: 'fly' }, { x: end, mode: 'run' }],
    width: end - x + 8,
  };
};

// een trap de lucht in: zwevende treden om en om goud en blauw, elke trede één blok hoger.
// orbs = de volgende trede aanzetten met een zwevende lamp boven het gat in plaats van een zuil
export const lampStairs = (count, orbs = false) => (x, tempo) => {
  const w = 3;
  const gap = Math.max(1, Math.round(tempo.jump * 0.4));
  let tone = 'gold';
  const parts = [beam(x + 1, tone)];
  let at = x + 3;
  for (let i = 0; i < count; i++) {
    const last = i + 1 === count;
    parts.push(block(at, i, last ? w + 3 : w, 1, tone));
    at += last ? w + 3 : w;
    if (!last) {
      tone = other(tone);
      parts.push(orbs ? orb(at + gap / 2, i + 3, tone) : beam(at + gap / 2 - 0.3, tone));
      at += gap;
    }
  }
  parts.push(thorns(x + 3, at - x - 3)); // na de bovenste trede spring je naar beneden, op de grond
  return { parts, width: at - x + 4 };
};
