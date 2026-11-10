// Doorgeven met één toets per speler, ver uit elkaar over het toetsenbord.
// Op een tablet heeft iedereen een eigen strook van het scherm.
export const isTouch = () => matchMedia('(hover: none)').matches;

const KEYS = {
  a: { glyph: 'A', name: 'A' },
  g: { glyph: 'G', name: 'G' },
  ' ': { glyph: 'Spatie', name: 'spatie' },
  l: { glyph: 'L', name: 'L' },
  arrowright: { glyph: '→', name: '→' },
};

const LAYOUTS = {
  1: ['arrowright'],
  2: ['a', 'arrowright'],
  3: ['a', ' ', 'arrowright'],
  4: ['a', 'g', 'l', 'arrowright'],
  5: ['a', 'g', ' ', 'l', 'arrowright'],
};

// Wat boven je hoofd staat als de bom bij je is.
export function keyGlyph(human, humans) {
  return isTouch() ? 'Tik!' : KEYS[LAYOUTS[humans][human]].glyph;
}

// Wat achter je naam staat; op een tablet niets.
export function keyName(human, humans) {
  return isTouch() ? '' : KEYS[LAYOUTS[humans][human]].name;
}

export function bindInput(stage, getHumans, onPress) {
  addEventListener('keydown', (e) => {
    if (e.repeat || e.target.closest?.('.overlay')) return;
    const who = LAYOUTS[getHumans()].indexOf(e.key.toLowerCase());
    if (who < 0) return;
    e.preventDefault();
    onPress(who);
  });
  stage.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const n = getHumans();
    const box = stage.getBoundingClientRect();
    onPress(Math.min(n - 1, Math.floor(((e.clientX - box.left) / box.width) * n)));
  });
}
