// Minigame 4: Springtouw. Twee Toads draaien het touw, steeds sneller. Druk om te
// springen als het touw eraan komt; wie het touw raakt, ligt eruit. De laatste wint.
// In de lucht nog een knop = salto: hoger, langer en een stijlpunt.
import { update as updateSprite, createSprite, play } from './sprites.js';
import { createJumpInput } from './jump-input.js';
import { setupStage, statusSetter } from './stage2d.js';
import { pushPopup, updatePopups } from './fx2d.js';
import { createRope, createJumper, jump, trick, stepRound, aliveCount, ranking, GROUND } from './springtouw-world.js';
import { drawSpringtouw } from './springtouw-draw.js';

const COUNTDOWN_MS = 3000;
const MAX_S = 60; // dan wint wie het preciest sprong
const END_MS = 2200;

let game = null;

function onJump(idx) {
  jump(game.jumpers[idx]);
}

function salto(j) {
  if (trick(j)) pushPopup(game.popups, 'Salto!', j.x, GROUND - 170);
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
  const { struck, tricks } = stepRound(game.rope, game.jumpers, dt);
  tricks.forEach((j) => pushPopup(game.popups, 'Salto!', j.x, GROUND - 170));
  if (struck) {
    game.toads.forEach((t) => play(t, 'clap'));
    struck.forEach((j) => pushPopup(game.popups, j.out ? 'Uit!' : 'Au! Nog 1 leven', j.x, GROUND - 170, '#ff5a3c'));
  }
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
  updatePopups(game.popups, dt);
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
    popups: [],
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
  game.input = createJumpInput(players, document.getElementById('stage'), {
    jump: onJump,
    trick: (idx) => salto(game.jumpers[idx]),
    canPress: () => game && game.phase === 'running',
    inAir: (idx) => game.jumpers[idx].jumpT >= 0,
  });
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
