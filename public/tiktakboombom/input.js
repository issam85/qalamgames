// Doorgeven met één toets per speler, ver uit elkaar over het toetsenbord.
// Op een tablet tik je bij je eigen poppetje (app.js zoekt uit wie dat is).
export const isTouch = () => matchMedia('(hover: none)').matches;

// e.code, zodat het ook werkt met een ander toetsenbord of hoofdletters.
const KEYS = {
  KeyA: { glyph: 'A', name: 'A' },
  KeyG: { glyph: 'G', name: 'G' },
  Space: { glyph: 'Spatie', name: 'spatie' },
  KeyL: { glyph: 'L', name: 'L' },
  ArrowRight: { glyph: '→', name: '→' },
};

const LAYOUTS = {
  1: ['ArrowRight'],
  2: ['KeyA', 'ArrowRight'],
  3: ['KeyA', 'Space', 'ArrowRight'],
  4: ['KeyA', 'KeyG', 'KeyL', 'ArrowRight'],
  5: ['KeyA', 'KeyG', 'Space', 'KeyL', 'ArrowRight'],
};

// Tijdens het spelen mag de pagina eromheen niet scrollen.
const SCROLL = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

// Wat boven je hoofd staat als de bom bij je is.
export function keyGlyph(human, humans) {
  return isTouch() ? '👆' : KEYS[LAYOUTS[humans][human]].glyph;
}

// Wat achter je naam staat; op een tablet niets.
export function keyName(human, humans) {
  return isTouch() ? '' : KEYS[LAYOUTS[humans][human]].name;
}

// h: getHumans(), playing(), onKey(who), onTap(clientX, clientY), onEscape(), onActivity()
export function bindInput(stage, h) {
  addEventListener('keydown', (e) => {
    h.onActivity();
    if (e.code === 'Escape') {
      h.onEscape();
      return;
    }
    if (e.target.closest?.('.overlay') || !h.playing()) return;
    if (SCROLL.has(e.code)) e.preventDefault();
    if (e.repeat) return;
    const who = LAYOUTS[h.getHumans()].indexOf(e.code);
    if (who >= 0) h.onKey(who);
  });
  addEventListener('pointerdown', h.onActivity);
  stage.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    h.onTap(e.clientX, e.clientY);
  });
  stage.addEventListener('contextmenu', (e) => e.preventDefault());
}
