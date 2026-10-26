// Stenen trap in vooraanzicht (zoals in de Mario-games) en de sterren-/tredelogica.
import { drawCharacter, characterImage } from './characters.js';
import { loadImage, getImage } from './assets.js';

export const STEPS = 10;
const STONE_URL = 'img/stone.jpg';
const BG_URL = 'img/bg-stairs.jpg';
const STAR_URL = 'img/star.png';

const CENTER_X = 400;
const GROUND_Y = 446;
const STEP_H = 34;
const TREAD_H = 8;
const WIDTH_BOTTOM = 560;
const WIDTH_SHRINK = 20;
const SPRITE_BOTTOM = 80;
const SPRITE_SHRINK = 2.4;

export const AWARDS = {
  first: { stars: 2, points: 10 },
  second: { stars: 1, points: 5 },
};
const LOSER_STEP = -1;

export function loadBoardAssets() {
  return Promise.all([STONE_URL, BG_URL, STAR_URL].map(loadImage));
}

function treadY(step) {
  return GROUND_Y - step * STEP_H;
}

function stepWidth(step) {
  return WIDTH_BOTTOM - step * WIDTH_SHRINK;
}

function spriteHeight(step) {
  return SPRITE_BOTTOM - step * SPRITE_SHRINK;
}

function stonePattern(ctx) {
  const pattern = ctx.createPattern(getImage(STONE_URL), 'repeat');
  pattern.setTransform(new DOMMatrix().scale(0.4));
  return pattern;
}

function drawStep(ctx, pattern, step) {
  const top = treadY(step);
  const wTop = stepWidth(step);
  const wBottom = stepWidth(step - 1);
  // stootrand: loopt uit naar de bredere trede eronder
  ctx.beginPath();
  ctx.moveTo(CENTER_X - wTop / 2, top + TREAD_H);
  ctx.lineTo(CENTER_X + wTop / 2, top + TREAD_H);
  ctx.lineTo(CENTER_X + wBottom / 2, top + STEP_H);
  ctx.lineTo(CENTER_X - wBottom / 2, top + STEP_H);
  ctx.closePath();
  ctx.fillStyle = pattern;
  ctx.fill();
  const shade = ctx.createLinearGradient(0, top + TREAD_H, 0, top + STEP_H);
  shade.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
  shade.addColorStop(1, 'rgba(0, 0, 0, 0.38)');
  ctx.fillStyle = shade;
  ctx.fill();
  // bovenkant van de trede: lichte strook
  ctx.fillStyle = pattern;
  ctx.fillRect(CENTER_X - wTop / 2, top, wTop, TREAD_H);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(CENTER_X - wTop / 2, top, wTop, TREAD_H);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(CENTER_X - wTop / 2, top, wTop, TREAD_H);
}

function drawGround(ctx, pattern, width, height) {
  ctx.fillStyle = pattern;
  ctx.fillRect(0, GROUND_Y, width, height - GROUND_Y);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(0, GROUND_Y, width, height - GROUND_Y);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(0, GROUND_Y, width, 3);
}

function drawStar(ctx) {
  const size = 76;
  const cx = CENTER_X;
  const cy = treadY(STEPS) - 66;
  const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 70);
  glow.addColorStop(0, 'rgba(255, 230, 100, 0.6)');
  glow.addColorStop(1, 'rgba(255, 230, 100, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(cx - 70, cy - 70, 140, 140);
  ctx.drawImage(getImage(STAR_URL), cx - size / 2, cy - size / 2, size, size);
}

function drawPlayers(ctx, players) {
  for (let step = STEPS; step >= 0; step--) {
    const group = players.filter((p) => p.step === step);
    const height = spriteHeight(step);
    group.forEach((player, k) => {
      const dx = (k - (group.length - 1) / 2) * height * 0.75;
      drawCharacter(ctx, player.character, CENTER_X + dx, treadY(step) + TREAD_H, height);
    });
  }
}

export function renderBoard(canvas, players) {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(getImage(BG_URL), 0, 0, canvas.width, canvas.height);
  const pattern = stonePattern(ctx);
  drawGround(ctx, pattern, canvas.width, canvas.height);
  for (let step = STEPS; step >= 1; step--) drawStep(ctx, pattern, step);
  drawStar(ctx);
  drawPlayers(ctx, players);
}

// ranking: spelers gesorteerd van winnaar naar laatste
export function applyRoundResult(players, ranking) {
  ranking.forEach((player, place) => {
    const award = place === 0 ? AWARDS.first : place === 1 ? AWARDS.second : null;
    const delta = award ? award.stars : LOSER_STEP;
    player.step = Math.max(0, Math.min(STEPS, player.step + delta));
    if (!award) return;
    player.stars += award.stars;
    player.points += award.points;
  });
}

export function renderHud(container, players) {
  container.innerHTML = '';
  players.forEach((player) => {
    const card = document.createElement('div');
    card.className = 'hud-card';
    card.style.borderColor = player.character.color;
    card.appendChild(characterImage(player.character, 56));
    const info = document.createElement('div');
    info.innerHTML = `<b>${player.character.name}</b><small>${player.control}</small>`
      + `<span>⭐ ${player.stars}</span><span>🍄 ${player.points}</span>`;
    card.appendChild(info);
    container.appendChild(card);
  });
}
