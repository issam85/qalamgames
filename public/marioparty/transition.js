// Schermovergang zoals in Mario Party: een ster groeit tot hij het beeld
// vult, het scherm wisselt, en de ster krimpt weer.
const wipe = document.getElementById('wipe');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const DURATION = 380;

function grow(from, to) {
  return wipe.animate([
    { transform: `translate(-50%, -50%) rotate(${from * 90 - 90}deg) scale(${from})` },
    { transform: `translate(-50%, -50%) rotate(${to * 90 - 90}deg) scale(${to})` },
  ], { duration: DURATION, easing: 'ease-in-out', fill: 'forwards' }).finished;
}

let busy = Promise.resolve();

// voert change() uit achter de ster; overgangen lopen na elkaar
export function withWipe(change) {
  busy = busy.then(async () => {
    if (reduceMotion.matches) {
      change();
      return;
    }
    wipe.hidden = false;
    await grow(0, 1);
    change();
    await grow(1, 0);
    wipe.hidden = true;
  });
  return busy;
}
