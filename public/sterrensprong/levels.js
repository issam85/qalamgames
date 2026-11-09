// Levels: x = linkerkant, y = onderkant, in blokken vanaf de start.
const spikes = (x, count = 1, y = 0) =>
  Array.from({ length: count }, (_, i) => ({ type: 'spike', x: x + i, y, w: 1, h: 1 }));
const block = (x, y, w, h) => [{ type: 'block', x, y, w, h }];

function level(name, length, parts) {
  return { name, length, obstacles: parts.flat().sort((a, b) => a.x - b.x) };
}

export const TEST_LEVEL = level('Test', 118, [
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
]);
