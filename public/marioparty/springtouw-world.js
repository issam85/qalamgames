// Springtouw: het touw draait steeds sneller; wie op de grond staat als het touw
// langskomt, ligt eruit. De laatste wint. Fase 0 = het touw raakt de grond.
import { createSprite, play } from './sprites.js';

export const GROUND = 470;
export const SPOTS = [330, 430, 530, 630];
export const JUMP_T = 0.55; // sprongduur (s)
const AIR_FROM = 0.06; // zo lang na de druk ben je in de lucht …
const AIR_TO = 0.48; // … en zo lang blijf je er
const START_T = 1.5; // omlooptijd van het touw aan het begin (s)
const MIN_T = 0.62;
const SPEEDUP = 0.95; // na elke geslaagde ronde

export function createRope() {
  return { phase: 0.2, T: START_T, passes: 0 };
}

export function createJumper(player, i) {
  const cpu = player.control === 'CPU'
    ? { lead: 0.12 + Math.random() * 0.15, miss: 0.02 + Math.random() * 0.03, decided: false, skip: false }
    : null;
  return { player, cpu, x: SPOTS[i], jumpT: -1, out: false, place: 0, error: 0, sprite: createSprite(player.character.key) };
}

export function inAir(j) {
  return j.jumpT >= AIR_FROM && j.jumpT <= AIR_TO;
}

export function jump(j) {
  if (j.out || j.jumpT >= 0) return;
  j.jumpT = 0;
  // de springanimatie begint bij frame 10: het hurken slaan we over
  play(j.sprite, 'jump', true);
  j.sprite.t = 10 / 12;
  j.sprite.speed = 3;
}

function land(j) {
  j.jumpT = -1;
  play(j.sprite, j.out ? 'sad' : 'idle');
  j.sprite.speed = 1;
}

// kans dat een CPU deze ronde mist: groter naarmate het touw sneller gaat, en veel
// groter zodra alle spelers eruit liggen (dan is het snel klaar)
function missChance(j, rope, humansLeft) {
  return j.cpu.miss + (START_T - rope.T) * 0.12 + (humansLeft ? 0 : 0.3);
}

function cpuThink(j, rope, humansLeft) {
  const toHit = (1 - rope.phase) * rope.T;
  if (toHit > j.cpu.lead || j.jumpT >= 0) return;
  if (!j.cpu.decided) {
    j.cpu.decided = true;
    j.cpu.skip = Math.random() < missChance(j, rope, humansLeft);
  }
  if (!j.cpu.skip) jump(j);
}

// het touw raakt de grond: wie niet in de lucht is, ligt eruit
function hit(rope, jumpers) {
  const alive = jumpers.filter((j) => !j.out);
  let outCount = jumpers.length - alive.length;
  alive.forEach((j) => {
    if (inAir(j)) {
      j.error += Math.abs(j.jumpT - (AIR_FROM + AIR_TO) / 2);
      return;
    }
    j.out = true;
    j.place = jumpers.length - outCount;
    outCount += 1;
    if (j.jumpT < 0) play(j.sprite, 'sad', true);
  });
  if (alive.some((j) => !j.out)) {
    rope.passes += 1;
    rope.T = Math.max(MIN_T, rope.T * SPEEDUP);
  }
  jumpers.forEach((j) => { if (j.cpu) j.cpu.decided = false; });
}

// één stap; geeft true terug als het touw deze stap de grond raakte
export function stepRound(rope, jumpers, dt) {
  const humansLeft = jumpers.some((j) => !j.cpu && !j.out);
  jumpers.forEach((j) => {
    if (j.cpu && !j.out) cpuThink(j, rope, humansLeft);
    if (j.jumpT >= 0) {
      j.jumpT += dt;
      if (j.jumpT >= JUMP_T) land(j);
    }
  });
  rope.phase += dt / rope.T;
  if (rope.phase < 1) return false;
  rope.phase -= 1;
  hit(rope, jumpers);
  return true;
}

export function aliveCount(jumpers) {
  return jumpers.filter((j) => !j.out).length;
}

// wie nog staat eerst (de preciezere springer bovenaan), dan de afvallers in
// omgekeerde volgorde
export function ranking(jumpers) {
  const alive = jumpers.filter((j) => !j.out).sort((a, b) => a.error - b.error);
  const out = jumpers.filter((j) => j.out).sort((a, b) => a.place - b.place);
  return [...alive, ...out].map((j) => j.player);
}
