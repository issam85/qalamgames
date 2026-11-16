// Kaastorens: opgestapelde Goudse kazen (geel met een rode korst), van boven en van onder.
import { TOWER } from './config.js';

const WHEEL = 34;
const W = TOWER.width;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function jitter(seed, i) {
  const v = Math.sin(seed * 999 + i * 12.9898) * 43758.5;
  return (v - Math.floor(v) - 0.5) * 7;
}

// Eén kaas van opzij: goudgeel met een rode rand boven en onder, soms een stempel.
function wheel(ctx, cx, y, i, seed, night) {
  const x = cx - W / 2 + jitter(seed, i);
  const g = ctx.createLinearGradient(0, y, 0, y + WHEEL);
  g.addColorStop(0, '#ffe27a');
  g.addColorStop(0.5, '#f6b821');
  g.addColorStop(1, '#d48a0c');
  roundRect(ctx, x, y, W, WHEEL, 13);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#d7362c';
  ctx.fillRect(x, y, W, 6);
  ctx.fillRect(x, y + WHEEL - 6, W, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillRect(x + 10, y + 9, W * 0.45, 3);
  ctx.restore();
  ctx.strokeStyle = '#9a4f08';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, W, WHEEL, 13);
  ctx.stroke();
  if (i % 3 === 1) stamp(ctx, x + W * 0.68, y + WHEEL / 2);
  if (night > 0) {
    ctx.fillStyle = `rgba(10, 15, 50, ${night * 0.35})`;
    roundRect(ctx, x, y, W, WHEEL, 13);
    ctx.fill();
  }
}

function stamp(ctx, x, y) {
  ctx.fillStyle = '#fff6d6';
  ctx.strokeStyle = '#c62828';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, 10, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

// De kaas bij de opening is aangesneden: je ziet de gaatjes.
function cap(ctx, cx, y, night) {
  const x = cx - W / 2 - 7;
  const w = W + 14;
  roundRect(ctx, x, y, w, WHEEL, 12);
  const g = ctx.createLinearGradient(0, y, 0, y + WHEEL);
  g.addColorStop(0, '#fff2a8');
  g.addColorStop(1, '#ffd34d');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = '#d7362c';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#e8b53a';
  for (const [dx, dy, r] of [[0.18, 0.4, 5], [0.42, 0.65, 4], [0.62, 0.35, 6], [0.85, 0.62, 4]]) {
    ctx.beginPath();
    ctx.ellipse(x + w * dx, y + WHEEL * dy, r, r * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (night > 0) {
    ctx.fillStyle = `rgba(10, 15, 50, ${night * 0.3})`;
    roundRect(ctx, x, y, w, WHEEL, 12);
    ctx.fill();
  }
}

export function drawTower(ctx, t, ground, night) {
  let i = 0;
  for (let y = t.top - WHEEL * 2; y > -WHEEL; y -= WHEEL) wheel(ctx, t.x, y, i++, t.seed, night);
  cap(ctx, t.x, t.top - WHEEL, night);
  i = 0;
  for (let y = t.bottom + WHEEL; y < ground; y += WHEEL) wheel(ctx, t.x, y, i++, t.seed + 1, night);
  cap(ctx, t.x, t.bottom, night);
}
