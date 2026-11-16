// Spelverloop: één speler tegen de keepers; lopen, sprinten, schieten, passen, lobben, tackelen.
import { createMatch, kickOff, stepMatch } from './rules.js';
import { createInput } from './input.js';
import { createView } from './view.js';
import { updateHud, showGoal, showToast } from './hud.js';

const match = createMatch();
kickOff(match);
const input = createInput();
const view = createView(document.getElementById('view'), match);
const humans = match.players.map((p) => p.id);
let last = performance.now();

// requestAnimationFrame geeft in de browser van de app geen tijd mee: zelf meten
function frame() {
  const now = performance.now();
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  stepMatch(match, input.intents(humans), dt);
  match.events.forEach((e) => {
    if (e.type === 'goal') showGoal(e.team);
    if (e.type === 'save') showToast(e.caught ? 'Gevangen!' : 'Gered!');
  });
  view.draw(dt);
  updateHud(match);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
