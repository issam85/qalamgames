// Minigame 3: Sterrenjacht. Sterren vallen uit de nachthemel; loop links en rechts om
// ze te vangen, spring voor de hoge. Gewone ster 1 punt, grote ster 3; gevangen tijdens
// een salto telt dubbel. Na 30 seconden wint wie de meeste punten heeft.
import { update as updateSprite, play } from './sprites.js';
import { createMoveInput } from './sterren-input.js';
import { createJumpInput } from './jump-input.js';
import { setupStage, statusSetter } from './stage2d.js';
import { pushPopup, updatePopups } from './fx2d.js';
import { createHunter, spawnStar, stepHunters, stepStars, jump, trick, SPAWN_EVERY, GROUND } from './sterren-world.js';
import { drawSterren, makeSky } from './sterren-draw.js';

export const STAR_LABELS = { 'Speler 1': 'A / D lopen, SPATIE springen', 'Speler 2': '← / → lopen, PIJL OMHOOG springen' };
// tikken in het bovenste deel van het veld = springen, eronder = lopen
const JUMP_ZONE = 0.45;

const COUNTDOWN_MS = 3000;
const DURATION = 30; // seconden spelen
const END_MS = 2200; // zo lang blijft "Klaar!" staan

let game = null;

function finish() {
  game.phase = 'done';
  game.setStatus('Klaar!');
  // gelijke stand: wie zijn punten het eerst had, staat hoger
  const ranking = [...game.hunters].sort((a, b) => b.score - a.score || a.lastCatch - b.lastCatch);
  ranking.forEach((h, place) => play(h.sprite, place < 2 ? 'cheer' : 'sad'));
  game.ranking = ranking.map((h) => h.player);
}

function step(dt) {
  game.left = Math.max(0, DURATION - game.clock);
  game.clock += dt;
  game.spawnIn -= dt;
  if (game.spawnIn <= 0 && game.left > 1.5) {
    spawnStar(game.stars, game.clock, game.spawned);
    game.spawned += 1;
    game.spawnIn = SPAWN_EVERY;
  }
  stepHunters(game.hunters, game.stars, game.input, dt);
  const { caught } = stepStars(game.stars, game.hunters, dt, game.clock);
  caught.forEach(({ star, points }) => pushPopup(game.popups, `+${points}`, star.x, GROUND - 120));
  if (game.left <= 0) finish();
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
    if (elapsed > COUNTDOWN_MS + 900) game.setStatus('');
    step(dt);
    if (game.phase === 'done') game.doneAt = now;
  } else if (now - game.doneAt > END_MS && game.ranking) {
    const { ranking } = game;
    game.ranking = null;
    game.onFinish(ranking);
  }
  game.hunters.forEach((h) => updateSprite(h.sprite, dt));
  updatePopups(game.popups, dt);
  game.stage.begin();
  drawSterren(game.stage.ctx, game);
  game.raf = requestAnimationFrame(frame);
}

export function startSterren(canvas, statusEl, players, onFinish) {
  stopSterren();
  game = {
    players, onFinish,
    hunters: players.map(createHunter),
    stars: [],
    popups: [],
    sky: makeSky(),
    spawnIn: 0.6,
    spawned: 0,
    left: DURATION,
    ranking: null,
    doneAt: 0,
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
  const stage = document.getElementById('stage');
  game.input = createMoveInput(players, stage, JUMP_ZONE);
  game.input.attach();
  game.jumpInput = createJumpInput(players, stage, {
    jump: (idx) => jump(game.hunters[idx]),
    trick: (idx) => { if (trick(game.hunters[idx])) pushPopup(game.popups, 'Salto!', game.hunters[idx].x, GROUND - 200); },
    canPress: () => game && game.phase === 'running',
    inAir: (idx) => game.hunters[idx].jumpT >= 0,
    topZone: JUMP_ZONE,
  });
  game.jumpInput.attach();
  game.raf = requestAnimationFrame(frame);
}

export function stopSterren() {
  if (!game) return;
  cancelAnimationFrame(game.raf);
  game.input.detach();
  game.jumpInput.detach();
  game.stage.dispose();
  game = null;
}
