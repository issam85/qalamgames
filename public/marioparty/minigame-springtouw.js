// Minigame 4: Springtouw. Twee Toads draaien het touw, steeds sneller. Druk om te
// springen als het touw eraan komt; wie het touw raakt, ligt eruit. De laatste wint.
import { update as updateSprite, createSprite, play } from './sprites.js';
import { createInput } from './sprint-input.js';
import { setupStage, statusSetter } from './stage2d.js';
import { createRope, createJumper, jump, stepRound, aliveCount, ranking } from './springtouw-world.js';
import { drawSpringtouw } from './springtouw-draw.js';

const COUNTDOWN_MS = 3000;
const MAX_S = 60; // dan wint wie het preciest sprong
const END_MS = 2200;

let game = null;

function press(idx) {
  jump(game.jumpers[idx]);
}

function finish() {
  game.phase = 'done';
  game.doneAt = game.now;
  const order = ranking(game.jumpers);
  const winner = order[0];
  game.setStatus(aliveCount(game.jumpers) === 1 ? `${winner.character.name} wint!` : 'Klaar!');
  game.jumpers.forEach((j) => play(j.sprite, order.indexOf(j.player) < 2 ? 'cheer' : 'sad', true));
  game.toads.forEach((t) => play(t, 'cheer'));
  game.ranking = order;
}

function step(dt) {
  game.clock += dt;
  const passed = stepRound(game.rope, game.jumpers, dt);
  if (passed) game.toads.forEach((t) => play(t, 'clap'));
  if (aliveCount(game.jumpers) <= 1 || game.clock > MAX_S) finish();
}

function frame(now) {
  const time = now / 1000;
  const dt = Math.min(0.1, time - game.time);
  game.time = time;
  game.now = now;
  const elapsed = now - game.t0;
  if (game.phase === 'countdown') {
    const left = Math.ceil((COUNTDOWN_MS - elapsed) / 1000);
    game.setStatus(left > 0 ? String(left) : 'GO!');
    if (elapsed >= COUNTDOWN_MS) game.phase = 'running';
  } else if (game.phase === 'running') {
    if (elapsed > COUNTDOWN_MS + 900) game.setStatus('');
    step(dt);
  } else if (now - game.doneAt > END_MS && game.ranking) {
    const order = game.ranking;
    game.ranking = null;
    game.onFinish(order);
  }
  game.jumpers.forEach((j) => updateSprite(j.sprite, dt));
  game.toads.forEach((t) => updateSprite(t, dt));
  game.stage.begin();
  drawSpringtouw(game.stage.ctx, game);
  game.raf = requestAnimationFrame(frame);
}

export function startSpringtouw(canvas, statusEl, players, onFinish) {
  stopSpringtouw();
  game = {
    players, onFinish,
    jumpers: players.map(createJumper),
    rope: createRope(),
    toads: [createSprite('toad'), createSprite('toad')],
    ranking: null,
    doneAt: 0,
    now: performance.now(),
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
  game.input = createInput(players, document.getElementById('stage'), press, () => game && game.phase === 'running');
  game.input.attach();
  game.raf = requestAnimationFrame(frame);
}

export function stopSpringtouw() {
  if (!game) return;
  cancelAnimationFrame(game.raf);
  game.input.detach();
  game.stage.dispose();
  game = null;
}
