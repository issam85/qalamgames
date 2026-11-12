// Stukjes parcours. Elk stukje rekent met de snelheid, zodat het overal te halen blijft.
// Een stukje is (x, tempo) => { parts, width }; tempo.jump = afstand van één sprong.
const AIR_RING = 0.484; // zo lang duurt de boog uit een ring
const AIR_PAD = 0.677; // zo lang duurt de boog van een veer

const spikes = (x, count = 1, y = 0) =>
  Array.from({ length: count }, (_, i) => ({ type: 'spike', x: x + i, y, w: 1, h: 1 }));
const block = (x, y, w, h) => ({ type: 'block', x, y, w, h });
const thorns = (x, w) => ({ type: 'thorn', x, y: 0, w, h: 0.5 });
const pad = (x) => ({ type: 'pad', x, y: 0, w: 1, h: 0.2 });
const ring = (x, y) => ({ type: 'ring', x: x - 0.9, y: y - 0.9, w: 1.8, h: 1.8 });

export const row = (count) => (x) => ({ parts: spikes(x, count), width: count });

// punten precies op de maat van een sprong: blijven springen werkt
export const rhythm = (count, size = 1) => (x, tempo) => {
  const step = Math.ceil(tempo.jump) + size;
  const parts = [];
  for (let i = 0; i < count; i++) parts.push(...spikes(x + i * step, size));
  return { parts, width: count * step };
};

// trap omhoog, optioneel met punten waar je anders op landt
export const stairs = (count, punish = false) => (x, tempo) => {
  const gap = Math.max(1, Math.round(tempo.jump * 0.45));
  const w = 3;
  const parts = [];
  for (let i = 0; i < count; i++) parts.push(block(x + i * (w + gap), 0, w, i + 1));
  const end = count * w + (count - 1) * gap;
  if (punish) parts.push(...spikes(x + end + 2, 2));
  return { parts, width: end + (punish ? 6 : 3), noCheckpoint: tempo.speed >= 12 };
};

export const shelf = (w, count) => (x) => ({
  parts: [block(x, 0, w, 1), ...spikes(x + Math.floor(w / 2), count, 1)],
  width: w + 1,
});

// laag plafond: juist níét springen
export const tunnel = (w) => (x) => ({ parts: [block(x, 1.4, w, 1)], width: w });

export const padOver = () => (x, tempo) => {
  const count = Math.floor(tempo.speed * AIR_PAD) - 3;
  return { parts: [pad(x), ...spikes(x + 2, count)], width: count + 4 };
};

// torens of eilandjes in de doornen; hoe smaller, hoe preciezer je landt
export const towers = (count, height, w) => (x, tempo) => {
  const usesPad = height > 2;
  const lead = usesPad ? Math.ceil(tempo.speed * 0.33) : 0;
  const first = Math.max(w, 3); // de eerste is altijd breed genoeg om aan te komen
  const gap = Math.max(1, Math.round(tempo.jump) - w);
  const parts = usesPad ? [pad(x)] : [];
  let at = x + lead;
  parts.push(block(at, 0, first, height));
  at += first;
  for (let i = 1; i < count; i++) {
    parts.push(thorns(at, gap), block(at + gap, 0, w, height));
    at += gap + w;
  }
  // op hoge snelheid heb je een aanloop nodig: daar geen checkpoint vlak voor de torens
  return { parts, width: at - x + 3, noCheckpoint: tempo.speed >= 10.5 };
};

// een veld doornen dat je alleen met ringen oversteekt
export const ringChain = (count) => (x, tempo) => {
  const step = Math.round(tempo.speed * AIR_RING);
  const firstRing = x + Math.ceil(tempo.speed * 0.27) + 1;
  const parts = [];
  for (let i = 0; i < count; i++) parts.push(ring(firstRing + i * step, 2.2));
  const landing = firstRing + (count - 1) * step + Math.ceil(tempo.speed * 0.3);
  const w = Math.ceil(tempo.speed * 0.4) + 2;
  parts.push(thorns(x + 2, landing - x - 2), block(landing, 0, w, 1));
  return { parts, width: landing - x + w + 2 };
};
