// Texturen getekend in code: achtpuntige sterren, blokvlakken en zachte gloed.
import * as THREE from '../marioparty/vendor/three.module.min.js';

const SIZE = 256;
const INNER = 0.765; // verhouding waarbij de punten precies een achtster vormen

export function star(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    const rad = i % 2 ? r * INNER : r;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function makeCanvas(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return { canvas, ctx: canvas.getContext('2d') };
}

function toTexture(canvas, repeatX = 1, repeatY = 1) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 4;
  return tex;
}

// grijs patroon: de kleur komt van het materiaal en kan zo per stuk van het level wisselen
export function starTexture(repeatX, repeatY) {
  const { canvas, ctx } = makeCanvas(SIZE);
  ctx.fillStyle = '#606060';
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = '#7c7c7c';
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 3;
  star(ctx, SIZE / 2, SIZE / 2, SIZE * 0.34);
  [[0, 0], [SIZE, 0], [0, SIZE], [SIZE, SIZE]].forEach(([x, y]) => star(ctx, x, y, SIZE * 0.34));
  return toTexture(canvas, repeatX, repeatY);
}

// één raam van de lantaarn; wit, zodat het de gekozen kleur aanneemt
export function lanternTexture() {
  const { canvas, ctx } = makeCanvas(128);
  ctx.fillStyle = '#c8c8c8';
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#7a7a7a';
  ctx.lineWidth = 5;
  star(ctx, 64, 64, 52);
  return toTexture(canvas, 8, 1);
}

let glowMap = null;

// zachte lichtvlek die optelt bij wat erachter staat
export function glowSprite(color, size) {
  if (!glowMap) {
    const { canvas, ctx } = makeCanvas(128);
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,.35)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    glowMap = new THREE.CanvasTexture(canvas);
  }
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowMap, color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  }));
  sprite.scale.setScalar(size);
  return sprite;
}
