// Sterrenjacht tekenen: de vallende sterren met een staart, de karakters met een
// lichtkring (springend, met salto, duwend of duizelig), popups en de scores.
// Hemel en heuvels: sterren-scene.js.
import { drawSprite } from './sprites.js';
import { W, drawLabel } from './stage2d.js';
import { drawSpinning, drawPopups } from './fx2d.js';
import { GROUND, JUMP_T } from './sterren-world.js';
import { sky, hills } from './sterren-scene.js';

export { makeSky } from './sterren-scene.js';

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
  const feet = GROUND - h.lift;
  // lichtkring: het is donker, maar om jou heen is het licht
  const g = ctx.createRadialGradient(h.x, feet - 50, 10, h.x, feet - 50, 120 + h.glow * 40);
  g.addColorStop(0, `rgba(255, 240, 180, ${0.22 + h.glow * 0.3})`);
  g.addColorStop(1, 'rgba(255, 240, 180, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(h.x - 170, feet - 220, 340, 230);
  if (h.lift > 2) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(h.x, GROUND - 2, 30 - h.lift * 0.1, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // bij een duw schiet de figuur even naar voren
  const lunge = h.shove > 0 ? h.facing * Math.sin(h.shove * Math.PI * 4) * 14 : 0;
  const draw = () => {
    ctx.save();
    ctx.translate(h.x + lunge, feet);
    ctx.scale(h.facing, 1);
    drawSprite(ctx, h.sprite, 0, 0, 100, h.lift <= 2);
    ctx.restore();
  };
  const turn = h.trick ? Math.max(0, Math.min(1, (h.jumpT - 0.05) / (JUMP_T - 0.15))) : 0;
  if (turn > 0 && turn < 1) drawSpinning(ctx, draw, h.x, feet - 55, turn, h.facing);
  else draw();
  // duizelig: sterretjes draaien om het hoofd
  if (h.daze > 0) {
    for (let i = 0; i < 3; i++) {
      const a = h.daze * 9 + (i * Math.PI * 2) / 3;
      star(ctx, h.x + Math.cos(a) * 26, feet - 105 + Math.sin(a) * 7, 7, a, '#ffd43b');
    }
  }
  const p = h.player;
  const tag = p.control === 'CPU' ? '' : `${p.control.replace('Speler ', 'P')} `;
  drawLabel(ctx, `${tag}${p.character.name}`, h.x, feet - 124, 15, p.control === 'CPU' ? '#fff' : '#ffd43b');
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
  drawPopups(ctx, game.popups);
  scores(ctx, game.hunters, game.left);
}
