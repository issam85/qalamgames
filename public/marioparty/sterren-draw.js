// Sterrenjacht tekenen: sterrenhemel met maan, heuvels, de vallende sterren met een
// staart, de karakters met een lichtkring, puntjes die opstijgen en de scores.
import { drawSprite } from './sprites.js';
import { W, H, drawLabel } from './stage2d.js';
import { GROUND } from './sterren-world.js';

export function makeSky() {
  return Array.from({ length: 70 }, () => ({
    x: Math.random() * W, y: Math.random() * (GROUND - 80), r: 0.8 + Math.random() * 1.6, p: Math.random() * 6,
  }));
}

function star(ctx, x, y, r, rot, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function sky(ctx, deco, time) {
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

function hills(ctx) {
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

function fallingStars(ctx, stars) {
  stars.forEach((s) => {
    const g = ctx.createLinearGradient(s.x - s.vx * 0.5, s.y - s.vy * 0.5, s.x, s.y);
    g.addColorStop(0, 'rgba(255, 230, 120, 0)');
    g.addColorStop(1, 'rgba(255, 230, 120, 0.55)');
    ctx.strokeStyle = g;
    ctx.lineWidth = s.r * 0.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(s.x - s.vx * 0.5, s.y - s.vy * 0.5);
    ctx.lineTo(s.x, s.y);
    ctx.stroke();
    star(ctx, s.x, s.y, s.r, s.rot, s.worth > 1 ? '#ffb100' : '#ffd43b');
  });
}

function hunter(ctx, h) {
  // lichtkring: het is donker, maar om jou heen is het licht
  const g = ctx.createRadialGradient(h.x, GROUND - 50, 10, h.x, GROUND - 50, 120 + h.glow * 40);
  g.addColorStop(0, `rgba(255, 240, 180, ${0.22 + h.glow * 0.3})`);
  g.addColorStop(1, 'rgba(255, 240, 180, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(h.x - 170, GROUND - 220, 340, 230);
  ctx.save();
  ctx.translate(h.x, 0);
  ctx.scale(h.facing, 1);
  drawSprite(ctx, h.sprite, 0, GROUND, 100);
  ctx.restore();
  const p = h.player;
  const tag = p.control === 'CPU' ? '' : `${p.control.replace('Speler ', 'P')} `;
  drawLabel(ctx, `${tag}${p.character.name}`, h.x, GROUND - 118, 15, p.control === 'CPU' ? '#fff' : '#ffd43b');
}

function popups(ctx, list) {
  list.forEach((p) => {
    ctx.globalAlpha = 1 - p.age / p.life;
    drawLabel(ctx, p.text, p.x, p.y - p.age * 60, 26, '#ffd43b');
  });
  ctx.globalAlpha = 1;
}

function scores(ctx, hunters, left) {
  hunters.forEach((h, i) => {
    const x = 20 + i * 190;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(x, 14, 172, 40, 12);
    ctx.fill();
    ctx.fillStyle = h.player.character.color;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 22, 34, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    drawLabel(ctx, h.player.character.name, x + 44, 40, 16, h.cpu ? '#fff' : '#ffd43b', 'left');
    star(ctx, x + 134, 33, 10, 0, '#ffd43b');
    drawLabel(ctx, String(h.score), x + 162, 41, 20, '#fff', 'right');
  });
  drawLabel(ctx, `${Math.ceil(left)}`, W / 2, 96, 34, left <= 5 ? '#ff5a3c' : '#fff');
}

export function drawSterren(ctx, game) {
  sky(ctx, game.sky, game.time);
  hills(ctx);
  [...game.hunters].sort((a, b) => a.x - b.x).forEach((h) => hunter(ctx, h));
  fallingStars(ctx, game.stars);
  popups(ctx, game.popups);
  scores(ctx, game.hunters, game.left);
}
