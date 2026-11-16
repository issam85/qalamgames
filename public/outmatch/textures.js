// Texturen getekend in code: kunstgras met lijnen, gaas, ramen, de bal en zachte schaduwen.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { FIELD, GOAL } from './config.js';

function canvasOf(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx: canvas.getContext('2d') };
}

function toTexture(canvas, repeatX = 1, repeatY = 1) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 4;
  return tex;
}

// het veld: banen in twee tinten groen en witte lijnen (1 meter = 32 pixels)
export function pitchTexture() {
  const s = 32;
  const { canvas, ctx } = canvasOf(FIELD.halfL * 2 * s, FIELD.halfW * 2 * s);
  const w = canvas.width, h = canvas.height;
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i % 2 ? '#2f9e44' : '#37b24d';
    ctx.fillRect((i * w) / 10, 0, w / 10 + 1, h);
  }
  ctx.strokeStyle = 'rgba(255,255,255,.9)';
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.beginPath();
  ctx.moveTo(w / 2, 10);
  ctx.lineTo(w / 2, h - 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 3 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 6, 0, Math.PI * 2);
  ctx.fill();
  const boxW = (GOAL.halfW + 2.5) * 2 * s, boxD = 4 * s;
  ctx.strokeRect(10, (h - boxW) / 2, boxD, boxW);
  ctx.strokeRect(w - 10 - boxD, (h - boxW) / 2, boxD, boxW);
  [[10 + 3 * s], [w - 10 - 3 * s]].forEach(([x]) => {
    ctx.beginPath();
    ctx.arc(x, h / 2, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  return toTexture(canvas);
}

// gaas: dunne lijnen in een ruit, de rest doorzichtig
export function meshTexture(repeatX, repeatY, color = 'rgba(220,235,255,.85)') {
  const { canvas, ctx } = canvasOf(64, 64);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(64, 64);
  ctx.moveTo(64, 0);
  ctx.lineTo(0, 64);
  ctx.stroke();
  return toTexture(canvas, repeatX, repeatY);
}

// verlichte ramen voor de flats rondom
export function windowTexture() {
  const { canvas, ctx } = canvasOf(64, 128);
  ctx.fillStyle = '#1b1f3b';
  ctx.fillRect(0, 0, 64, 128);
  for (let y = 6; y < 128; y += 14) {
    for (let x = 6; x < 64; x += 14) {
      const lit = Math.random() < 0.45;
      ctx.fillStyle = lit ? (Math.random() < 0.7 ? '#ffd98a' : '#9fd8ff') : '#2a2f55';
      ctx.fillRect(x, y, 8, 9);
    }
  }
  return toTexture(canvas);
}

// de bal: wit met donkere vlakken, zodat je hem ziet rollen
export function ballTexture() {
  const { canvas, ctx } = canvasOf(256, 128);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#1d2b53';
  const spots = [[32, 32], [96, 64], [160, 32], [224, 64], [32, 96], [160, 96], [96, 8], [224, 120]];
  spots.forEach(([x, y]) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.lineTo(x + Math.cos(a) * 15, y + Math.sin(a) * 15);
    }
    ctx.fill();
  });
  ctx.fillStyle = '#ffd43b';
  ctx.fillRect(0, 60, 256, 8);
  return toTexture(canvas);
}

// zachte ronde schaduw onder spelers en bal
export function blobTexture() {
  const { canvas, ctx } = canvasOf(64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(0,0,0,.55)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return toTexture(canvas);
}

// tekstlabel (P1, P2) als plaatje
export function labelTexture(text, color) {
  const { canvas, ctx } = canvasOf(128, 64);
  ctx.font = '700 40px Fredoka, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 8;
  ctx.strokeStyle = 'rgba(0,0,0,.6)';
  ctx.strokeText(text, 64, 34);
  ctx.fillStyle = color;
  ctx.fillText(text, 64, 34);
  return toTexture(canvas);
}
