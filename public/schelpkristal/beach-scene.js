// Het strand op een zomeravond: lucht met sterren en maan, de zee met golven, het zand,
// palmbomen met lampjes en het strandhuisje met de douche en het kleedhokje. Het vaste
// deel wordt één keer getekend in twee lagen (background: achter de golven en vóór de
// golven), de maan en de golven elk beeld opnieuw (sea).
import { WORLD } from './beach-world.js';

export const H = 540;
export const SHORE = 300; // waar de zee het zand raakt
const PALMS = [470, 900, 1380, 1800, 2280];
export const HUT = { x: 90, w: 300 };
// lampjes die in het donker licht geven (wereld-coördinaten); r = straal van het licht
export const LIGHTS = [{ x: HUT.x + 150, y: 205, r: 150 }];

function lamps(ctx) {
  for (let i = 0; i < PALMS.length - 1; i += 1) {
    const a = PALMS[i] + 30;
    const b = PALMS[i + 1] - 10;
    ctx.strokeStyle = 'rgba(40, 30, 20, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a, 190);
    ctx.quadraticCurveTo((a + b) / 2, 250, b, 190);
    ctx.stroke();
    for (let k = 1; k < 8; k += 1) {
      const t = k / 8;
      const x = (1 - t) * (1 - t) * a + 2 * (1 - t) * t * ((a + b) / 2) + t * t * b;
      const y = (1 - t) * (1 - t) * 190 + 2 * (1 - t) * t * 250 + t * t * 190 + 6;
      ctx.fillStyle = ['#ffd43b', '#ff8ac8', '#7fd8ff', '#9dff8a'][k % 4];
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 6.28);
      ctx.fill();
      LIGHTS.push({ x, y, r: 34 });
    }
  }
}

function palm(ctx, x) {
  ctx.fillStyle = '#5a3b22';
  ctx.beginPath();
  ctx.moveTo(x - 9, 345);
  ctx.quadraticCurveTo(x - 20, 260, x + 10, 170);
  ctx.lineTo(x + 22, 172);
  ctx.quadraticCurveTo(x + 2, 260, x + 9, 345);
  ctx.fill();
  ctx.fillStyle = '#1f5e3a';
  [-2.6, -2, -1.2, -0.5, 0.2].forEach((a) => {
    ctx.save();
    ctx.translate(x + 16, 170);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.ellipse(55, 0, 60, 13, 0.25, 0, 6.28);
    ctx.fill();
    ctx.restore();
  });
}

function hut(ctx) {
  const { x, w } = HUT;
  ctx.fillStyle = '#8a5a3c';
  ctx.fillRect(x, 200, w, 150);
  ctx.fillStyle = '#6b4329';
  for (let i = 0; i < w; i += 22) ctx.fillRect(x + i, 200, 3, 150);
  ctx.fillStyle = '#c2419a';
  ctx.beginPath();
  ctx.moveTo(x - 24, 206);
  ctx.lineTo(x + w / 2, 140);
  ctx.lineTo(x + w + 24, 206);
  ctx.fill();
  [['Douche', x + 30, '#2e8fd8'], ['Kleedhokje', x + 170, '#ff8ac8']].forEach(([label, dx, c]) => {
    ctx.fillStyle = c;
    ctx.fillRect(dx, 240, 100, 110);
    ctx.fillStyle = '#fff';
    ctx.font = '700 17px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, dx + 50, 232);
  });
  ctx.fillStyle = '#fff3a3';
  ctx.beginPath();
  ctx.arc(x + w / 2, 196, 9, 0, 6.28);
  ctx.fill();
}

const layer = () => {
  const c = document.createElement('canvas');
  c.width = WORLD.w;
  c.height = H;
  return c;
};

// het vaste strand, één keer: { back, front }
export function background() {
  const back = layer();
  const front = layer();
  const ctx = back.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, 220);
  sky.addColorStop(0, '#0a0f36');
  sky.addColorStop(1, '#3a2f7a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD.w, 220);
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 220; i += 1) {
    const r = ((i * 7919) % 100) / 100;
    ctx.globalAlpha = 0.4 + r * 0.6;
    ctx.fillRect((i * 1237) % WORLD.w, (i * 389) % 190, 1.5 + r, 1.5 + r);
  }
  ctx.globalAlpha = 1;
  const water = ctx.createLinearGradient(0, 210, 0, SHORE);
  water.addColorStop(0, '#1a2766');
  water.addColorStop(1, '#2f5a94');
  ctx.fillStyle = water;
  ctx.fillRect(0, 210, WORLD.w, SHORE - 200);
  const sand = ctx.createLinearGradient(0, SHORE, 0, H);
  sand.addColorStop(0, '#b8946a');
  sand.addColorStop(1, '#8a6a4a');
  ctx.fillStyle = sand;
  ctx.fillRect(0, SHORE, WORLD.w, H - SHORE);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  for (let i = 0; i < 400; i += 1) ctx.fillRect((i * 613) % WORLD.w, SHORE + 20 + ((i * 271) % 220), 3, 2);
  const fx = front.getContext('2d');
  PALMS.forEach((x) => palm(fx, x));
  lamps(fx);
  hut(fx);
  return { back, front };
}

// de maan, haar weerspiegeling en de golven, elk beeld; cam = linkerkant van het scherm in de wereld
export function sea(ctx, cam, t) {
  const mx = 760 - cam * 0.08;
  ctx.fillStyle = 'rgba(255, 247, 194, 0.18)';
  ctx.beginPath();
  ctx.arc(mx, 80, 60, 0, 6.28);
  ctx.fill();
  ctx.fillStyle = '#fff7c2';
  ctx.beginPath();
  ctx.arc(mx, 80, 38, 0, 6.28);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 247, 194, 0.35)';
  for (let y = 216; y < SHORE; y += 9) ctx.fillRect(mx - 30 + Math.sin(t * 2 + y) * 8, y, 60 - (y - 216) * 0.3, 2);
  ctx.fillStyle = 'rgba(240, 248, 255, 0.85)';
  ctx.beginPath();
  ctx.moveTo(0, SHORE - 8);
  for (let x = 0; x <= 960; x += 20) ctx.lineTo(x, SHORE + 2 + Math.sin((x + cam) / 50 + t * 1.5) * 4 + Math.sin(t * 0.8) * 4);
  ctx.lineTo(960, SHORE - 8);
  ctx.lineTo(0, SHORE - 8);
  ctx.fill();
}
