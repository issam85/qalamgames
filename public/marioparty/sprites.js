// Geanimeerde karakters: per karakter sprites/<key>.json met per animatie
// een WebP-strip (sprites/<key>-<anim>.webp). Alle animaties van een
// karakter zijn even groot en hebben de voeten op hetzelfde punt.
import { loadImage, getImage } from './assets.js';

// staande hoogte van een karakter in de sprite sheets (zie het pakscript)
const STAND = 128;
const meta = new Map();

function sheetUrl(key, anim) {
  return `sprites/${key}-${anim}.webp`;
}

async function loadOne(key) {
  const res = await fetch(`sprites/${key}.json`);
  if (!res.ok) throw new Error(`Kan sprites/${key}.json niet laden`);
  const m = await res.json();
  meta.set(key, m);
  await Promise.all(Object.keys(m.anims).map((anim) => loadImage(sheetUrl(key, anim))));
}

export function loadSprites(keys) {
  return Promise.all(keys.map(loadOne));
}

export function createSprite(key, anim = 'idle') {
  return { key, anim, t: 0, speed: 1 };
}

// wisselt van animatie; dezelfde animatie loopt door tenzij restart
export function play(sprite, anim, restart = false) {
  if (sprite.anim === anim && !restart) return;
  sprite.anim = anim;
  sprite.t = 0;
}

export function update(sprite, dt) {
  sprite.t += dt * sprite.speed;
}

function current(sprite) {
  const m = meta.get(sprite.key);
  const anim = m.anims[sprite.anim] ? sprite.anim : 'idle';
  return { m, anim, a: m.anims[anim] };
}

function frameIndex(t, a, fps) {
  const n = a.frames;
  const f = Math.floor(t * fps);
  if (n === 1) return 0;
  if (a.mode === 'loop') return f % n;
  if (a.mode === 'pingpong') {
    const period = 2 * n - 2;
    const k = f % period;
    return k < n ? k : period - k;
  }
  return Math.min(f, n - 1);
}

// true zodra een eenmalige animatie (springen, sip) is afgelopen
export function isDone(sprite) {
  const { m, a } = current(sprite);
  return a.mode === 'once' && Math.floor(sprite.t * m.fps) >= a.frames - 1;
}

// tekent het karakter met de voeten op (x, footY); height = staande hoogte
export function drawSprite(ctx, sprite, x, footY, height, shadow = true) {
  const { m, anim, a } = current(sprite);
  const s = height / STAND;
  const w = m.frameW * s;
  const h = m.frameH * s;
  // een stilstaande pose krijgt een rustige ademhaling
  const breathe = a.frames === 1 ? 1 + Math.sin(sprite.t * 3) * 0.025 : 1;
  if (shadow) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(x, footY - 2, height * 0.3, height * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const i = frameIndex(sprite.t, a, m.fps);
  ctx.drawImage(getImage(sheetUrl(sprite.key, anim)), i * m.frameW, 0, m.frameW, m.frameH,
    x - m.footX * s, footY - m.footY * s * breathe, w, h * breathe);
}
