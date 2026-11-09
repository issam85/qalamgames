// Wat er in de spelregels gebeurde, omzetten in beeld.
import { showToast } from './hud.js';

export function playEvents(run, fx, world) {
  run.events.forEach((e) => {
    if (e.type === 'land') fx.dust(e.x, e.y);
    if (e.type === 'zone') showToast(e.title);
    if (e.type === 'boost') {
      fx.burst(e.x, e.y + 0.45, e.kind === 'ring' ? '#5cf2d6' : '#ffd43b', 18, 8);
      world.kick(0.16);
    }
  });
  run.events.length = 0;
}
