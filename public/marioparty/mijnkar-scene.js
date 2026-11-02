// Mijnkar: de grot en de sporen. Elk spoor schuift mee met zijn eigen karretje;
// obstakels en de finish staan op hun afstand langs het spoor.
import { W, H } from './stage2d.js';
import { COURSE_LEN, GAP_W } from './mijnkar-course.js';

export const CART_X = 200;
// de sporen beginnen onder de voortgangsbalk; het karakter steekt ±90 boven de rail uit
export const railY = (lane) => 190 + lane * 95;
const COLORS = ['#5ee7ff', '#8cff7a', '#d08bff', '#6fb6ff'];

export function makeDeco() {
  return Array.from({ length: 28 }, (_, i) => ({
    x: Math.random() * (W + 300), y: Math.random() * H, s: 14 + Math.random() * 30,
    c: COLORS[i % COLORS.length], a: 0.2 + Math.random() * 0.3,
  }));
}

function crystal(ctx, x, y, s, color, alpha = 1) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - s * 1.6);
  ctx.lineTo(x + s * 0.5, y);
  ctx.lineTo(x + s * 0.25, y + s * 0.5);
  ctx.lineTo(x - s * 0.25, y + s * 0.5);
  ctx.lineTo(x - s * 0.5, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.moveTo(x, y - s * 1.6);
  ctx.lineTo(x + s * 0.18, y - s * 0.2);
  ctx.lineTo(x - s * 0.1, y);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

export function background(ctx, deco, scroll) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#242a6a');
  g.addColorStop(1, '#0b1030');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  deco.forEach((c) => {
    const x = ((c.x - scroll * 0.25) % (W + 300) + W + 300) % (W + 300) - 150;
    crystal(ctx, x, c.y, c.s, c.c, c.a);
  });
}

function obstacle(ctx, ob, x, y) {
  if (ob.type === 'gap') {
    ctx.fillStyle = '#07091c';
    ctx.fillRect(x - GAP_W / 2, y - 8, GAP_W, 18);
    ctx.fillRect(x - GAP_W / 2 + 8, y + 10, GAP_W - 16, 26);
  } else if (ob.type === 'rock') {
    ctx.fillStyle = '#7d838f';
    ctx.beginPath();
    ctx.arc(x - 4, y - 16, 17, 0, Math.PI * 2);
    ctx.arc(x + 12, y - 11, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a7adb8';
    ctx.beginPath();
    ctx.arc(x - 9, y - 22, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    crystal(ctx, x - 12, y - 4, 17, '#5ee7ff');
    crystal(ctx, x + 6, y - 6, 26, '#8cff7a');
    crystal(ctx, x + 20, y - 2, 14, '#d08bff');
  }
}

export function finishPost(ctx, x, y) {
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(x - 4, y - 92, 8, 92);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      ctx.fillStyle = (r + c) % 2 ? '#222' : '#fff';
      ctx.fillRect(x + 4 + c * 9, y - 92 + r * 9, 9, 9);
    }
  }
}

// één spoor: rails en planken schuiven met het karretje mee, obstakels op hun afstand
export function lane(ctx, cart, course, i) {
  const y = railY(i);
  ctx.fillStyle = i % 2 ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.14)';
  ctx.fillRect(0, y - 92, W, 100);
  ctx.fillStyle = '#8d5a32';
  for (let px = -(cart.d % 48); px < W; px += 48) ctx.fillRect(px, y - 7, 11, 16);
  ctx.fillStyle = '#4a2f16';
  ctx.fillRect(0, y - 3, W, 4);
  ctx.fillRect(0, y + 5, W, 3);
  const sx = (d) => CART_X + (d - cart.d);
  course.forEach((ob) => {
    const x = sx(ob.d);
    if (x > -80 && x < W + 80) obstacle(ctx, ob, x, y);
  });
  const fx = sx(COURSE_LEN);
  if (fx > -60 && fx < W + 60) finishPost(ctx, fx, y);
}
