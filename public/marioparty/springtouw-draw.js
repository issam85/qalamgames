// Springtouw tekenen: het touw (achter of vóór de springers, afhankelijk van de fase),
// de aanwijzing, de springers (met salto) en de stand. Plein en Toads: springtouw-scene.js.
import { drawSprite } from './sprites.js';
import { W, drawLabel } from './stage2d.js';
import { drawSpinning, drawPopups } from './fx2d.js';
import { GROUND, duration, cueStrength } from './springtouw-world.js';
import { yard, turners, HAND_Y, LEFT, RIGHT } from './springtouw-scene.js';

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

// aanwijzing wanneer je moet springen: gloed op de vloer en "SPRING!"
function cue(ctx, rope) {
  const k = cueStrength(rope);
  if (k <= 0) return;
  ctx.fillStyle = `rgba(255, 212, 59, ${0.35 * k})`;
  ctx.beginPath();
  ctx.ellipse(W / 2, GROUND, 260, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = k;
  drawLabel(ctx, 'SPRING!', W / 2, 200, 52, '#ffd43b');
  ctx.globalAlpha = 1;
}

function hearts(ctx, j, x, y) {
  for (let i = 0; i < 2; i++) {
    drawLabel(ctx, '♥', x + i * 16, y, 15, i < j.lives ? '#ff5a3c' : 'rgba(255, 255, 255, 0.3)', 'left');
  }
}

// in de lucht komt de figuur iets naar voren (groter); bij een salto draait hij rond
function jumper(ctx, j) {
  ctx.globalAlpha = j.out ? 0.55 : 1;
  const k = j.jumpT < 0 ? 0 : Math.sin(Math.PI * Math.min(1, j.jumpT / duration(j)));
  const lift = j.trick ? k * 55 : 0;
  const draw = () => {
    ctx.save();
    ctx.translate(j.x, GROUND - lift);
    ctx.scale(1 + k * 0.1, 1 + k * 0.1);
    drawSprite(ctx, j.sprite, 0, 0, 100, !j.trick);
    ctx.restore();
  };
  const turn = j.trick ? Math.max(0, Math.min(1, (j.jumpT - 0.1) / (duration(j) - 0.22))) : 0;
  if (turn > 0 && turn < 1) drawSpinning(ctx, draw, j.x, GROUND - lift - 60, turn);
  else draw();
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
    if (!j.out) hearts(ctx, j, x + 104, 88);
    const right = j.out ? `${j.place}e` : j.style > 0 ? `${j.style}×🌀` : '';
    drawLabel(ctx, right, x + 162, 88, 15, j.out ? '#ffb3a7' : '#ffd43b', 'right');
  });
}

export function drawSpringtouw(ctx, game) {
  const rope = ropeState(game.rope);
  yard(ctx);
  cue(ctx, game.rope);
  ropeShadow(ctx, rope);
  turners(ctx, game.toads);
  if (!rope.inFront) ropeLine(ctx, rope);
  game.jumpers.forEach((j) => jumper(ctx, j));
  if (rope.inFront) ropeLine(ctx, rope);
  drawPopups(ctx, game.popups);
  board(ctx, game.jumpers, game.rope);
}
