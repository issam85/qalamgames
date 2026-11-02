// Minigame 3: Sterrenjacht. Sterren vallen uit de nachthemel; loop links en rechts om
// ze te vangen. Gewone ster 1 punt, grote ster 3. Na 30 seconden wint wie de meeste
// punten heeft.
import { update as updateSprite, play } from './sprites.js';
import { createMoveInput } from './sterren-input.js';
import { setupStage, statusSetter } from './stage2d.js';
import { createHunter, spawnStar, stepHunters, stepStars, SPAWN_EVERY, GROUND } from './sterren-world.js';
import { drawSterren, makeSky } from './sterren-draw.js';

export { MOVE_LABELS } from './sterren-input.js';

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
  caught.forEach(({ star }) => {
    game.popups.push({ text: `+${star.worth}`, x: star.x, y: GROUND - 120, age: 0, life: 0.9 });
  });
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
  for (let i = game.popups.length - 1; i >= 0; i--) {
    game.popups[i].age += dt;
    if (game.popups[i].age >= game.popups[i].life) game.popups.splice(i, 1);
  }
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
  game.input = createMoveInput(players, document.getElementById('stage'));
  game.input.attach();
  game.raf = requestAnimationFrame(frame);
}

export function stopSterren() {
  if (!game) return;
  cancelAnimationFrame(game.raf);
  game.input.detach();
  game.stage.dispose();
  game = null;
}
