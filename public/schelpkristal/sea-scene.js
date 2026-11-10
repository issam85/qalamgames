// De zee 's avonds: boven de lucht met de maan, daaronder het water dat dieper
// donkerder wordt, lichtstralen van de maan, zeewier en stenen op de bodem (één keer
// getekend: seaBackground), en elk beeld de golven en de vissen. Oesters en belletjes:
// sea-oysters.js.
import { SEA } from './sea-world.js';

const H = 540;

function weed(ctx, x, h, c) {
  ctx.strokeStyle = c;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, SEA.bed + 30);
  for (let y = 0; y < h; y += 14) ctx.lineTo(x + Math.sin(y / 14) * 7, SEA.bed + 30 - y);
  ctx.stroke();
}

export function seaBackground() {
  const c = document.createElement('canvas');
  c.width = SEA.w;
  c.height = H;
  const ctx = c.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, SEA.surface);
  sky.addColorStop(0, '#0a0f36');
  sky.addColorStop(1, '#3a2f7a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SEA.w, SEA.surface);
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 160; i += 1) ctx.fillRect((i * 1237) % SEA.w, (i * 389) % (SEA.surface - 20), 1.5, 1.5);
  const water = ctx.createLinearGradient(0, SEA.surface, 0, H);
  water.addColorStop(0, '#2f6fb0');
  water.addColorStop(0.5, '#1a3f7a');
  water.addColorStop(1, '#0b1c3f');
  ctx.fillStyle = water;
  ctx.fillRect(0, SEA.surface, SEA.w, H - SEA.surface);
  ctx.fillStyle = 'rgba(255, 247, 194, 0.06)';
  for (let x = 100; x < SEA.w; x += 420) {
    ctx.beginPath();
    ctx.moveTo(x, SEA.surface);
    ctx.lineTo(x + 60, SEA.surface);
    ctx.lineTo(x + 180, H);
    ctx.lineTo(x + 40, H);
    ctx.fill();
  }
  ctx.fillStyle = '#c9a77a';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= SEA.w; x += 40) ctx.lineTo(x, SEA.bed + 10 + Math.sin(x / 130) * 8);
  ctx.lineTo(SEA.w, H);
  ctx.fill();
  for (let x = 140; x < SEA.w; x += 230) {
    weed(ctx, x, 90 + (x % 70), '#2f8f5a');
    weed(ctx, x + 22, 60 + (x % 50), '#3fae6a');
    ctx.fillStyle = '#6d6a80';
    ctx.beginPath();
    ctx.ellipse(x + 110, SEA.bed + 20, 26, 14, 0, Math.PI, 0);
    ctx.fill();
  }
  return c;
}

// de maan, haar weerspiegeling en de golven aan het oppervlak
export function surface(ctx, cam, t) {
  const mx = 780 - cam * 0.08;
  ctx.fillStyle = 'rgba(255, 247, 194, 0.2)';
  ctx.beginPath();
  ctx.arc(mx, 70, 56, 0, 6.28);
  ctx.fill();
  ctx.fillStyle = '#fff7c2';
  ctx.beginPath();
  ctx.arc(mx, 70, 36, 0, 6.28);
  ctx.fill();
  ctx.fillStyle = 'rgba(240, 248, 255, 0.75)';
  ctx.beginPath();
  ctx.moveTo(0, SEA.surface - 6);
  for (let x = 0; x <= 960; x += 16) ctx.lineTo(x, SEA.surface + Math.sin((x + cam) / 40 + t * 2) * 4);
  ctx.lineTo(960, SEA.surface + 6);
  ctx.lineTo(0, SEA.surface + 6);
  ctx.fill();
}

// vissen die heen en weer zwemmen (alleen voor de sier)
export function fish(ctx, cam, t) {
  [['#ffb347', 260, 0.6], ['#ff8ac8', 330, 0.45], ['#7fd8ff', 400, 0.7], ['#ffd43b', 300, 0.5]].forEach(([c, y, v], i) => {
    const span = SEA.w;
    const pos = (t * 60 * v + i * 600) % (span * 2);
    const dir = pos < span ? 1 : -1;
    const x = (pos < span ? pos : span * 2 - pos) - cam;
    if (x < -40 || x > 1000) return;
    const yy = y + Math.sin(t * 2 + i) * 10;
    ctx.save();
    ctx.translate(x, yy);
    ctx.scale(dir, 1);
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 10, 0, 0, 6.28);
    ctx.moveTo(-14, 0);
    ctx.lineTo(-28, -10);
    ctx.lineTo(-28, 10);
    ctx.fill();
    ctx.fillStyle = '#1d1016';
    ctx.beginPath();
    ctx.arc(9, -2, 2.2, 0, 6.28);
    ctx.fill();
    ctx.restore();
  });
}
