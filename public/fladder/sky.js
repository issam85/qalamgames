// Lucht per moment van de dag (avond, nacht, ochtend), sterren en wolken.

export const PALETTES = [
  { name: 'avond', sky: ['#4b3a9a', '#e8708a', '#ffb65c'], far: '#6a4a86', near: '#4a2f62', night: 0.25, sun: '#ffd66b' },
  { name: 'nacht', sky: ['#070f33', '#16255e', '#33488f'], far: '#1d2a5c', near: '#0e1636', night: 1, sun: '#fff6d8' },
  { name: 'ochtend', sky: ['#5fb6f5', '#a5dbff', '#ffe2a6'], far: '#8fb0d6', near: '#5f7fae', night: 0, sun: '#fff1a8' },
];

const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

function mixHex(a, b, t) {
  const [x, y] = [hex(a), hex(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(',')})`;
}

// Mengt twee paletten (t = 0 → a, t = 1 → b).
export function mixPalette(a, b, t) {
  return {
    sky: a.sky.map((c, i) => mixHex(c, b.sky[i], t)),
    far: mixHex(a.far, b.far, t),
    near: mixHex(a.near, b.near, t),
    sun: mixHex(a.sun, b.sun, t),
    night: a.night + (b.night - a.night) * t,
  };
}

// Vaste sterren en wolken, overal hetzelfde.
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 157.3) % 1, y: ((i * 73.9) % 1) * 0.62, r: 0.8 + ((i * 31) % 10) / 8, tw: i * 1.7,
}));
const CLOUDS = Array.from({ length: 6 }, (_, i) => ({ x: i * 230 + 40, y: 50 + ((i * 97) % 160), s: 0.7 + (i % 3) * 0.25 }));

export function drawSky(ctx, w, h, pal, time, dist) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, pal.sky[0]);
  g.addColorStop(0.55, pal.sky[1]);
  g.addColorStop(1, pal.sky[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  if (pal.night > 0.05) {
    ctx.fillStyle = '#fff';
    for (const s of STARS) {
      ctx.globalAlpha = pal.night * (0.55 + 0.45 * Math.sin(time * 2 + s.tw));
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  drawSun(ctx, w, h, pal);
  drawClouds(ctx, w, pal, dist);
}

// Zon of maan rechtsboven, met een zachte gloed.
function drawSun(ctx, w, h, pal) {
  const x = w * 0.78;
  const y = h * (0.2 + 0.18 * (1 - pal.night));
  const glow = ctx.createRadialGradient(x, y, 10, x, y, 90);
  glow.addColorStop(0, pal.sun);
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = glow;
  ctx.fillRect(x - 90, y - 90, 180, 180);
  ctx.globalAlpha = 1;
  ctx.fillStyle = pal.sun;
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, Math.PI * 2);
  ctx.fill();
  if (pal.night > 0.5) {
    ctx.fillStyle = pal.sky[0];
    ctx.globalAlpha = pal.night;
    ctx.beginPath();
    ctx.arc(x + 13, y - 8, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawClouds(ctx, w, pal, dist) {
  const span = CLOUDS.length * 230;
  ctx.fillStyle = '#fff';
  ctx.globalAlpha = 0.75 - pal.night * 0.55;
  for (const c of CLOUDS) {
    let x = (c.x - dist * 0.08) % span;
    if (x < -150) x += span;
    if (x > w + 150) continue;
    for (const [dx, dy, r] of [[0, 0, 26], [28, -10, 30], [58, 0, 24], [30, 8, 24]]) {
      ctx.beginPath();
      ctx.arc(x + dx * c.s, c.y + dy * c.s, r * c.s, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
