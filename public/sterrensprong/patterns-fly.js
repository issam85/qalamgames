// Vliegstukken: door een poort op het tapijt, tussen vloer en plafond door poortjes, weer lopen.
// Vasthouden = omhoog, loslaten = zakken. Alle randen liggen op hele blokken, zodat wat je
// ziet precies is wat je raakt.
import { saw } from './patterns-hazards.js';

const CEILING = 7; // onderkant van het plafond
const BOTTOMS = [2, 4, 1, 3, 2, 4, 3, 1]; // onderkant van elke opening, om en om hoog en laag

const block = (x, y, w, h) => ({ type: 'block', x, y, w, h });
const thorns = (x, w) => ({ type: 'thorn', x, y: 0, w, h: 0.5 });
const spike = (x, y, dir) => ({ type: 'spike', x, y, w: 1, h: 1, dir });

// één poortje: een toren van onder en van boven, met spiky punten rond de opening
function gate(at, bottom, gap, spiky) {
  const parts = [];
  const top = bottom + gap + (spiky ? 1 : 0);
  if (spiky && bottom >= 1) {
    if (bottom > 1) parts.push(block(at, 0, 1, bottom - 1));
    parts.push(spike(at, bottom - 1, 'up'), spike(at - 1, Math.max(0, bottom - 2), 'left'));
  } else if (bottom > 0) parts.push(block(at, 0, 1, bottom));
  if (spiky) parts.push(spike(at, top - 1, 'down'), spike(at - 1, top, 'left'));
  parts.push(block(at, top, 1, CEILING - top));
  return parts;
}

// gates = aantal openingen, gap = hoe hoog een opening is (3 makkelijk, 2 moeilijk)
// spiky = punten rond de openingen, saws = zagen half in het plafond tussen de poortjes
export const flight = (gates, gap, { spiky = false, saws = false } = {}) => (x, tempo) => {
  const lead = 6;
  const step = Math.ceil(tempo.speed * 0.6) + 2 + (spiky ? 1 : 0);
  const parts = [];
  for (let i = 0; i < gates; i++) {
    const bottom = Math.min(BOTTOMS[i % BOTTOMS.length], CEILING - gap - (spiky ? 1 : 0));
    const at = x + lead + i * step;
    parts.push(...gate(at, bottom, gap, spiky));
    if (saws && i + 1 < gates) parts.push(saw(at + step / 2 + 0.5, CEILING, 1.1));
  }
  const end = x + lead + (gates - 1) * step + 6;
  parts.push(block(x + 2, CEILING, end - x - 2, 1), thorns(x + 3, end - x - 4));
  return {
    parts,
    portals: [{ x: x + 1, mode: 'fly' }, { x: end, mode: 'run' }],
    width: end - x + 8,
  };
};
