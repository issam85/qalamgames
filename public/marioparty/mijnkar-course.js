// Mijnkar: het parcours (voor alle karretjes gelijk), de karretjes en de CPU.
// Afstand d loopt in eenheden langs het spoor; een karretje rijdt vanzelf en springt
// op een druk. Raak je een rots, kristal of gat, dan sta je even stil.
import { createSprite, play } from './sprites.js';

export const COURSE_LEN = 2600;
export const SPEED = 230; // eenheden per seconde
export const JUMP_T = 0.62; // sprongduur (s)
export const JUMP_H = 95;
export const GAP_W = 90;
const STUN = 0.9; // stilstaan na een botsing (s)
const HIT_RANGE = 34; // zo dicht bij een obstakel kun je het raken
const CLEAR_LIFT = 26; // hoger dan dit spring je eroverheen
const TYPES = ['rock', 'gap', 'crystal', 'rock', 'crystal'];

export function buildCourse() {
  const course = [];
  let d = 480;
  let i = 0;
  while (d < COURSE_LEN - 260) {
    course.push({ d, type: TYPES[(i + Math.floor(Math.random() * 2)) % TYPES.length] });
    d += 240 + Math.random() * 140;
    i += 1;
  }
  return course;
}

export function createCart(player, lane) {
  // elke CPU mist af en toe: hoe vaak verschilt per karretje
  const cpu = player.control === 'CPU'
    ? { miss: 0.08 + Math.random() * 0.14, planned: -1, jumpAt: 0 }
    : null;
  return {
    player, lane, cpu, d: 0, speed: 0, lift: 0, jumpT: -1, stun: 0, next: 0, hit: 0,
    finishTime: undefined, sprite: createSprite(player.character.key),
  };
}

export function canJump(cart) {
  return cart.jumpT < 0 && cart.stun <= 0 && cart.finishTime === undefined;
}

// het hele karretje springt; het karakter blijft zitten (de springanimatie zou boven
// het karretje uitvliegen)
export function jump(cart) {
  if (!canJump(cart)) return;
  cart.jumpT = 0;
}

function bump(cart) {
  cart.stun = STUN;
  cart.speed = 0;
  cart.hit = 1;
  cart.next += 1;
  play(cart.sprite, 'sad', true);
  cart.sprite.speed = 3;
}

// de CPU kiest per obstakel wanneer hij springt: meestal op tijd, soms te vroeg.
// Wie ver voor de spelers ligt, mist vaker; wie achterligt, bijna nooit.
function cpuThink(cart, ob, leadOnHumans) {
  if (cart.cpu.planned !== cart.next) {
    cart.cpu.planned = cart.next;
    const miss = leadOnHumans > 350 ? cart.cpu.miss * 2 : leadOnHumans < -350 ? 0.02 : cart.cpu.miss;
    cart.cpu.jumpAt = Math.random() < miss
      ? SPEED * (0.85 + Math.random() * 0.3)
      : SPEED * (0.2 + Math.random() * 0.14);
  }
  if (ob.d - cart.d <= cart.cpu.jumpAt && canJump(cart)) jump(cart);
}

// één stap; geeft de exacte finishtijd (s) terug zodra het karretje over de finish is
export function stepCart(cart, course, dt, clock, leadOnHumans) {
  if (cart.finishTime !== undefined) {
    cart.d += SPEED * dt;
    return null;
  }
  cart.stun = Math.max(0, cart.stun - dt);
  cart.hit = Math.max(0, cart.hit - dt * 2);
  const target = cart.stun > 0 ? 0 : SPEED;
  cart.speed += (target - cart.speed) * Math.min(1, dt * 6);
  cart.d += cart.speed * dt;
  if (cart.jumpT >= 0) {
    cart.jumpT += dt;
    cart.lift = Math.sin(Math.PI * Math.min(1, cart.jumpT / JUMP_T)) * JUMP_H;
    if (cart.jumpT >= JUMP_T) {
      cart.jumpT = -1;
      cart.lift = 0;
    }
  } else if (cart.stun <= 0 && cart.sprite.anim === 'sad') {
    play(cart.sprite, 'idle');
    cart.sprite.speed = 1;
  }
  const ob = course[cart.next];
  if (ob) {
    if (cart.cpu) cpuThink(cart, ob, leadOnHumans);
    if (cart.d > ob.d + HIT_RANGE) cart.next += 1;
    else if (cart.d > ob.d - HIT_RANGE && cart.lift < CLEAR_LIFT) bump(cart);
  }
  if (cart.d >= COURSE_LEN) {
    cart.finishTime = clock - (cart.d - COURSE_LEN) / Math.max(1, cart.speed);
    play(cart.sprite, 'cheer');
    cart.sprite.speed = 1;
    return cart.finishTime;
  }
  return null;
}
