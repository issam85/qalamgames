// Stenen trap in vooraanzicht (zoals in de Mario-games) en de sterren-/tredelogica.
// De spelers op de trap worden getekend en geanimeerd in board-anim.js.
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

// voetpositie en karaktergrootte op een (eventueel tussenliggende) trede
export function footY(step) {
  return treadY(step) + TREAD_H;
}

export function spriteHeight(step) {
  return SPRITE_BOTTOM - step * SPRITE_SHRINK;
}

export const CENTER = CENTER_X;
export const STAR_POS = { x: CENTER_X, y: GROUND_Y - STEPS * STEP_H - 66 };

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

// de ster dobbert, wiebelt en gloeit; t in seconden
export function drawStar(ctx, t) {
  const size = 76;
  const cx = STAR_POS.x;
  const cy = STAR_POS.y + Math.sin(t * 2) * 5;
  const r = 70 + Math.sin(t * 3) * 10;
  const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
  glow.addColorStop(0, 'rgba(255, 230, 100, 0.65)');
  glow.addColorStop(1, 'rgba(255, 230, 100, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(t * 1.5) * 0.12);
  ctx.drawImage(getImage(STAR_URL), -size / 2, -size / 2, size, size);
  ctx.restore();
}

// achtergrond, grond en treden veranderen niet: één keer tekenen en hergebruiken
let sceneCache = null;

export function drawScene(ctx, canvas) {
  if (!sceneCache) {
    sceneCache = document.createElement('canvas');
    sceneCache.width = canvas.width;
    sceneCache.height = canvas.height;
    const c = sceneCache.getContext('2d');
    c.drawImage(getImage(BG_URL), 0, 0, canvas.width, canvas.height);
    const pattern = stonePattern(c);
    drawGround(c, pattern, canvas.width, canvas.height);
    for (let step = STEPS; step >= 1; step--) drawStep(c, pattern, step);
  }
  ctx.drawImage(sceneCache, 0, 0);
}

// ranking: spelers gesorteerd van winnaar naar laatste; geeft per speler
// de beweging op de trap terug ({ player, from, to, place })
export function applyRoundResult(players, ranking) {
  return ranking.map((player, place) => {
    const award = place === 0 ? AWARDS.first : place === 1 ? AWARDS.second : null;
    const delta = award ? award.stars : LOSER_STEP;
    const from = player.step;
    player.step = Math.max(0, Math.min(STEPS, player.step + delta));
    if (award) {
      player.stars += award.stars;
      player.points += award.points;
    }
    return { player, from, to: player.step, place };
  });
}
