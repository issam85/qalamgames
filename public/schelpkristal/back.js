// De terugknop linksboven (zoals in Mario Party): één stap terug in het spel, niet het
// spel uit (dat doet het deurtje van de site). Per scherm staat in steps wat "een stap
// terug" is. Esc doet hetzelfde.
const btn = document.getElementById('back-btn');
let steps = {};
let current = 'screen-start';

const goBack = () => {
  const step = steps[current];
  if (step) step();
};

export function initBack(map) {
  steps = map;
  btn.addEventListener('click', goBack);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') goBack();
  });
}

// bij elke schermwissel: knop alleen tonen waar een stap terug kan
export function backFor(id) {
  current = id;
  btn.hidden = !steps[id];
}

export { goBack };
