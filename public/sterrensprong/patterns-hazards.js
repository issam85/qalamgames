// Stukken met de nieuwe gevaren: sterzagen en zwaaiende knotsen. Rekenen met de snelheid.
const block = (x, y, w, h) => ({ type: 'block', x, y, w, h });
const pad = (x) => ({ type: 'pad', x, y: 0, w: 1, h: 0.2 });
const thorns = (x, w) => ({ type: 'thorn', x, y: 0, w, h: 0.5 });
export const saw = (cx, cy, r) => ({ type: 'saw', cx, cy, r, x: cx - r, y: cy - r, w: 2 * r, h: 2 * r });

function mace(px, py, length, swing, period, x0) {
  const reach = length * Math.sin(swing) + 0.55;
  return { type: 'mace', px, py, length, swing, period, x0, r: 0.55, x: px - reach, y: py - length - 0.55, w: 2 * reach, h: length + 1.1 };
}

// zagen half in de grond, op de maat van een sprong
export const sawRow = (count) => (x, tempo) => {
  const step = Math.ceil(tempo.jump) + 2;
  const parts = [];
  for (let i = 0; i < count; i++) parts.push(saw(x + 1 + i * step, 0, 1));
  return { parts, width: (count - 1) * step + 2 };
};

// eilandjes met een zaag in elk gat: wie ertussen valt, raakt de zaag
export const sawTowers = (count, height, w) => (x, tempo) => {
  const usesPad = height > 2;
  const lead = usesPad ? Math.ceil(tempo.speed * 0.33) : 0;
  const first = Math.max(w, 3);
  const gap = Math.max(2, Math.round(tempo.jump) - w);
  const parts = usesPad ? [pad(x)] : [];
  let at = x + lead;
  parts.push(block(at, 0, first, height));
  at += first;
  for (let i = 1; i < count; i++) {
    parts.push(thorns(at, gap), saw(at + gap / 2, height - 0.6, Math.min(1.2, gap / 2 + 0.15)), block(at + gap, 0, w, height));
    at += gap + w;
  }
  return { parts, width: at - x + 3, noCheckpoint: tempo.speed >= 10.5 };
};

// knotsen aan een ketting, laag boven de grond. Om en om hangt er een onderaan als je aankomt
// (springen!) of zwaait hij net opzij (doorlopen, niet springen)
export const maceRow = (count) => (x, tempo) => {
  const period = tempo.speed * 2.6;
  const step = Math.ceil(tempo.speed * 1.1) + 3;
  const parts = [];
  for (let i = 0; i < count; i++) {
    const px = x + 4 + i * step;
    parts.push(mace(px, 4.4, 3.6, 0.6, period, i % 2 ? px - period / 4 : px));
  }
  return { parts, width: 4 + (count - 1) * step + 5 };
};
