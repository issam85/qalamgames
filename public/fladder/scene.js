// Alles samen tekenen: lucht, stad, kaastorens, musje, effecten en de score.
import { PALETTES, mixPalette, drawSky } from './sky.js';
import { drawSkyline, drawGround } from './skyline.js';
import { drawTower } from './cheese.js';
import { drawBird } from './bird.js';
import { drawFx } from './fx.js';
import { PHASE_EVERY } from './config.js';

const FADE = 1.5; // seconden om naar een nieuwe lucht te gaan

export function createSky() {
  return { from: 0, to: 0, t: 1 };
}

// Na elke PHASE_EVERY punten schuift de lucht door: avond → nacht → ochtend → avond.
export function updateSky(sky, score, dt) {
  const want = Math.floor(score / PHASE_EVERY) % PALETTES.length;
  if (want !== sky.to) {
    sky.from = sky.to;
    sky.to = want;
    sky.t = 0;
  }
  sky.t = Math.min(1, sky.t + dt / FADE);
}

function outlined(ctx, text, x, y, size) {
  ctx.font = `700 ${size}px Fredoka, Nunito, sans-serif`;
  ctx.textAlign = 'center';
  ctx.lineJoin = 'round';
  ctx.lineWidth = size / 6;
  ctx.strokeStyle = '#27324a';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = '#fff';
  ctx.fillText(text, x, y);
}

export function drawScene(ctx, world, fx, sky, hint = true) {
  const { w, h, ground, time, dist } = world;
  const pal = mixPalette(PALETTES[sky.from], PALETTES[sky.to], sky.t);
  ctx.save();
  if (fx.shake > 0) ctx.translate((Math.random() - 0.5) * 12 * fx.shake, (Math.random() - 0.5) * 12 * fx.shake);
  drawSky(ctx, w, h, pal, time, dist);
  drawSkyline(ctx, w, ground, pal, time, dist);
  for (const t of world.towers) drawTower(ctx, t, ground, pal.night);
  drawGround(ctx, w, h, ground, dist, pal.night);
  drawBird(ctx, world);
  drawFx(ctx, fx);
  ctx.restore();
  if (world.state === 'ready') {
    if (!hint) return;
    const pulse = 1 + Math.sin(time * 5) * 0.04;
    outlined(ctx, 'Klaar?', w / 2, h * 0.24, 54 * pulse);
    outlined(ctx, 'Tik of druk op spatie om te fladderen', w / 2, h * 0.24 + 44, Math.min(26, w / 19));
  } else {
    outlined(ctx, String(world.score), w / 2, 78, 64);
  }
  if (fx.flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${fx.flash * 0.7})`;
    ctx.fillRect(0, 0, w, h);
  }
}
