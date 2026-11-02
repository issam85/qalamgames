// Springtouw tekenen: schoolplein met rubbervloer, twee Toads die draaien, het touw
// (achter of vóór de springers, afhankelijk van de fase), de springers en de stand.
import { drawSprite } from './sprites.js';
import { W, H, drawLabel } from './stage2d.js';
import { GROUND } from './springtouw-world.js';

const HAND_Y = GROUND - 58;
const LEFT = 152;
const RIGHT = 808;

function yard(ctx) {
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

function turners(ctx, toads) {
  drawSprite(ctx, toads[0], LEFT - 24, GROUND, 96);
  ctx.save();
  ctx.translate(RIGHT + 24, 0);
  ctx.scale(-1, 1);
  drawSprite(ctx, toads[1], 0, GROUND, 96);
  ctx.restore();
}

// het touw hangt tussen de handen; het midden draait rond: laag (fase 0) tot hoog
// over de hoofden (fase 0,5). inFront = het touw is aan de kant van de kijker
export function ropeState(rope) {
  const a = rope.phase * Math.PI * 2;
  const c = Math.cos(a);
  const midY = HAND_Y + (c > 0 ? 62 : 100) * c;
  return { midY, inFront: Math.sin(a) > 0, depth: Math.sin(a) };
}

function ropeLine(ctx, { midY, inFront }) {
  const cy = 2 * midY - HAND_Y;
  ctx.strokeStyle = inFront ? '#fff1d6' : '#d9c7a8';
  ctx.lineWidth = inFront ? 7 : 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(LEFT, HAND_Y);
  ctx.quadraticCurveTo(W / 2, cy, RIGHT, HAND_Y);
  ctx.stroke();
}

function ropeShadow(ctx, { midY }) {
  const k = Math.max(0, 1 - Math.abs(GROUND - midY) / 90);
  if (k <= 0) return;
  ctx.fillStyle = `rgba(0, 0, 0, ${0.25 * k})`;
  ctx.beginPath();
  ctx.ellipse(W / 2, GROUND, 300, 8 + k * 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

function jumper(ctx, j) {
  ctx.globalAlpha = j.out ? 0.55 : 1;
  drawSprite(ctx, j.sprite, j.x, GROUND, 100);
  ctx.globalAlpha = 1;
  const p = j.player;
  const tag = p.control === 'CPU' ? '' : `${p.control.replace('Speler ', 'P')} `;
  drawLabel(ctx, j.out ? 'Uit!' : `${tag}${p.character.name}`, j.x, GROUND - 150, 16, j.out ? '#ff5a3c' : p.control === 'CPU' ? '#fff' : '#ffd43b');
}

function board(ctx, jumpers, rope) {
  drawLabel(ctx, `Sprongen: ${rope.passes}`, W / 2, 44, 28, '#fff');
  jumpers.forEach((j, i) => {
    const x = 20 + i * 190;
    ctx.fillStyle = j.out ? 'rgba(120, 30, 30, 0.5)' : 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.roundRect(x, 64, 172, 34, 10);
    ctx.fill();
    ctx.fillStyle = j.player.character.color;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 20, 81, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    drawLabel(ctx, j.player.character.name, x + 40, 87, 15, j.cpu ? '#fff' : '#ffd43b', 'left');
    drawLabel(ctx, j.out ? `${j.place}e` : '✓', x + 160, 88, 16, j.out ? '#ffb3a7' : '#8cff7a', 'right');
  });
}

export function drawSpringtouw(ctx, game) {
  const rope = ropeState(game.rope);
  yard(ctx);
  ropeShadow(ctx, rope);
  turners(ctx, game.toads);
  if (!rope.inFront) ropeLine(ctx, rope);
  game.jumpers.forEach((j) => jumper(ctx, j));
  if (rope.inFront) ropeLine(ctx, rope);
  board(ctx, game.jumpers, game.rope);
}
