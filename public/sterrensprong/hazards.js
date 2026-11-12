// Wanneer raakt de lantaarn iets gevaarlijks? Losse functies zonder beeld, ook gebruikt door het
// tekenen (de knots hangt in beeld precies waar hij in de regels hangt).
import { PHYS, SPIKE_HIT, THORN_HIT } from './config.js';

const HEIGHT = PHYS.half * 2;
const SOFT = 0.82; // ronde gevaren raken pas iets binnen de rand

const boxHit = (run, x0, x1, y0, y1) =>
  run.x + PHYS.half > x0 && run.x - PHYS.half < x1 && run.y < y1 && run.y + HEIGHT > y0;

// een punt naar boven, naar beneden (aan het plafond) of naar links (aan de zijkant van een toren)
function spikeHit(run, ob) {
  const { inset, height } = SPIKE_HIT;
  if (ob.dir === 'down') return boxHit(run, ob.x + inset, ob.x + ob.w - inset, ob.y + ob.h - height, ob.y + ob.h);
  if (ob.dir === 'left') return boxHit(run, ob.x + ob.w - height, ob.x + ob.w, ob.y + inset, ob.y + ob.h - inset);
  return boxHit(run, ob.x + inset, ob.x + ob.w - inset, ob.y, ob.y + height);
}

function circleHit(run, cx, cy, r) {
  const px = Math.max(run.x - PHYS.half, Math.min(cx, run.x + PHYS.half));
  const py = Math.max(run.y, Math.min(cy, run.y + HEIGHT));
  return (px - cx) ** 2 + (py - cy) ** 2 < (r * SOFT) ** 2;
}

// de knots zwaait mee met hoe ver je bent, niet met de klok: na een checkpoint hangt hij
// dus altijd op dezelfde plek als je daar aankomt
export function maceBall(ob, x) {
  const angle = ob.swing * Math.sin((2 * Math.PI * (x - ob.x0)) / ob.period);
  return { x: ob.px + ob.length * Math.sin(angle), y: ob.py - ob.length * Math.cos(angle), angle };
}

export const HAZARDS = {
  spike: spikeHit,
  thorn: (run, ob) => boxHit(run, ob.x + THORN_HIT.inset, ob.x + ob.w - THORN_HIT.inset, ob.y, ob.y + THORN_HIT.height),
  saw: (run, ob) => circleHit(run, ob.cx, ob.cy, ob.r),
  mace: (run, ob) => {
    const ball = maceBall(ob, run.x);
    return circleHit(run, ball.x, ball.y, ob.r);
  },
};
