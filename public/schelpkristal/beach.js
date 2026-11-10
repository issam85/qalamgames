// Het strand: de prinses loopt in het donker met haar lantaarn en zoekt schelpen en
// kristallen, samen met haar vrienden (twee prinsen en een prinses, beach-friends.js).
// Elke tocht liggen er SHELLS schelpen en CRYSTALS kristallen; wat zij of haar
// vrienden vinden, komt bij de verzameling (game.shells, game.crystals).
import { newWalk, step, left, allFound, WORLD, SHELLS, CRYSTALS } from './beach-world.js';
import { background, sea, H } from './beach-scene.js';
import { drawItems, drawDark, drawPrincess, drawPicked, drawSay } from './beach-draw.js';
import { newFriends, friendsStep, saying } from './beach-friends.js';
import { PRINCESSES } from './data.js';
import { PRINCES, princeSvg } from './prince.js';
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
let friends = [];
let crew = []; // per vriendje { name, sprite }
let api = null; // { game, save(), counters() }
let frame = 0;
let last = 0;

const image = (svgText) => {
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
  return img;
};
// het vriendinnetje: de eerste prinses die je zelf niet bent, in een paarse glitterjurk
const FRIEND_DRESS = {
  choice: { jurk: 6, kroon: 2, ketting: 1, schoenen: 0, zwem: 0 },
  color: { jurk: '#b36bff', kroon: '#ffd43b', ketting: 'jurk', schoenen: '#ffd43b', zwem: '#5ec8ff' },
  hood: false,
};
function makeCrew() {
  const girl = PRINCESSES.findIndex((_, i) => i !== api.game.princess);
  return [
    { name: PRINCES[0].name, sprite: image(princeSvg(0)) },
    { name: PRINCESSES[girl].name, sprite: image(princessSvg(girl, FRIEND_DRESS, PRINCESSES[girl].name)) },
    { name: PRINCES[1].name, sprite: image(princeSvg(1)) },
  ];
}

// iets gevonden (door de prinses of een vriendje): bij de verzameling
function collect(found) {
  found.forEach((it) => {
    api.game[it.kind === 'shell' ? 'shells' : 'crystals'] += 1;
    ting(it.kind === 'crystal');
  });
  if (!found.length) return;
  api.save();
  api.counters();
  progress();
  if (allFound(walk)) setTimeout(() => { endEl.hidden = false; }, 900);
}

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
    collect(step(walk, input.dir(), input.target(cam), dt));
    collect(friendsStep(friends, walk, dt, walk.time));
  } else {
    walk.time += dt;
    friendsStep(friends, walk, dt, walk.time);
  }
  cam = Math.max(0, Math.min(WORLD.w - 960, walk.x - 400));
  const ratio = canvas.width / 960;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.drawImage(bg.back, cam, 0, 960, H, 0, 0, 960, H);
  sea(ctx, cam, walk.time);
  ctx.drawImage(bg.front, cam, 0, 960, H, 0, 0, 960, H);
  drawItems(ctx, walk, cam, false);
  // wie lager in beeld staat, staat vóór de anderen
  [{ w: walk, img: sprite }, ...friends.map((f, k) => ({ w: f, img: crew[k].sprite }))]
    .sort((a, b) => a.w.y - b.w.y).forEach(({ w, img }) => drawPrincess(ctx, img, w, cam));
  drawItems(ctx, walk, cam, true);
  drawDark(ctx, dark, walk, cam, friends);
  drawPicked(ctx, walk, cam);
  friends.forEach((f) => drawSay(ctx, f, saying(f, walk), cam));
  frame = requestAnimationFrame(tick);
}

function start() {
  walk = newWalk();
  friends = newFriends(crew.map((c) => c.name));
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
  sprite = image(princessSvg(api.game.princess, api.game.outfit));
  crew = makeCrew();
  start();
  cancelAnimationFrame(frame);
  last = performance.now();
  frame = requestAnimationFrame(tick);
}

export function hideBeach() {
  cancelAnimationFrame(frame);
  input.clear();
}
