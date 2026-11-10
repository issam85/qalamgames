// Tekenen op het strand: schelpen en kristallen in het zand, het donker met het licht
// van de lantaarn en de lampjes, het glinsteren, de prinses en wat je opraapt.
import { LIGHTS, H } from './beach-scene.js';
import { shell, crystal, sparkle } from './beach-items.js';

const S = 0.44; // de prinses (vak 300 × 520) op het strand
const LANTERN = 190; // straal van het licht van de lantaarn

// de schelpen en kristallen die er nog liggen, half in het zand; front = alleen wat
// vóór de prinses ligt (lager in beeld), anders alleen wat erachter ligt
export function drawItems(ctx, walk, cam, front) {
  walk.items.filter((it) => !it.got && (it.y > walk.y) === front).forEach((it) => {
    ctx.save();
    ctx.translate(it.x - cam, it.y);
    (it.kind === 'shell' ? shell : crystal)(ctx, it);
    ctx.fillStyle = '#a6825a';
    ctx.beginPath();
    ctx.ellipse(0, 4, 20, 6, 0, 0, 6.28);
    ctx.fill();
    ctx.restore();
  });
}

// Het donker, met gaten waar licht is. Daarna het glinsteren: ook in het donker zie
// je af en toe een schelp of kristal oplichten.
// friends = de vrienden; hun lantaarns geven ook licht
export function drawDark(ctx, dark, walk, cam, friends = []) {
  const d = dark.getContext('2d');
  d.globalCompositeOperation = 'source-over';
  d.clearRect(0, 0, 960, H);
  const night = d.createLinearGradient(0, 0, 0, H);
  night.addColorStop(0, 'rgba(3, 5, 25, 0.25)');
  night.addColorStop(0.5, 'rgba(3, 5, 25, 0.75)');
  night.addColorStop(1, 'rgba(3, 5, 25, 0.9)');
  d.fillStyle = night;
  d.fillRect(0, 0, 960, H);
  d.globalCompositeOperation = 'destination-out';
  const flicker = 1 + Math.sin(walk.time * 9) * 0.02;
  const lantern = (w, r) => ({ x: w.x + w.face * 26, y: w.y - 66, r });
  const lights = [lantern(walk, LANTERN * flicker), ...friends.map((f) => lantern(f, LANTERN * 0.7)), ...LIGHTS];
  lights.forEach(({ x, y, r }) => {
    const sx = x - cam;
    if (sx < -r || sx > 960 + r) return;
    const g = d.createRadialGradient(sx, y, 0, sx, y, r);
    g.addColorStop(0, 'rgba(0, 0, 0, 1)');
    g.addColorStop(0.55, 'rgba(0, 0, 0, 0.85)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    d.fillStyle = g;
    d.fillRect(sx - r, y - r, r * 2, r * 2);
  });
  ctx.drawImage(dark, 0, 0, 960, H);
  walk.items.filter((it) => !it.got).forEach((it) => {
    const shine = Math.max(0, Math.sin(walk.time * 1.6 + it.phase)) ** 10;
    if (shine < 0.05) return;
    ctx.globalAlpha = shine;
    sparkle(ctx, it.x - cam + 4, it.y - 14, 6 + shine * 8, it.kind === 'crystal' ? it.color : '#fff');
    ctx.globalAlpha = 1;
  });
}

// de prinses met de lantaarn; sprite = plaatje van de prinses (vak 300 × 520)
export function drawPrincess(ctx, sprite, walk, cam) {
  const bob = walk.moving ? Math.abs(Math.sin(walk.time * 10)) * 6 : Math.sin(walk.time * 2) * 1.5;
  const x = walk.x - cam;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(x, walk.y, 44, 9, 0, 0, 6.28);
  ctx.fill();
  ctx.save();
  ctx.translate(x, walk.y - bob);
  ctx.rotate(walk.moving ? Math.sin(walk.time * 10) * 0.04 : 0);
  ctx.scale(walk.face, 1);
  if (sprite.complete && sprite.naturalWidth) ctx.drawImage(sprite, -150 * S, -510 * S, 300 * S, 520 * S);
  const swing = Math.sin(walk.time * (walk.moving ? 8 : 2)) * 0.25;
  ctx.translate(26, -79);
  ctx.rotate(swing);
  ctx.strokeStyle = '#7a5a10';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 10);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 220, 120, 0.35)';
  ctx.beginPath();
  ctx.arc(0, 22, 18, 0, 6.28);
  ctx.fill();
  ctx.fillStyle = '#ffd43b';
  ctx.fillRect(-8, 10, 16, 4);
  ctx.fillRect(-8, 30, 16, 4);
  ctx.fillStyle = '#fff3a3';
  ctx.fillRect(-6, 14, 12, 16);
  ctx.restore();
}

// wat je net opraapte vliegt omhoog en verdwijnt
export function drawPicked(ctx, walk, cam) {
  walk.items.filter((it) => it.got && walk.time - it.got < 0.8).forEach((it) => {
    const t = (walk.time - it.got) / 0.8;
    ctx.save();
    ctx.globalAlpha = 1 - t;
    ctx.translate(it.x - cam, it.y - 30 - t * 90);
    ctx.scale(1.4 + t, 1.4 + t);
    (it.kind === 'shell' ? shell : crystal)(ctx, it);
    ctx.restore();
    ctx.globalAlpha = 1 - t;
    ctx.fillStyle = '#ffd43b';
    ctx.font = '700 26px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('+1', it.x - cam, it.y - 70 - t * 90);
    ctx.globalAlpha = 1;
  });
}

// een wolkje met tekst boven een vriendje (wat het net vond)
export function drawSay(ctx, f, text, cam) {
  if (!text) return;
  ctx.font = '700 18px Fredoka, sans-serif';
  const w = ctx.measureText(text).width + 20;
  const x = f.x - cam;
  const y = f.y - 250;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - 16, w, 30, 15);
  ctx.fill();
  ctx.fillStyle = '#c2419a';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y + 5);
}
