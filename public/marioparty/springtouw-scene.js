// Springtouw: het schoolplein (lucht, bomen, glijbaan, rubbervloer) en de twee
// Toads die het touw draaien.
import { drawSprite } from './sprites.js';
import { W, H } from './stage2d.js';
import { GROUND } from './springtouw-world.js';

export const HAND_Y = GROUND - 58;
export const LEFT = 152;
export const RIGHT = 808;

export function yard(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, GROUND);
  g.addColorStop(0, '#4fb3f5');
  g.addColorStop(1, '#cdeeff');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, GROUND);
  ctx.fillStyle = '#ffe36b';
  ctx.beginPath();
  ctx.arc(860, 80, 42, 0, Math.PI * 2);
  ctx.fill();
  // bomen en een glijbaan op de achtergrond
  [[70, 1], [250, 0.8], [700, 0.9], [900, 1.1]].forEach(([x, s]) => {
    ctx.fillStyle = '#8d5a32';
    ctx.fillRect(x - 7 * s, GROUND - 90 * s, 14 * s, 90 * s);
    ctx.fillStyle = '#43a047';
    ctx.beginPath();
    ctx.arc(x, GROUND - 120 * s, 48 * s, 0, Math.PI * 2);
    ctx.arc(x - 30 * s, GROUND - 95 * s, 34 * s, 0, Math.PI * 2);
    ctx.arc(x + 30 * s, GROUND - 95 * s, 34 * s, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = '#1e88e5';
  ctx.beginPath();
  ctx.moveTo(470, GROUND - 120);
  ctx.lineTo(500, GROUND - 120);
  ctx.lineTo(600, GROUND - 10);
  ctx.lineTo(570, GROUND - 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd43b';
  ctx.fillRect(455, GROUND - 125, 18, 125);
  ctx.fillStyle = '#b23a3a';
  ctx.fillRect(0, GROUND - 4, W, H - GROUND + 4);
  ctx.fillStyle = '#c94b4b';
  ctx.fillRect(0, GROUND - 4, W, 8);
}

export function turners(ctx, toads) {
  drawSprite(ctx, toads[0], LEFT - 24, GROUND, 96);
  ctx.save();
  ctx.translate(RIGHT + 24, 0);
  ctx.scale(-1, 1);
  drawSprite(ctx, toads[1], 0, GROUND, 96);
  ctx.restore();
}
