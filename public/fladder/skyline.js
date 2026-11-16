// Gouda in de verte: grachtenhuizen, het stadhuis, een molen en de straat.

const PERIOD = 960;
const HOUSES = [[0, 46, 70], [50, 38, 90], [92, 52, 64], [148, 40, 84], [192, 56, 72],
  [252, 42, 96], [298, 50, 66], [520, 44, 78], [568, 54, 92], [626, 40, 70], [670, 48, 86],
  [722, 58, 68], [784, 42, 80], [830, 50, 94], [884, 46, 72]];

function repeat(w, dist, factor, draw) {
  const off = -((dist * factor) % PERIOD);
  for (let x = off; x < w + PERIOD; x += PERIOD) draw(x);
}

// Een grachtenhuis met trapgevel.
function house(ctx, x, base, wd, ht) {
  const s = wd / 6;
  ctx.beginPath();
  ctx.moveTo(x, base);
  ctx.lineTo(x, base - ht);
  ctx.lineTo(x + s, base - ht);
  ctx.lineTo(x + s, base - ht - s);
  ctx.lineTo(x + 2 * s, base - ht - s);
  ctx.lineTo(x + 2 * s, base - ht - 2 * s);
  ctx.lineTo(x + 4 * s, base - ht - 2 * s);
  ctx.lineTo(x + 4 * s, base - ht - s);
  ctx.lineTo(x + 5 * s, base - ht - s);
  ctx.lineTo(x + 5 * s, base - ht);
  ctx.lineTo(x + wd, base - ht);
  ctx.lineTo(x + wd, base);
  ctx.fill();
}

function windows(ctx, x, base, wd, ht, night) {
  if (night < 0.2) return;
  ctx.fillStyle = `rgba(255, 214, 102, ${night * 0.9})`;
  for (let r = 1; r * 22 < ht - 6; r++) {
    for (let c = 0; c < 2; c++) ctx.fillRect(x + wd * (0.22 + c * 0.38), base - r * 22, wd * 0.18, 11);
  }
}

// Het gotische stadhuis met torentjes.
function stadhuis(ctx, x, base, night, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, base - 80, 130, 80);
  ctx.beginPath();
  ctx.moveTo(x + 6, base - 80);
  ctx.lineTo(x + 65, base - 158);
  ctx.lineTo(x + 124, base - 80);
  ctx.fill();
  for (const [tx, top] of [[0, 128], [118, 128], [32, 150], [86, 150], [61, 196]]) {
    ctx.fillRect(x + tx, base - top + 22, 8, top - 22);
    ctx.beginPath();
    ctx.moveTo(x + tx - 2, base - top + 22);
    ctx.lineTo(x + tx + 4, base - top);
    ctx.lineTo(x + tx + 10, base - top + 22);
    ctx.fill();
  }
  if (night < 0.2) return;
  ctx.fillStyle = `rgba(255, 214, 102, ${night})`;
  for (let i = 0; i < 6; i++) ctx.fillRect(x + 14 + i * 19, base - 66, 8, 22);
  for (let i = 0; i < 6; i++) ctx.fillRect(x + 14 + i * 19, base - 34, 8, 20);
}

// Een molen met draaiende wieken.
function molen(ctx, x, base, time, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 24, base);
  ctx.lineTo(x - 13, base - 96);
  ctx.lineTo(x + 13, base - 96);
  ctx.lineTo(x + 24, base);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, base - 98, 15, Math.PI, 0);
  ctx.fill();
  ctx.save();
  ctx.translate(x, base - 100);
  ctx.rotate(time * 0.8);
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.fillRect(-2, 0, 4, 78);
    ctx.fillRect(2, 18, 13, 58);
  }
  ctx.restore();
}

export function drawSkyline(ctx, w, ground, pal, time, dist) {
  repeat(w, dist, 0.15, (ox) => {
    ctx.fillStyle = pal.far;
    for (const [hx, wd, ht] of HOUSES) house(ctx, ox + hx * 1.1 - 30, ground - 40, wd, ht + 30);
  });
  repeat(w, dist, 0.32, (ox) => {
    stadhuis(ctx, ox + 360, ground, pal.night, pal.near);
    molen(ctx, ox + 800, ground, time, pal.near);
    for (const [hx, wd, ht] of HOUSES.slice(0, 7)) {
      ctx.fillStyle = pal.near;
      house(ctx, ox + 520 + hx * 0.7, ground, wd * 0.8, ht * 0.75);
      windows(ctx, ox + 520 + hx * 0.7, ground, wd * 0.8, ht * 0.75, pal.night);
    }
  });
}

// De straat: gras, klinkers die meeschuiven.
export function drawGround(ctx, w, h, ground, dist, night) {
  ctx.fillStyle = '#b5654a';
  ctx.fillRect(0, ground, w, h - ground);
  ctx.fillStyle = '#5cae4a';
  ctx.fillRect(0, ground, w, 9);
  ctx.fillStyle = '#3f8a35';
  ctx.fillRect(0, ground + 9, w, 3);
  ctx.strokeStyle = '#8c4a36';
  ctx.lineWidth = 2;
  const off = -(dist % 36);
  for (let row = 0; ground + 12 + row * 14 < h; row++) {
    const y = ground + 12 + row * 14;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    for (let x = off + (row % 2) * 18; x < w; x += 36) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 14);
    }
    ctx.stroke();
  }
  if (night > 0) {
    ctx.fillStyle = `rgba(10, 15, 50, ${night * 0.45})`;
    ctx.fillRect(0, ground, w, h - ground);
  }
}
