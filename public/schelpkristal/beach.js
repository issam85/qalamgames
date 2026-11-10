// Het strand: de prinses loopt in het donker met haar lantaarn en zoekt schelpen en
// kristallen. Elke tocht liggen er SHELLS schelpen en CRYSTALS kristallen; wat je
// vindt, komt bij je verzameling (game.shells, game.crystals).
import { newWalk, step, left, allFound, WORLD, SHELLS, CRYSTALS } from './beach-world.js';
import { background, sea, H } from './beach-scene.js';
import { drawItems, drawDark, drawPrincess, drawPicked } from './beach-draw.js';
import { beachInput } from './beach-input.js';
import { princessSvg } from './princess.js';
import { ting } from './sound.js';

const canvas = document.getElementById('strand-canvas');
const ctx = canvas.getContext('2d');
const progressEl = document.getElementById('strand-progress');
const endEl = document.getElementById('strand-end');
const dark = document.createElement('canvas');
const input = beachInput(canvas);
let bg = null;
let sprite = new Image();
let walk = null;
let api = null; // { game, save(), counters() }
let frame = 0;
let last = 0;

function progress() {
  progressEl.innerHTML = `Schelpen <b>${SHELLS - left(walk, 'shell')} / ${SHELLS}</b> · Kristallen <b>${CRYSTALS - left(walk, 'crystal')} / ${CRYSTALS}</b>`;
}

function fit() {
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = 960 * ratio;
  canvas.height = H * ratio;
  dark.width = 960;
  dark.height = H;
}

function tick() {
  const now = performance.now();
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  let cam = Math.max(0, Math.min(WORLD.w - 960, walk.x - 400));
  if (endEl.hidden) {
    const picked = step(walk, input.dir(), input.target(cam), dt);
    picked.forEach((it) => {
      api.game[it.kind === 'shell' ? 'shells' : 'crystals'] += 1;
      ting(it.kind === 'crystal');
    });
    if (picked.length) {
      api.save();
      api.counters();
      progress();
      if (allFound(walk)) setTimeout(() => { endEl.hidden = false; }, 700);
    }
  } else {
    walk.time += dt;
  }
  cam = Math.max(0, Math.min(WORLD.w - 960, walk.x - 400));
  const ratio = canvas.width / 960;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.drawImage(bg.back, cam, 0, 960, H, 0, 0, 960, H);
  sea(ctx, cam, walk.time);
  ctx.drawImage(bg.front, cam, 0, 960, H, 0, 0, 960, H);
  drawItems(ctx, walk, cam, false);
  drawPrincess(ctx, sprite, walk, cam);
  drawItems(ctx, walk, cam, true);
  drawDark(ctx, dark, walk, cam);
  drawPicked(ctx, walk, cam);
  frame = requestAnimationFrame(tick);
}

function start() {
  walk = newWalk();
  endEl.hidden = true;
  input.clear();
  progress();
}

export function initBeach(beachApi) {
  api = beachApi;
  document.getElementById('strand-again').addEventListener('click', start);
  window.addEventListener('resize', fit);
}

export function showBeach() {
  bg = bg || background();
  fit();
  sprite = new Image();
  sprite.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(princessSvg(api.game.princess, api.game.outfit))}`;
  start();
  cancelAnimationFrame(frame);
  last = performance.now();
  frame = requestAnimationFrame(tick);
}

export function hideBeach() {
  cancelAnimationFrame(frame);
  input.clear();
}
