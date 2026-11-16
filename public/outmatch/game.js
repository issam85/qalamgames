// Spelverloop: startscherm, de wedstrijd (3 tegen 3), blessuretijd, penalty's en het eindscherm.
import { createMatch, resetMatch, stepMatch } from './rules.js';
import { createInput } from './input.js';
import { createView } from './view.js';
import { updateHud, showGoal, showToast } from './hud.js';
import { showStart, showEnd } from './screens.js';

const match = createMatch();
const input = createInput();
const view = createView(document.getElementById('view'), match);
const humans = match.players.filter((p) => !p.cpu).map((p) => p.id);
let last = performance.now();

function start() {
  resetMatch(match);
  showToast('Aftrap!');
}

const PENALTY_TEXT = { goal: 'Raak!', save: 'Gestopt!', mis: 'Mis!' };

function onEvent(e) {
  if (e.type === 'goal') showGoal(e.team === 0 ? 'GOAL!' : 'Tegengoal…');
  else if (e.type === 'save') showToast(e.caught ? 'Gevangen!' : 'Gered!');
  else if (e.type === 'injury') showToast(`+${e.extra} seconden blessuretijd`, 1800);
  else if (e.type === 'shootout') showToast("Gelijk! Penalty's", 1800);
  else if (e.type === 'penalty') showToast(PENALTY_TEXT[e.result]);
  else if (e.type === 'fulltime') setTimeout(() => showEnd(match, start), e.shootout ? 600 : 1200);
}

// requestAnimationFrame geeft in de browser van de app geen tijd mee: zelf meten
function frame() {
  const now = performance.now();
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  stepMatch(match, input.intents(humans), dt);
  match.events.forEach(onEvent);
  view.draw(dt);
  updateHud(match);
  requestAnimationFrame(frame);
}

showStart(start);
requestAnimationFrame(frame);
