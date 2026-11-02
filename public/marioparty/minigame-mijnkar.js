// Minigame 2: Mijnkar. Je karretje rijdt vanzelf door de kristalgrot; druk om te
// springen over rotsen, kristallen en gaten. Wie het eerst bij de finish is, wint.
import { update as updateSprite } from './sprites.js';
import { createInput } from './sprint-input.js';
import { setupStage, statusSetter } from './stage2d.js';
import { buildCourse, createCart, jump, stepCart } from './mijnkar-course.js';
import { drawMijnkar, makeDeco, CART_X, railY } from './mijnkar-draw.js';

const COUNTDOWN_MS = 3000;
const GRACE_MS = 6000; // na de eerste finisher mogen de anderen nog zo lang
const MAX_MS = 55000;

let game = null;

function press(idx) {
  jump(game.carts[idx]);
}

function spawnSparks(cart) {
  for (let i = 0; i < 14; i++) {
    game.sparks.push({
      x: CART_X + (Math.random() - 0.5) * 40, y: railY(cart.lane) - 10,
      vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 220, age: 0, life: 0.4 + Math.random() * 0.3,
    });
  }
}

function updateSparks(dt) {
  for (let i = game.sparks.length - 1; i >= 0; i--) {
    const s = game.sparks[i];
    s.age += dt;
    if (s.age >= s.life) {
      game.sparks.splice(i, 1);
      continue;
    }
    s.vy += 500 * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
  }
}

function finish() {
  game.phase = 'done';
  const rest = game.carts.filter((c) => c.finishTime === undefined).sort((a, b) => b.d - a.d);
  game.setStatus('Finish!');
  game.onFinish([...game.order, ...rest].map((c) => c.player));
}

function step(now, dt) {
  game.clock += dt;
  const humans = game.carts.filter((c) => !c.cpu).map((c) => c.d);
  const front = humans.length ? Math.max(...humans) : 0;
  game.carts.forEach((c) => {
    const wasStunned = c.stun > 0;
    const t = stepCart(c, game.course, dt, game.clock, c.d - front);
    if (!wasStunned && c.stun > 0) spawnSparks(c);
    if (t !== null) {
      game.order.push(c);
      if (game.firstFinish === null) game.firstFinish = now;
    }
  });
  game.order.sort((a, b) => a.finishTime - b.finishTime);
}

function frame(now) {
  const time = now / 1000;
  const dt = Math.min(0.1, time - game.time);
  game.time = time;
  const elapsed = now - game.t0;
  if (game.phase === 'countdown') {
    const left = Math.ceil((COUNTDOWN_MS - elapsed) / 1000);
    game.setStatus(left > 0 ? String(left) : 'GO!');
    if (elapsed >= COUNTDOWN_MS) game.phase = 'running';
  } else if (game.phase === 'running') {
    if (elapsed > COUNTDOWN_MS + 900 && game.firstFinish === null) game.setStatus('');
    step(now, dt);
    const allDone = game.order.length === game.carts.length;
    const timeUp = game.firstFinish !== null && now - game.firstFinish > GRACE_MS;
    if (allDone || timeUp || elapsed > MAX_MS) finish();
  } else {
    game.carts.forEach((c) => { if (c.finishTime !== undefined) c.d += 230 * dt; });
  }
  game.carts.forEach((c) => updateSprite(c.sprite, dt));
  updateSparks(dt);
  game.stage.begin();
  drawMijnkar(game.stage.ctx, game);
  game.raf = requestAnimationFrame(frame);
}

export function startMijnkar(canvas, statusEl, players, onFinish) {
  stopMijnkar();
  game = {
    players, onFinish,
    carts: players.map(createCart),
    course: buildCourse(),
    deco: makeDeco(),
    sparks: [],
    order: [],
    firstFinish: null,
    phase: 'countdown',
    clock: 0,
    t0: performance.now(),
    time: performance.now() / 1000,
    raf: 0,
    stage: setupStage(canvas),
    setStatus: statusSetter(statusEl),
  };
  if (document.activeElement) document.activeElement.blur();
  window.focus();
  const stageEl = document.getElementById('stage');
  game.input = createInput(players, stageEl, press, () => game && game.phase === 'running');
  game.input.attach();
  game.raf = requestAnimationFrame(frame);
}

export function stopMijnkar() {
  if (!game) return;
  cancelAnimationFrame(game.raf);
  game.input.detach();
  game.stage.dispose();
  game = null;
}
