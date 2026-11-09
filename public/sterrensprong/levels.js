// Levels: x = linkerkant, y = onderkant, in blokken vanaf de start.
const spikes = (x, count = 1, y = 0) =>
  Array.from({ length: count }, (_, i) => ({ type: 'spike', x: x + i, y, w: 1, h: 1 }));
const block = (x, y, w, h) => [{ type: 'block', x, y, w, h }];
const thorns = (x, w, y = 0) => [{ type: 'thorn', x, y, w, h: 0.5 }];
const pad = (x, y = 0) => [{ type: 'pad', x, y, w: 1, h: 0.2 }];
const ring = (x, y) => [{ type: 'ring', x: x - 0.75, y: y - 0.75, w: 1.5, h: 1.5 }];

// kleuren per stuk van een level: muur, vloer en de lichtlijnen langs de baan
const NIGHT = { wall: '#4a35ac', floor: '#5a44c8', glow: '#38e8d8' };
const TEAL = { wall: '#14808f', floor: '#127082', glow: '#ffd43b' };
const ROSE = { wall: '#a02c78', floor: '#8a2468', glow: '#7fffd4' };
const AMBER = { wall: '#b05a24', floor: '#8e4a1e', glow: '#7fd3ff' };

function level(name, length, zones, parts) {
  return { name, length, zones, obstacles: parts.flat().sort((a, b) => a.x - b.x) };
}

export const TEST_LEVEL = level('Test', 176, [
  { x: 0, ...NIGHT },
  { x: 44, ...TEAL },
  { x: 92, ...ROSE },
  { x: 118, ...AMBER },
], [
  spikes(16),
  spikes(25, 2),
  spikes(34, 3),
  block(44, 0, 4, 1),
  block(51, 0, 4, 2),
  block(58, 0, 4, 3),
  spikes(64, 2),
  spikes(74),
  block(80, 0, 9, 1),
  spikes(84, 1, 1),
  spikes(93, 3),
  block(102, 0, 3, 1),
  spikes(105, 3),
  block(108, 0, 3, 1),
  pad(118),
  block(122, 0, 5, 3),
  thorns(127, 13),
  ring(130, 4),
  ring(135, 3.4),
  block(140, 0, 4, 2),
  spikes(150, 2),
  thorns(158, 4),
  block(162, 0, 5, 1),
]);
