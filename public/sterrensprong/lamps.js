// Kleurlampen, zonder beeld: blokken zijn goud of blauw en alleen de kleur die aan staat is vast.
// Raak je een lamp, dan gaat zijn kleur aan. Een lichtzuil (beam) raak je altijd; een zwevende
// lamp alleen als je erheen springt of vliegt. Een blok dat vast wordt terwijl je erin zit,
// laat je door (through), anders zou een lamp je zomaar laten botsen.
import { PHYS } from './config.js';

const HEIGHT = PHYS.half * 2;
export const START_TONE = 'gold';

const overlaps = (run, ob) =>
  run.x + PHYS.half > ob.x && run.x - PHYS.half < ob.x + ob.w && run.y < ob.y + ob.h && run.y + HEIGHT > ob.y;

// welke kleur aan staat als je op x begint: die van de laatste lichtzuil ervoor
export function toneAt(level, x) {
  let tone = START_TONE;
  level.obstacles.forEach((ob) => {
    if (ob.type === 'lamp' && ob.beam && ob.x <= x) tone = ob.tone;
  });
  return tone;
}

// true als dit blok nu niet vast is
export const isGhost = (run, ob) => Boolean(ob.tone) && (ob.tone !== run.tone || run.through.has(ob));

export function touchLamp(run, ob, obstacles, from) {
  if (ob.tone === run.tone || !overlaps(run, ob)) return;
  run.tone = ob.tone;
  const inside = [];
  for (let i = from; i < obstacles.length && obstacles[i].x < run.x + PHYS.half; i++) {
    const other = obstacles[i];
    if (other.type === 'block' && other.tone === ob.tone && overlaps(run, other)) inside.push(other);
  }
  run.through = new Set(inside);
  run.events.push({ type: 'lamp', tone: ob.tone, x: run.x, y: run.y });
}
