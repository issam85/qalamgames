// Het strand: de prinses loopt in het donker met haar lantaarn en zoekt schelpen en
// kristallen, samen met haar vrienden (twee prinsen en een prinses, beach-friends.js).
// Elke tocht liggen er SHELLS schelpen en CRYSTALS kristallen; wat zij of haar
// vrienden vinden, komt bij de verzameling (game.shells, game.crystals).
import { newWalk, step, snap, left, allFound, WORLD, SHELLS, CRYSTALS } from './beach-world.js';
import { background, sea, H } from './beach-scene.js';
import { drawItems, drawDark, drawPrincess, drawPicked, drawSay, drawGoal, S } from './beach-draw.js';
import { newFriends, friendsStep, saying } from './beach-friends.js';
import { beachInput } from './beach-input.js';
import { princessSvg } from './princess.js';
import { sprite, makeCrew, pixelRatio } from './sprites.js';
import { countPart } from './pictures.js';
import { HAND } from './icons.js';
import { ting } from './sound.js';

const canvas = document.getElementById('strand-canvas');
const ctx = canvas.getContext('2d');
const progressEl = document.getElementById('strand-progress');
const endEl = document.getElementById('strand-end');
const dark = document.createElement('canvas');
const input = beachInput(canvas);
let bg = null;
let me = null; // plaatje van de prinses
let walk = null;
let friends = [];
let crew = []; // per vriendje { name, sprite }
let api = null; // { game, save(), counters() }
let frame = 0;
let last = 0;

// een wijzend handje: tik of houd je vinger op het strand; weg na de eerste keer
const hand = document.createElement('div');
hand.className = 'tap-hand beach-hand';
hand.innerHTML = HAND;
canvas.parentElement.append(hand);
canvas.addEventListener('pointerdown', () => { hand.hidden = true; });

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
  const w = walk;
  // alleen als dit nog dezelfde tocht is (niet na "Nog een keer")
  if (allFound(walk)) setTimeout(() => { if (walk === w) endEl.hidden = false; }, 900);
}

function progress() {
  const shells = SHELLS - left(walk, 'shell');
  const crystals = CRYSTALS - left(walk, 'crystal');
  progressEl.innerHTML = `${countPart('shell', `${shells}/${SHELLS}`)} ${countPart('crystal', `${crystals}/${CRYSTALS}`)}`;
  progressEl.setAttribute('aria-label', `Schelpen ${shells} van ${SHELLS}, kristallen ${crystals} van ${CRYSTALS}`);
}

function fit() {
  const ratio = pixelRatio();
  canvas.width = 960 * ratio;
  canvas.height = H * ratio;
  dark.width = 960;
  dark.height = H;
}

const camAt = () => Math.max(0, Math.min(WORLD.w - 960, walk.x - 400));

function tick() {
  const now = performance.now();
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  if (endEl.hidden) {
    collect(step(walk, input.dir(), snap(walk, input.target(camAt())), dt));
    if (input.goal() && !walk.moving) input.clearGoal(); // aangekomen (of vast)
    collect(friendsStep(friends, walk, dt, walk.time));
  } else {
    walk.time += dt;
    friendsStep(friends, walk, dt, walk.time);
  }
  const cam = camAt();
  const ratio = canvas.width / 960;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.drawImage(bg.back, cam, 0, 960, H, 0, 0, 960, H);
  sea(ctx, cam, walk.time);
  ctx.drawImage(bg.front, cam, 0, 960, H, 0, 0, 960, H);
  drawGoal(ctx, input.goal(), cam, walk.time);
  drawItems(ctx, walk, cam, false);
  // wie lager in beeld staat, staat vóór de anderen
  [{ w: walk, img: me }, ...friends.map((f, k) => ({ w: f, img: crew[k].sprite }))]
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
  me = sprite(princessSvg(api.game.princess, api.game.outfit), 300 * S, 520 * S);
  crew = makeCrew(api.game.princess, 300 * S, 520 * S);
  start();
  cancelAnimationFrame(frame);
  last = performance.now();
  frame = requestAnimationFrame(tick);
}

export function hideBeach() {
  cancelAnimationFrame(frame);
  input.clear();
}
