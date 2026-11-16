// Kleine rekenhulpjes voor posities op het veld (x, z).
import { FIELD } from './config.js';

export const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

// richting als intent: { x, z } met lengte 1 (of 0 als je er al bent)
export function toward(from, to, slow = 0.4) {
  const dx = to.x - from.x, dz = to.z - from.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.05) return { x: 0, z: 0 };
  const f = Math.min(1, d / slow) / d; // vlak bij het doel rustig aankomen
  return { x: dx * f, z: dz * f };
}

export function clampField(p, margin = 0.8) {
  return {
    x: Math.max(-FIELD.halfL + margin, Math.min(FIELD.halfL - margin, p.x)),
    z: Math.max(-FIELD.halfW + margin, Math.min(FIELD.halfW - margin, p.z)),
  };
}

// kortste afstand van punt p tot het lijnstuk a-b
export function lineDistance(p, a, b) {
  const dx = b.x - a.x, dz = b.z - a.z;
  const len2 = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / len2));
  return Math.hypot(p.x - (a.x + dx * t), p.z - (a.z + dz * t));
}
