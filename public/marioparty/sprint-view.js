// Beeld van de sprint: 3D-scène (wereld, baan, lopers, camera) met daarboven een
// 2D-canvas voor deeltjes en namen. Vervangt het oude platte sprint-draw.js.
import * as THREE from './vendor/three.module.min.js';
import { createWorld } from './sprint-world.js';
import { buildTrack, laneZ, TRACK_LEN } from './sprint-track.js';
import { createRunner3d, updateRunner3d, RUNNER_H } from './sprint-runner3d.js';
import { createDirector, updateDirector } from './sprint-camera.js';
import { drawParticles } from './effects.js';
import { buildCrowd, updateCrowd } from './sprint-crowd.js';
import { buildDecor } from './sprint-decor.js';
import { speedLines, flash } from './sprint-fx.js';

const tmp = new THREE.Vector3();
// zo lang blijft de camera op de eerste finisher
const FOCUS_MS = 2400;
// vaste interne resolutie van het overlay (deeltjes zijn hierop afgestemd)
const OVERLAY_W = 960;
const OVERLAY_H = 540;

export function createView(overlay, canvas3d, players, runners) {
  const world = createWorld(canvas3d, TRACK_LEN);
  const { width } = buildTrack(world.scene, players.length);
  buildDecor(world.scene, width);
  const crowd = buildCrowd(world.scene, width);
  const meshes = runners.map((r) => createRunner3d(world.scene, r.sprite));
  const view = { world, overlay, players, meshes, crowd, director: createDirector(world.camera), cssScale: 1 };
  view.onResize = () => resizeView(view);
  window.addEventListener('resize', view.onResize);
  resizeView(view);
  return view;
}

function resizeView(view) {
  view.world.resize();
  const { overlay } = view;
  overlay.width = OVERLAY_W;
  overlay.height = OVERLAY_H;
  view.cssScale = OVERLAY_W / Math.max(1, overlay.clientWidth);
}

export function laneOf(view, i) {
  return laneZ(i, view.players.length);
}

// wereldpunt → pixel op het overlay-canvas
export function toScreen(view, x, y, z) {
  tmp.set(x, y, z).project(view.world.camera);
  return { x: (tmp.x + 1) / 2 * view.overlay.width, y: (1 - tmp.y) / 2 * view.overlay.height, behind: tmp.z > 1 };
}

function drawLabel(ctx, text, x, y, size) {
  ctx.font = `700 ${size}px Fredoka, sans-serif`;
  ctx.textAlign = 'center';
  ctx.lineWidth = size / 3;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = '#fff';
  ctx.fillText(text, x, y);
}

// welk camerashot: openingsshot, de winnaar bij de finish, of de kopgroep volgen
export function shotFor(race, now, introT) {
  if (race.phase === 'countdown') return { mode: 'intro', t: introT };
  if (race.focus !== null && now - race.firstFinish < FOCUS_MS) {
    return { mode: 'finish', x: race.runners[race.focus].x, z: laneOf(race.view, race.focus) };
  }
  return { mode: 'follow', xs: race.runners.map((r) => r.x) };
}

// race: runners met x (wereld) en lift; shot voor de camera; labels tijdens het aftellen
export function renderView(view, race, dt, shot) {
  updateDirector(view.director, dt, shot, race.shake * 0.02);
  race.runners.forEach((r, i) => updateRunner3d(view.meshes[i], r.x, laneOf(view, i), view.world.camera, r.lift || 0));
  const mood = race.phase === 'countdown' ? 'wait' : race.firstFinish !== null ? 'finish' : 'race';
  updateCrowd(view.crowd, dt, mood, view.world.camera);
  view.world.renderer.render(view.world.scene, view.world.camera);

  const ctx = view.overlay.getContext('2d');
  ctx.clearRect(0, 0, OVERLAY_W, OVERLAY_H);
  race.runners.forEach((r, i) => {
    if (!r.momentum.turbo || r.finishTime !== undefined) return;
    const feet = toScreen(view, r.x, 0, laneOf(view, i));
    const head = toScreen(view, r.x, RUNNER_H, laneOf(view, i));
    speedLines(ctx, feet.x, feet.y, feet.y - head.y, race.time);
  });
  drawParticles(ctx, race.particles);
  flash(ctx, OVERLAY_W, OVERLAY_H, race.flash || 0);
  if (race.phase === 'countdown') {
    race.runners.forEach((r, i) => {
      const p = toScreen(view, r.x, RUNNER_H + 0.5, laneOf(view, i));
      if (!p.behind) drawLabel(ctx, view.players[i].character.name, p.x, p.y, 16 * view.cssScale);
    });
  }
}

export function disposeView(view) {
  window.removeEventListener('resize', view.onResize);
  view.world.renderer.dispose();
}
