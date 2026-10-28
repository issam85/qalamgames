// Invoer van de sprint: toetsen en aanraken voor de spelers, en het ritme van de
// CPU-lopers. De CPU's passen hun tempo aan dat van de spelers aan, zodat ook jonge
// kinderen een spannende race hebben.
const KEYS = { 'Speler 1': 'Space', 'Speler 2': 'ArrowUp' };
export const KEY_LABELS = { 'Speler 1': 'SPATIE', 'Speler 2': 'PIJL OMHOOG' };
export const TOUCH = window.matchMedia('(pointer: coarse)').matches;

const DEFAULT_RATE = 5.5; // drukken per seconde zolang er nog geen speltempo is
const WINDOW_MS = 2000;

// press(i) bij elke druk van speler i; canPress() bepaalt of de race loopt
export function createInput(players, stage, press, canPress) {
  const humans = players.map((p, i) => (p.control === 'CPU' ? -1 : i)).filter((i) => i >= 0);
  const next = players.map(() => 0);
  // elke CPU is net iets sneller of langzamer dan de spelers
  const factor = players.map(() => 0.88 + Math.random() * 0.2);
  const recent = [];

  const hit = (idx) => {
    recent.push(performance.now());
    press(idx);
  };
  const onKey = (e) => {
    const idx = players.findIndex((p) => KEYS[p.control] === e.code);
    if (idx === -1) return;
    e.preventDefault();
    if (canPress() && !e.repeat) hit(idx);
  };
  // aanraken: met één speler telt het hele veld, met twee de linker- en rechterhelft
  const onPointer = (e) => {
    if (!canPress() || humans.length === 0) return;
    e.preventDefault();
    const box = stage.getBoundingClientRect();
    const right = e.clientX - box.left > box.width / 2;
    hit(humans.length > 1 && right ? humans[1] : humans[0]);
  };

  // gemiddeld tempo van de spelers over de laatste twee seconden
  const humanRate = (now) => {
    while (recent.length && now - recent[0] > WINDOW_MS) recent.shift();
    if (humans.length === 0 || recent.length < 3) return DEFAULT_RATE;
    return recent.length / (WINDOW_MS / 1000) / humans.length;
  };
  const delay = (i, now) => {
    const rate = Math.min(7.5, Math.max(3.5, humanRate(now) * factor[i]));
    return (1000 / rate) * (0.8 + Math.random() * 0.4);
  };

  return {
    attach() {
      window.addEventListener('keydown', onKey);
      stage.addEventListener('pointerdown', onPointer);
    },
    detach() {
      window.removeEventListener('keydown', onKey);
      stage.removeEventListener('pointerdown', onPointer);
    },
    start(now) {
      players.forEach((_, i) => { next[i] = now + delay(i, now); });
    },
    tick(now) {
      players.forEach((p, i) => {
        if (p.control !== 'CPU' || now < next[i]) return;
        press(i);
        next[i] = now + delay(i, now);
      });
    },
  };
}
