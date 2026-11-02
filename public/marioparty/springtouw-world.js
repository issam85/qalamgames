// Springtouw: het touw draait steeds sneller; wie op de grond staat als het touw
// langskomt, ligt eruit. De laatste wint. Fase 0 = het touw raakt de grond.
// Een salto is een hogere, langere sprong die een stijlpunt oplevert. Iedereen heeft
// twee levens: de eerste keer dat het touw je raakt, struikel je alleen.
import { createSprite, play } from './sprites.js';

export const GROUND = 470;
export const SPOTS = [330, 430, 530, 630];
export const JUMP_T = 0.55; // sprongduur (s)
export const TRICK_T = 0.8; // sprong met salto
const AIR_FROM = 0.06; // zo lang na de druk ben je in de lucht …
const AIR_END = 0.07; // … tot zo lang voor de landing
const TRICK_UNTIL = 0.3; // tot zo lang na de sprong kun je nog een salto inzetten
const START_T = 1.5; // omlooptijd van het touw aan het begin (s)
const MIN_T = 0.62;
const SPEEDUP = 0.95; // na elke geslaagde ronde

export function createRope() {
  return { phase: 0.2, T: START_T, passes: 0 };
}

export function createJumper(player, i) {
  const cpu = player.control === 'CPU'
    ? { lead: 0.12 + Math.random() * 0.15, miss: 0.02 + Math.random() * 0.03, decided: false, skip: false, wantTrick: false }
    : null;
  return {
    player, cpu, x: SPOTS[i], jumpT: -1, trick: false, style: 0, lives: 2, stumble: 0,
    out: false, place: 0, error: 0, sprite: createSprite(player.character.key),
  };
}

export function duration(j) {
  return j.trick ? TRICK_T : JUMP_T;
}

export function inAir(j) {
  return j.jumpT >= AIR_FROM && j.jumpT <= duration(j) - AIR_END;
}

export function jump(j) {
  if (j.out || j.jumpT >= 0 || j.stumble > 0) return;
  j.jumpT = 0;
  j.trick = false;
  // de springanimatie begint bij frame 14: het hurken en het scheve eerste
  // zweefframe slaan we over
  play(j.sprite, 'jump', true);
  j.sprite.t = 14 / 12;
  j.sprite.speed = 3;
}

// geeft true terug als de salto is ingezet
export function trick(j) {
  if (j.out || j.jumpT < 0 || j.trick || j.jumpT > TRICK_UNTIL) return false;
  j.trick = true;
  j.style += 1;
  return true;
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
    // een salto alleen zolang het touw rustig draait
    j.cpu.wantTrick = !j.cpu.skip && rope.T > 0.95 && Math.random() < 0.3;
  }
  if (!j.cpu.skip) jump(j);
}

// het touw raakt de grond: wie niet in de lucht is, verliest een leven; zonder levens
// lig je eruit. Vallen er meer tegelijk uit, dan staat wie de meeste salto's deed het
// hoogst. Geeft terug wie geraakt werd
function hit(rope, jumpers) {
  const alive = jumpers.filter((j) => !j.out);
  const struck = alive.filter((j) => !inAir(j)).sort((a, b) => a.style - b.style || b.error - a.error);
  alive.forEach((j) => { if (inAir(j)) j.error += Math.abs(j.jumpT - duration(j) / 2); });
  let place = alive.length;
  struck.forEach((j) => {
    j.lives -= 1;
    j.stumble = 0.8;
    if (j.jumpT < 0) play(j.sprite, 'sad', true);
    if (j.lives > 0) return;
    j.out = true;
    j.place = place;
    place -= 1;
  });
  if (struck.length < alive.length) {
    rope.passes += 1;
    rope.T = Math.max(MIN_T, rope.T * SPEEDUP);
  }
  jumpers.forEach((j) => { if (j.cpu) j.cpu.decided = false; });
  return struck;
}

// één stap; geeft { struck, tricks } terug: wie het touw raakte (null als het touw de
// grond niet raakte), en wie een salto inzette
export function stepRound(rope, jumpers, dt) {
  const humansLeft = jumpers.some((j) => !j.cpu && !j.out);
  const tricks = [];
  jumpers.forEach((j) => {
    j.stumble = Math.max(0, j.stumble - dt);
    if (j.stumble <= 0 && j.jumpT < 0 && !j.out && j.sprite.anim === 'sad') play(j.sprite, 'idle');
    if (j.cpu && !j.out) cpuThink(j, rope, humansLeft);
    if (j.jumpT >= 0) {
      j.jumpT += dt;
      if (j.cpu && j.cpu.wantTrick && j.jumpT >= 0.12) {
        j.cpu.wantTrick = false;
        if (trick(j)) tricks.push(j);
      }
      if (j.jumpT >= duration(j)) land(j);
    }
  });
  rope.phase += dt / rope.T;
  if (rope.phase < 1) return { struck: null, tricks };
  rope.phase -= 1;
  return { struck: hit(rope, jumpers), tricks };
}

// hoe sterk de aanwijzing "Spring!" moet zijn: vol in de eerste rondes, daarna weg
export function cueStrength(rope) {
  const toHit = (1 - rope.phase) * rope.T;
  const learn = Math.max(0, Math.min(1, 1 - (rope.passes - 3) / 5));
  return toHit < 0.45 ? learn : 0;
}

export function aliveCount(jumpers) {
  return jumpers.filter((j) => !j.out).length;
}

// wie nog staat eerst (meeste salto's, dan de preciezere springer), dan de afvallers
export function ranking(jumpers) {
  const alive = jumpers.filter((j) => !j.out).sort((a, b) => b.style - a.style || a.error - b.error);
  const out = jumpers.filter((j) => j.out).sort((a, b) => a.place - b.place);
  return [...alive, ...out].map((j) => j.player);
}
