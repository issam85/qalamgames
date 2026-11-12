// Blokvlakken per wereld, getekend in code: steen met een ster, mozaïektegels, marmer met goud.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { star } from './pattern.js';

const SIZE = 128;

function draw(paint) {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  paint(canvas.getContext('2d'), seeded(7));
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// vaste 'willekeur', zodat elke tegel er elke keer hetzelfde uitziet
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

// Lantaarnstad: blauwgrijze steen met voegen, korreltjes en een kleine gouden ster
export const stoneTexture = () => draw((ctx, random) => {
  ctx.fillStyle = '#8f86c8';
  ctx.fillRect(0, 0, SIZE, SIZE);
  for (let i = 0; i < 140; i++) {
    ctx.fillStyle = random() < 0.5 ? 'rgba(255,255,255,.08)' : 'rgba(20,10,60,.12)';
    ctx.fillRect(random() * SIZE, random() * SIZE, 3, 3);
  }
  ctx.strokeStyle = '#4a3f8c';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, SIZE - 8, SIZE - 8);
  ctx.fillStyle = '#ffd43b';
  ctx.strokeStyle = '#b5651d';
  ctx.lineWidth = 2;
  star(ctx, SIZE / 2, SIZE / 2, 20);
});

// Sterrenbazaar: mozaïek in vier kleuren rond een witte ster
export const zelligeTexture = () => draw((ctx) => {
  const colors = ['#1aa6a0', '#1e5fbf', '#f08a24', '#1aa6a0'];
  const half = SIZE / 2;
  [[0, 0], [half, 0], [0, half], [half, half]].forEach(([x, y], i) => {
    ctx.fillStyle = colors[i];
    ctx.fillRect(x, y, half, half);
    ctx.fillStyle = i % 2 ? '#f08a24' : '#1e5fbf';
    ctx.beginPath();
    ctx.moveTo(x + half / 2, y + 6);
    ctx.lineTo(x + half - 6, y + half / 2);
    ctx.lineTo(x + half / 2, y + half - 6);
    ctx.lineTo(x + 6, y + half / 2);
    ctx.fill();
  });
  ctx.strokeStyle = '#fff6e0';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, SIZE - 4, SIZE - 4);
  ctx.beginPath();
  ctx.moveTo(half, 0);
  ctx.lineTo(half, SIZE);
  ctx.moveTo(0, half);
  ctx.lineTo(SIZE, half);
  ctx.stroke();
  ctx.fillStyle = '#fff6e0';
  ctx.strokeStyle = '#c62828';
  ctx.lineWidth = 2;
  star(ctx, half, half, 22);
});

// Hemelpaleis: wit marmer met grijze aders en een gouden rand
export const marbleTexture = () => draw((ctx, random) => {
  const g = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(1, '#e6e1f2');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.strokeStyle = 'rgba(120,110,150,.35)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(random() * SIZE, 0);
    ctx.bezierCurveTo(random() * SIZE, random() * SIZE, random() * SIZE, random() * SIZE, random() * SIZE, SIZE);
    ctx.stroke();
  }
  ctx.strokeStyle = '#e0b100';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, SIZE - 6, SIZE - 6);
});

// strepen voor de luifels van de marktkraampjes; de kleur komt per kraampje erbij
export const stripeTexture = () => draw((ctx) => {
  for (let x = 0; x < SIZE; x += 16) {
    ctx.fillStyle = (x / 16) % 2 ? '#ffffff' : '#c9c9c9';
    ctx.fillRect(x, 0, 16, SIZE);
  }
});
