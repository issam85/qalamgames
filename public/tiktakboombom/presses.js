// Doorgeven met een toets of een tik: wie drukt er, en een kring op het veld
// (spelerskleur als het telt, grijs als het niet jouw beurt is).
import { press } from './game.js';

// o: getGame(), getHumans(), playing(), scene, fx, canvas
export function createPresses(o) {
  function pressAt(who, x, y) {
    const game = o.getGame();
    const ok = press(game, who);
    const player = game.players.find((p) => p.human === who);
    o.fx.ripple(x, y, ok ? player.color : '#9e9e9e');
  }

  function onKey(who) {
    const i = o.getGame().players.findIndex((p) => p.human === who && !p.out);
    if (i < 0) return;
    const p = o.scene.pos(i);
    pressAt(who, p.x, p.y);
  }

  // Tik op het scherm: omrekenen naar het veld en de dichtstbijzijnde speler zoeken.
  // Met één speler telt elke tik.
  function onTap(clientX, clientY) {
    if (!o.playing()) return;
    const box = o.canvas.getBoundingClientRect();
    const k = o.scene.view.w / box.width;
    const x = (clientX - box.left) * k;
    const y = (clientY - box.top) * k;
    const who = o.getHumans() === 1 ? 0 : o.scene.nearestHuman(o.getGame(), x, y);
    if (who >= 0) pressAt(who, x, y);
  }

  return { onKey, onTap };
}
