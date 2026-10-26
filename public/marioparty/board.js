// Stenen trap in Minecraft-stijl en de sterren-/tredelogica.
import { drawCharacter, characterImage } from './characters.js';

export const STEPS = 10;
const BLOCK = 16;
const STEP_W = BLOCK * 4;
const STEP_H = BLOCK * 2;
const STAIR_X = BLOCK * 3;
const GROUND_Y = BLOCK * 27;
const SPRITE_H = 72;

export const AWARDS = {
  first: { stars: 2, points: 10 },
  second: { stars: 1, points: 5 },
};
const LOSER_STEP = -1;

const STONE = ['#8a8a8a', '#666666', '#a6a6a6'];
const DIRT = ['#8b5a2b', '#6b4420', '#a06a35'];
const GRASS = ['#5aa832', '#3f7f22', '#7cc648'];

function drawBlock(ctx, x, y, [base, dark, light]) {
  ctx.fillStyle = base;
  ctx.fillRect(x, y, BLOCK, BLOCK);
  const sub = BLOCK / 4;
  for (let py = 0; py < 4; py++) {
    for (let px = 0; px < 4; px++) {
      // deterministische ruis zodat de textuur niet flikkert bij hertekenen
      const seed = Math.sin(x * 12.9898 + y * 78.233 + px * 37.719 + py * 3.17) * 43758.5453;
      const v = Math.abs(seed % 1) * 100;
      if (v < 15) ctx.fillStyle = dark;
      else if (v < 30) ctx.fillStyle = light;
      else continue;
      ctx.fillRect(x + px * sub, y + py * sub, sub, sub);
    }
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, BLOCK - 1, BLOCK - 1);
}

function fillBlocks(ctx, x0, y0, x1, y1, colors) {
  for (let y = y0; y < y1; y += BLOCK) {
    for (let x = x0; x < x1; x += BLOCK) drawBlock(ctx, x, y, colors);
  }
}

function drawGround(ctx, width, height) {
  fillBlocks(ctx, 0, GROUND_Y, width, GROUND_Y + BLOCK, GRASS);
  fillBlocks(ctx, 0, GROUND_Y + BLOCK, width, height, DIRT);
}

function drawStairs(ctx) {
  for (let step = 1; step <= STEPS; step++) {
    const x = STAIR_X + step * STEP_W;
    fillBlocks(ctx, x, GROUND_Y - step * STEP_H, x + STEP_W, GROUND_Y, STONE);
  }
}

function drawStar(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r / 2.2;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fillStyle = '#ffd400';
  ctx.fill();
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function stepFootY(step) {
  return GROUND_Y - step * STEP_H;
}

function stepCenterX(step) {
  return STAIR_X + step * STEP_W + STEP_W / 2;
}

function drawPlayers(ctx, players) {
  players.forEach((player) => {
    const group = players.filter((p) => p.step === player.step);
    const dx = (group.indexOf(player) - (group.length - 1) / 2) * 22;
    drawCharacter(ctx, player.character, stepCenterX(player.step) + dx, stepFootY(player.step), SPRITE_H);
  });
}

export function renderBoard(canvas, players) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGround(ctx, canvas.width, canvas.height);
  drawStairs(ctx);
  drawStar(ctx, stepCenterX(STEPS), stepFootY(STEPS) - 64, 18);
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
