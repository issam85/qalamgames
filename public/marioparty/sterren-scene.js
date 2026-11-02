// Sterrenjacht: de nachthemel met twinkelende sterren en maan, en de grasheuvels.
import { W, H } from './stage2d.js';
import { GROUND } from './sterren-world.js';

export function makeSky() {
  return Array.from({ length: 70 }, () => ({
    x: Math.random() * W, y: Math.random() * (GROUND - 80), r: 0.8 + Math.random() * 1.6, p: Math.random() * 6,
  }));
}

export function sky(ctx, deco, time) {
  const g = ctx.createLinearGradient(0, 0, 0, GROUND);
  g.addColorStop(0, '#070a2e');
  g.addColorStop(1, '#1b2f8a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, GROUND);
  ctx.fillStyle = '#fff';
  deco.forEach((s) => {
    ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(time * 1.5 + s.p));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  // maan met een hap eruit
  ctx.fillStyle = '#fff7c2';
  ctx.beginPath();
  ctx.arc(820, 90, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0a1040';
  ctx.beginPath();
  ctx.arc(836, 78, 32, 0, Math.PI * 2);
  ctx.fill();
}

export function hills(ctx) {
  [['#1d5a2d', 0], ['#2b7a3b', 1]].forEach(([color, k]) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, GROUND);
    for (let x = 0; x <= W; x += 40) {
      ctx.lineTo(x, GROUND - 60 - k * 20 - Math.sin(x / (160 + k * 90) + k) * (40 - k * 10));
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillStyle = '#3c9a46';
  ctx.fillRect(0, GROUND - 6, W, H - GROUND + 6);
}
