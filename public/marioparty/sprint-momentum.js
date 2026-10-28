// Momentum van een loper: elke druk geeft een stoot energie (power 0–1) die vanzelf
// wegzakt. De snelheid volgt de power; wie lang genoeg boven de turbogrens blijft,
// gaat in turbo en loopt nog harder. Zo telt volhouden, niet alleen snel tikken.

export const MAX_SPEED = 10; // wereldeenheden per seconde bij volle power
export const TURBO_AT = 0.85;
const BOOST = 0.12; // power per druk
const DECAY = 0.95; // power-verlies per seconde (evenredig)
const TURBO_DELAY = 0.6; // zo lang (s) boven de grens voordat turbo aangaat
const TURBO_BONUS = 1.25;

export function createMomentum() {
  return { power: 0, speed: 0, above: 0, turbo: false };
}

export function boost(m) {
  m.power = Math.min(1, m.power + BOOST);
}

// werkt power, turbo en snelheid bij; geeft de afgelegde afstand terug
export function stepMomentum(m, dt, running) {
  m.power = Math.max(0, m.power - m.power * DECAY * dt);
  m.above = m.power >= TURBO_AT ? m.above + dt : 0;
  m.turbo = running && m.above >= TURBO_DELAY;
  const target = running ? m.power * MAX_SPEED * (m.turbo ? TURBO_BONUS : 1) : 0;
  m.speed += (target - m.speed) * Math.min(1, dt * 4);
  return m.speed * dt;
}

// 0–1 voor de renanimatie en effecten
export function speedFraction(m) {
  return Math.min(1, m.speed / (MAX_SPEED * TURBO_BONUS));
}
