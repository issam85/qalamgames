// De zee: de prinses zwemt in haar burkini en duikt naar de oesters op de bodem. Een
// oester gaat af en toe open; zwem je er dan langs, dan pak je de parel. Wat je vindt,
// komt bij game.pearls.
import { newSwim, swimStep, pearlsLeft, SEA, OYSTERS } from './sea-world.js';
import { seaBackground, surface, fish } from './sea-scene.js';
import { oysters, bubbles } from './sea-oysters.js';
import { beachInput } from './beach-input.js';
import { drawGoal } from './beach-draw.js';
import { swimSvg } from './princess.js';
import { sprite as toSprite, pixelRatio } from './sprites.js';
import { countPart } from './pictures.js';
import { ting } from './sound.js';

const canvas = document.getElementById('zee-canvas');
const ctx = canvas.getContext('2d');
const progressEl = document.getElementById('zee-progress');
const endEl = document.getElementById('zee-end');
const input = beachInput(canvas, 0);
const S = 0.36; // de prinses (vak 300 × 520) in de zee
let bg = null;
let sprite = null; // plaatje van de prinses (sprites.js)
let swim = null;
let api = null; // { game, save(), counters() }
let frame = 0;
let last = 0;

function progress() {
  const got = OYSTERS - pearlsLeft(swim);
  progressEl.innerHTML = countPart('pearl', `${got}/${OYSTERS}`);
  progressEl.setAttribute('aria-label', `Parels ${got} van ${OYSTERS}`);
}

// liggend, met het hoofd in de zwemrichting; ze schopt een beetje met haar benen
function drawSwimmer(cam) {
  ctx.save();
  ctx.translate(swim.x - cam, swim.y + Math.sin(swim.time * 3) * 4);
  ctx.rotate(swim.face * (Math.PI / 2 - 0.12) + Math.sin(swim.time * (swim.moving ? 9 : 3)) * 0.04);
  if (sprite && sprite.ready) ctx.drawImage(sprite, -150 * S, -260 * S, 300 * S, 520 * S);
  ctx.restore();
}

// een parel die je net pakte vliegt omhoog
function drawPicked(cam) {
  swim.oysters.filter((o) => o.got && swim.time - o.got < 0.9).forEach((o) => {
    const t = (swim.time - o.got) / 0.9;
    ctx.globalAlpha = 1 - t;
    ctx.fillStyle = '#fbf7f0';
    ctx.beginPath();
    ctx.arc(o.x - cam, o.y - 30 - t * 120, 10 + t * 6, 0, 6.28);
    ctx.fill();
    ctx.fillStyle = '#ffd43b';
    ctx.font = '700 26px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('+1', o.x - cam, o.y - 70 - t * 120);
    ctx.globalAlpha = 1;
  });
}

function tick() {
  const now = performance.now();
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  const cam = () => Math.max(0, Math.min(SEA.w - 960, swim.x - 420));
  if (endEl.hidden) {
    const picked = swimStep(swim, input.dir(), input.target(cam()), dt);
    if (input.goal() && !swim.moving) input.clearGoal(); // aangekomen (of vast)
    if (picked.length) {
      api.game.pearls += picked.length;
      ting(true);
      api.save();
      api.counters();
      progress();
      const s = swim;
      // alleen als dit nog dezelfde duik is (niet na "Nog een keer")
      if (!pearlsLeft(swim)) setTimeout(() => { if (swim === s) endEl.hidden = false; }, 900);
    }
  } else {
    swim.time += dt;
  }
  const c = cam();
  const ratio = canvas.width / 960;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.drawImage(bg, c, 0, 960, 540, 0, 0, 960, 540);
  surface(ctx, c, swim.time);
  fish(ctx, c, swim.time);
  oysters(ctx, swim, c);
  drawGoal(ctx, input.goal(), c, swim.time);
  drawSwimmer(c);
  bubbles(ctx, swim, c);
  drawPicked(c);
  frame = requestAnimationFrame(tick);
}

function start() {
  swim = newSwim();
  endEl.hidden = true;
  input.clear();
  progress();
}

function fit() {
  const ratio = pixelRatio();
  canvas.width = 960 * ratio;
  canvas.height = 540 * ratio;
}

export function initSea(seaApi) {
  api = seaApi;
  document.getElementById('zee-again').addEventListener('click', start);
  window.addEventListener('resize', fit);
}

export function showSea() {
  bg = bg || seaBackground();
  fit();
  sprite = toSprite(swimSvg(api.game.princess, api.game.outfit), 300 * S, 520 * S);
  start();
  cancelAnimationFrame(frame);
  last = performance.now();
  frame = requestAnimationFrame(tick);
}

export function hideSea() {
  cancelAnimationFrame(frame);
  input.clear();
}
