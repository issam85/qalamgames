// Achtpuntige sterpatronen als herhalende textuur, getekend in code.
import * as THREE from '../marioparty/vendor/three.module.min.js';

const SIZE = 256;
const INNER = 0.765; // verhouding waarbij de punten precies een achtster vormen

function star(ctx, cx, cy, r) {
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

export function starTexture({ background, fill, line, width }, repeatX, repeatY) {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = fill;
  ctx.strokeStyle = line;
  ctx.lineWidth = width;
  star(ctx, SIZE / 2, SIZE / 2, SIZE * 0.34);
  [[0, 0], [SIZE, 0], [0, SIZE], [SIZE, SIZE]].forEach(([x, y]) => star(ctx, x, y, SIZE * 0.34));
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 4;
  return tex;
}
