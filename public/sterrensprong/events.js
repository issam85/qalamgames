// Wat er in de spelregels gebeurde, omzetten in beeld.
import { showToast } from './toast.js';
import { HANDS } from './hint.js';
import { PORTAL_COLORS } from './portals3d.js';
import { TONE_COLORS } from './lamps3d.js';

// bij een poort: een handje dat laat zien wat je nu doet, met een kort woord
const PORTAL_TEXT = {
  fly: ['Vasthouden = omhoog', HANDS.hold],
  flip: ['Tik = naar beneden', HANDS.down],
  run: ['Weer lopen', HANDS.tap],
};

export function playEvents(run, fx, world) {
  run.events.forEach((e) => {
    if (e.type === 'land') fx.dust(e.x, e.y);
    if (e.type === 'zone') showToast(e.title);
    if (e.type === 'portal') {
      fx.burst(e.x, e.y + 0.45, PORTAL_COLORS[e.mode], 22, 8);
      world.kick(0.14);
      showToast(...PORTAL_TEXT[e.mode], true);
    }
    if (e.type === 'lamp') {
      fx.burst(e.x, e.y + 0.45, TONE_COLORS[e.tone], 20, 7);
      world.kick(0.1);
    }
    if (e.type === 'boost') {
      fx.burst(e.x, e.y + 0.45, e.kind === 'ring' ? '#5cf2d6' : '#ffd43b', 18, 8);
      world.kick(0.16);
    }
  });
  run.events.length = 0;
}
