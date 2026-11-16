// Eén poging: rekenen, botsen en terugkomen, checkpoints en de finish.
import { PHYS, DEATH_PAUSE } from './config.js';
import { WORLDS } from './levels.js';
import { stepRun } from './physics.js';
import { recordPercent, completeWorld } from './progress.js';
import { percentOf, showWorldDone, flash } from './hud.js';
import { showToast } from './toast.js';
import { ICONS, starWith } from './icons.js';

const WIN_PAUSE = 1.5; // eerst even kijken; daarna werken de knoppen
export const RESPAWN_PAUSE = 0.7; // even klaarstaan op het checkpoint

// g = de toestand van het spel (game.js): mode, pause, level, run, worldIndex, spare
export function createRound(g, { input, view, tries, progress, clearRun }) {
  function finishWorld() {
    g.mode = 'won';
    g.pause = WIN_PAUSE;
    if (!tries.practice) completeWorld(progress, g.level, g.worldIndex, WORLDS.length, tries.count);
    showWorldDone(g.level, WORLDS[g.worldIndex + 1], tries.practice, tries.count);
  }

  function crash() {
    g.mode = 'dead';
    g.pause = DEATH_PAUSE;
    view.crash(g.run);
    flash();
    const percent = percentOf(g.run);
    if (!tries.practice && recordPercent(progress, g.level, percent)) showToast('Nieuw record', starWith(percent));
  }

  function afterCrash() {
    tries.respawn();
    clearRun();
    showToast(`Poging ${tries.count}`, '', true); // na elke botsing: de hoeveelste keer
    g.mode = tries.reached < 0 ? 'run' : 'wait';
    g.pause = RESPAWN_PAUSE;
  }

  function passCheckpoint() {
    if (!tries.pass(g.run.x)) return;
    view.checkpoint(g.run);
    if (!tries.practice) showToast('Checkpoint', ICONS.gold, true);
  }

  function simulate(dt) {
    const { run } = g;
    g.spare += dt;
    let pressed = input.takePress();
    while (g.spare >= PHYS.step && run.state === 'run') {
      stepRun(run, input.held(), pressed);
      pressed = false;
      g.spare -= PHYS.step;
    }
    view.events(run);
    if (run.state === 'dead') crash();
    else if (run.state === 'won') finishWorld();
    else {
      passCheckpoint();
      view.trail(run, dt);
    }
  }

  return { simulate, afterCrash };
}
