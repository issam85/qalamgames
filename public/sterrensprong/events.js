// Wat er in de spelregels gebeurde, omzetten in beeld.
import { showToast } from './hud.js';
import { PORTAL_COLORS } from './portals3d.js';

const PORTAL_TEXT = {
  fly: 'Vliegen: vasthouden = omhoog!',
  flip: 'Ondersteboven! Springen gaat naar beneden',
  run: 'Weer lopen!',
};

export function playEvents(run, fx, world) {
  run.events.forEach((e) => {
    if (e.type === 'land') fx.dust(e.x, e.y);
    if (e.type === 'zone') showToast(e.title);
    if (e.type === 'portal') {
      fx.burst(e.x, e.y + 0.45, PORTAL_COLORS[e.mode], 22, 8);
      world.kick(0.14);
      showToast(PORTAL_TEXT[e.mode]);
    }
    if (e.type === 'boost') {
      fx.burst(e.x, e.y + 0.45, e.kind === 'ring' ? '#5cf2d6' : '#ffd43b', 18, 8);
      world.kick(0.16);
    }
  });
  run.events.length = 0;
}
