// Effecten voor de 2D-minigames: een salto (de figuur draait rond met een vaagspoor)
// en opspringende tekstjes zoals "+1" en "Salto!".
import { drawLabel } from './stage2d.js';

// draw() tekent de figuur op zijn gewone plek; (cx, cy) = draaipunt, turn = 0..1
export function drawSpinning(ctx, draw, cx, cy, turn, dir = 1) {
  const angle = turn * Math.PI * 2 * dir;
  [0.3, 0.15].forEach((back, i) => {
    ctx.save();
    ctx.globalAlpha = 0.18 + i * 0.12;
    ctx.translate(cx, cy);
    ctx.rotate(angle - back * dir);
    ctx.translate(-cx, -cy);
    draw();
    ctx.restore();
  });
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.translate(-cx, -cy);
  draw();
  ctx.restore();
}

export function pushPopup(list, text, x, y, color = '#ffd43b') {
  list.push({ text, x, y, color, age: 0, life: 0.9 });
}

export function updatePopups(list, dt) {
  for (let i = list.length - 1; i >= 0; i--) {
    list[i].age += dt;
    if (list[i].age >= list[i].life) list.splice(i, 1);
  }
}

export function drawPopups(ctx, list) {
  list.forEach((p) => {
    ctx.globalAlpha = 1 - p.age / p.life;
    drawLabel(ctx, p.text, p.x, p.y - p.age * 60, 26, p.color);
  });
  ctx.globalAlpha = 1;
}
