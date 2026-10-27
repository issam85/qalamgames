// Invoer van de sprint: toetsen van de spelers en het ritme van de CPU-lopers.
const KEYS = { 'Speler 1': 'Space', 'Speler 2': 'ArrowUp' };
export const KEY_LABELS = { 'Speler 1': 'SPATIE', 'Speler 2': 'PIJL OMHOOG' };

function cpuDelay() {
  return 120 + Math.random() * 120;
}

// press(i) wordt aangeroepen bij elke druk van speler i; canPress() bepaalt of de race loopt
export function createInput(players, press, canPress) {
  const next = players.map(() => 0);
  const onKey = (e) => {
    const idx = players.findIndex((p) => KEYS[p.control] === e.code);
    if (idx === -1) return;
    e.preventDefault();
    if (canPress() && !e.repeat) press(idx);
  };
  return {
    attach() {
      window.addEventListener('keydown', onKey);
    },
    detach() {
      window.removeEventListener('keydown', onKey);
    },
    // eerste keer: CPU-ritme starten; daarna drukken de CPU-lopers op hun eigen tempo
    start(now) {
      players.forEach((_, i) => { next[i] = now + cpuDelay(); });
    },
    tick(now) {
      players.forEach((p, i) => {
        if (p.control !== 'CPU' || now < next[i]) return;
        press(i);
        next[i] = now + cpuDelay();
      });
    },
  };
}
