// Sterrenjacht: de vallende sterren, het lopen, springen en vangen, en de
// CPU-spelers. Alle vier lopen op dezelfde grasheuvel en jagen op dezelfde sterren.
// Springen vangt sterren hoger; een ster gevangen tijdens een salto telt dubbel.
import { createSprite, play } from './sprites.js';
import { W } from './stage2d.js';
import { cpuDir, cpuJump } from './sterren-cpu.js';

export const GROUND = 470;
export const SPEED = 330; // looptempo (px/s)
export const CATCH_H = 110; // zo hoog boven je voeten kun je een ster vangen
export const JUMP_T = 0.6;
const JUMP_H = 120;
const CATCH_W = 46;
const SPAWN_EVERY = 0.45;
const BIG_EVERY = 6; // elke zesde ster is een grote (3 punten)
const MARGIN = 60;

export function createHunter(player, i) {
  const cpu = player.control === 'CPU'
    ? { skill: 0.72 + Math.random() * 0.2, pause: 0, target: null, wantTrick: false }
    : null;
  return {
    player, cpu, x: 180 + i * 200, dir: 0, facing: 1, score: 0, lastCatch: 0,
    jumpT: -1, lift: 0, trick: false, glow: 0, sprite: createSprite(player.character.key),
  };
}

export function spawnStar(stars, time, n) {
  const big = n % BIG_EVERY === BIG_EVERY - 1;
  stars.push({
    x: MARGIN + Math.random() * (W - MARGIN * 2), y: -40,
    vy: (big ? 110 : 130) + Math.random() * 70, vx: (Math.random() - 0.5) * 50,
    r: big ? 30 : 19, worth: big ? 3 : 1, rot: Math.random() * Math.PI, born: time,
  });
}

export function jump(h) {
  if (h.jumpT >= 0) return;
  h.jumpT = 0;
  h.trick = false;
  play(h.sprite, 'jump', true);
  h.sprite.t = 14 / 12;
  h.sprite.speed = 3;
}

// salto: vanaf de grond meteen een salto-sprong, of vroeg genoeg in de sprong;
// geeft true terug als hij is ingezet
export function trick(h) {
  if (h.jumpT < 0) jump(h);
  if (h.jumpT < 0 || h.jumpT > JUMP_T - 0.2 || h.trick) return false;
  h.trick = true;
  return true;
}

// dir: -1..1 (CPU's een eigen tempo); zet positie, richting, hoogte en animatie
export function moveHunter(h, dir, dt) {
  h.dir = dir;
  h.x = Math.max(MARGIN, Math.min(W - MARGIN, h.x + dir * SPEED * dt));
  if (dir !== 0) h.facing = dir < 0 ? -1 : 1;
  if (h.jumpT >= 0) {
    h.jumpT += dt;
    h.lift = Math.sin(Math.PI * Math.min(1, h.jumpT / JUMP_T)) * JUMP_H;
    if (h.jumpT >= JUMP_T) {
      h.jumpT = -1;
      h.lift = 0;
      h.trick = false;
      h.sprite.speed = 1;
      play(h.sprite, 'idle');
    }
  } else {
    play(h.sprite, dir !== 0 ? 'run' : 'idle');
  }
  h.glow = Math.max(0, h.glow - dt * 2);
}

export function stepHunters(hunters, stars, input, dt) {
  const humans = hunters.filter((h) => !h.cpu).map((h) => h.score);
  const top = humans.length ? Math.max(...humans) : 0;
  hunters.forEach((h, i) => {
    const dir = h.cpu ? cpuDir(h, stars, dt, h.score - top, hunters) : input.dir(i);
    if (h.cpu) cpuJump(h);
    if (h.cpu && h.cpu.wantTrick && h.jumpT >= 0.12) {
      h.cpu.wantTrick = false;
      trick(h);
    }
    moveHunter(h, dir, dt);
  });
}

// kan h deze ster nu vangen: dichtbij, en tussen zijn voeten en zijn reikhoogte
function canCatch(h, s) {
  return Math.abs(h.x - s.x) < CATCH_W && s.y > GROUND - h.lift - CATCH_H && s.y < GROUND - h.lift + 10;
}

// laat de sterren vallen; gevangen sterren tellen voor de dichtstbijzijnde vanger.
// Geeft de vangsten terug ({ hunter, star, points }) en de sterren die op de grond vielen
export function stepStars(stars, hunters, dt, time) {
  const caught = [];
  const missed = [];
  for (let i = stars.length - 1; i >= 0; i--) {
    const s = stars[i];
    s.y += s.vy * dt;
    s.x += s.vx * dt;
    s.rot += dt * 2;
    let best = null;
    hunters.forEach((h) => {
      if (canCatch(h, s) && (!best || Math.abs(h.x - s.x) < Math.abs(best.x - s.x))) best = h;
    });
    if (best) {
      const points = s.worth * (best.trick ? 2 : 1);
      best.score += points;
      best.lastCatch = time;
      best.glow = 1;
      caught.push({ hunter: best, star: s, points });
      stars.splice(i, 1);
      continue;
    }
    if (s.y > GROUND - 10) {
      missed.push(s);
      stars.splice(i, 1);
    }
  }
  return { caught, missed };
}

export { SPAWN_EVERY };
