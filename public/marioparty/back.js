// De terugknop linksboven: één stap terug in Mario Party (niet het spel uit; dat doet
// het deurtje van de site). Per scherm staat in steps wat "een stap terug" is.
const btn = document.getElementById('back-btn');
let steps = {};
let current = 'screen-setup';
let busy = false;

export function initBack(map) {
  steps = map;
  btn.addEventListener('click', async () => {
    const step = steps[current];
    if (!step || busy) return;
    busy = true;
    try {
      await step();
    } finally {
      busy = false;
    }
  });
}

// bij elke schermwissel: knop alleen tonen waar een stap terug kan
export function backFor(id) {
  current = id;
  btn.hidden = !steps[id];
}
