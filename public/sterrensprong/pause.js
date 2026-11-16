// Pauze (knop linksboven, Escape of het tabblad weg) en de ▶-knop van het eindscherm.
import { WORLDS } from './levels.js';
import { showPause, hideOverlay } from './hud.js';
import { RESPAWN_PAUSE } from './round.js';

const $ = (id) => document.getElementById(id);

export function createPause(g, { input, tries, play, backToMenu, loadLevel }) {
  function pauseGame() {
    if (!['run', 'wait', 'dead'].includes(g.mode)) return;
    g.resumeTo = g.mode;
    g.mode = 'paused';
    showPause();
  }

  function resume() {
    hideOverlay();
    input.requireRelease();
    input.takePress();
    g.mode = g.resumeTo === 'run' ? 'wait' : g.resumeTo;
    if (g.resumeTo === 'run') g.pause = RESPAWN_PAUSE; // eerst even klaarstaan
  }

  // ▶ in de pauze of op het eindscherm (ook met spatie)
  function goOn() {
    if (g.mode === 'paused') return resume();
    if (g.mode !== 'won' || g.pause > 0) return undefined;
    if (tries.practice) return play(false); // oefenen gehaald: nu echt, vanaf de gouden checkpoints
    if (g.worldIndex === WORLDS.length - 1) return backToMenu();
    loadLevel(g.worldIndex + 1);
    return play(false);
  }

  $('pause').addEventListener('click', pauseGame);
  $('overlay-go').addEventListener('click', goOn);
  $('overlay-menu').addEventListener('click', backToMenu);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseGame();
  });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') pauseGame();
  });
  return { goOn };
}
