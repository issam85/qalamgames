// Tekent de sprint: baan, finish, lopers, namen en effecten.
import { loadImage, getImage } from './assets.js';
import { drawSprite } from './sprites.js';
import { drawParticles } from './effects.js';

const BG_URL = 'img/bg-track.jpg';
const LANE_H = 80;
const LANE_TOP = 20;
const TRACK_X = 60;
const SPRITE_H = 66;

export function loadTrack() {
  return loadImage(BG_URL);
}

export function laneFootY(i) {
  return LANE_TOP + i * LANE_H + LANE_H - 6;
}

export function trackX(canvas, fraction) {
  return TRACK_X + fraction * (canvas.width - TRACK_X * 2);
}

export function finishX(canvas) {
  return canvas.width - TRACK_X;
}

function drawFinish(ctx, x, y) {
  const size = LANE_H / 8;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 2; col++) {
      ctx.fillStyle = (row + col) % 2 ? '#222' : '#fff';
      ctx.fillRect(x + col * size, y + row * size, size, size);
    }
  }
}

function drawLane(ctx, i, width) {
  const y = LANE_TOP + i * LANE_H;
  ctx.fillStyle = i % 2 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(0, y, width, LANE_H);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 12]);
  ctx.beginPath();
  ctx.moveTo(0, y + LANE_H);
  ctx.lineTo(width, y + LANE_H);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawLabel(ctx, text, x, y) {
  ctx.font = '700 16px Fredoka, sans-serif';
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = '#fff';
  ctx.fillText(text, x, y);
}

export function drawRace(race) {
  const { canvas, players, runners, particles, shake } = race;
  const ctx = canvas.getContext('2d');
  ctx.save();
  if (shake > 0) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  ctx.drawImage(getImage(BG_URL), -12, -12, canvas.width + 24, canvas.height + 24);
  players.forEach((p, i) => {
    drawLane(ctx, i, canvas.width);
    drawFinish(ctx, finishX(canvas), LANE_TOP + i * LANE_H);
    drawLabel(ctx, `${p.character.name} (${p.control})`, 10, LANE_TOP + i * LANE_H + 22);
  });
  runners.forEach((r, i) => drawSprite(ctx, r.sprite, r.x, laneFootY(i), SPRITE_H));
  drawParticles(ctx, particles);
  ctx.restore();
}
