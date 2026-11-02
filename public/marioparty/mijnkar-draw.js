// Mijnkar tekenen: grot en sporen (mijnkar-scene.js), karretjes met het karakter
// erin, vonken en de voortgangsbalk bovenin.
import { drawSprite } from './sprites.js';
import { drawLabel } from './stage2d.js';
import { COURSE_LEN } from './mijnkar-course.js';
import { CART_X, railY, background, lane, finishPost } from './mijnkar-scene.js';

export { CART_X, railY, makeDeco } from './mijnkar-scene.js';

function wheel(ctx, x, y, angle) {
  ctx.fillStyle = '#2b2b2b';
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#9a9a9a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let k = 0; k < 2; k++) {
    const a = angle + k * Math.PI / 2;
    ctx.moveTo(x - Math.cos(a) * 7, y - Math.sin(a) * 7);
    ctx.lineTo(x + Math.cos(a) * 7, y + Math.sin(a) * 7);
  }
  ctx.stroke();
}

function cartBody(ctx, bx, top, bottom, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(bx - 40, top);
  ctx.lineTo(bx + 40, top);
  ctx.lineTo(bx + 33, bottom);
  ctx.lineTo(bx - 33, bottom);
  ctx.closePath();
  ctx.fill();
}

function drawCart(ctx, cart) {
  const ground = railY(cart.lane);
  const y = ground - cart.lift;
  const bx = CART_X + (cart.hit > 0 ? (Math.random() - 0.5) * 6 * cart.hit : 0);
  const top = y - 52;
  if (cart.lift > 2) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(CART_X, ground - 4, 36 - cart.lift * 0.12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  wheel(ctx, bx - 24, y - 9, cart.d / 9);
  wheel(ctx, bx + 24, y - 9, cart.d / 9);
  // het karakter zit in het karretje: de voorkant verbergt de benen
  drawSprite(ctx, cart.sprite, bx, top + 30, 72, false);
  cartBody(ctx, bx, top, y - 14, '#8d5a32');
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  [top + 12, top + 25].forEach((ly) => ctx.fillRect(bx - 37, ly, 74, 3));
  // naam links van het spoor, zodat hij niet over het spoor erboven valt
  const p = cart.player;
  const tag = p.control === 'CPU' ? '' : `${p.control.replace('Speler ', 'P')} `;
  drawLabel(ctx, `${tag}${p.character.name}`, CART_X - 56, ground - 24, 16, p.control === 'CPU' ? '#fff' : '#ffd43b', 'right');
  if (cart.stun > 0) drawLabel(ctx, 'Au!', bx + 62, top + 4, 24, '#ff5a3c');
}

function sparks(ctx, list) {
  ctx.fillStyle = '#ffb347';
  list.forEach((s) => {
    ctx.globalAlpha = 1 - s.age / s.life;
    ctx.fillRect(s.x - 2, s.y - 2, 4, 4);
  });
  ctx.globalAlpha = 1;
}

// voortgang van alle karretjes op één balk, met de klok rechts
function progress(ctx, carts, clock) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.roundRect(250, 27, 460, 10, 5);
  ctx.fill();
  finishPost(ctx, 712, 44);
  // de koploper bovenop
  [...carts].sort((a, b) => a.d - b.d).forEach((c) => {
    const x = 250 + 460 * Math.min(1, c.d / COURSE_LEN);
    ctx.fillStyle = c.player.character.color;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, 32, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    drawLabel(ctx, c.player.character.name[0], x, 37, 13, '#fff');
  });
  drawLabel(ctx, clock.toFixed(1), 930, 44, 26, '#ffd43b', 'right');
}

export function drawMijnkar(ctx, game) {
  const avg = game.carts.reduce((s, c) => s + c.d, 0) / game.carts.length;
  background(ctx, game.deco, avg);
  game.carts.forEach((c, i) => lane(ctx, c, game.course, i));
  game.carts.forEach((c) => drawCart(ctx, c));
  sparks(ctx, game.sparks);
  progress(ctx, game.carts, game.clock);
}
