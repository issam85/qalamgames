// Beeld van de sprint: 3D-scène (wereld, baan, lopers, camera) met daarboven een
// 2D-canvas voor deeltjes en namen. Vervangt het oude platte sprint-draw.js.
import * as THREE from './vendor/three.module.min.js';
import { createWorld } from './sprint-world.js';
import { buildTrack, laneZ, TRACK_LEN } from './sprint-track.js';
import { createRunner3d, updateRunner3d, RUNNER_H } from './sprint-runner3d.js';
import { createDirector, updateDirector } from './sprint-camera.js';
import { drawParticles } from './effects.js';

const tmp = new THREE.Vector3();
// zo lang blijft de camera op de eerste finisher
const FOCUS_MS = 2400;

export function createView(overlay, canvas3d, players, runners) {
  const world = createWorld(canvas3d, TRACK_LEN);
  buildTrack(world.scene, players.length);
  const meshes = runners.map((r) => createRunner3d(world.scene, r.sprite));
  const view = { world, overlay, players, meshes, director: createDirector(world.camera), dpr: 1 };
  view.onResize = () => resizeView(view);
  window.addEventListener('resize', view.onResize);
  resizeView(view);
  return view;
}

function resizeView(view) {
  view.world.resize();
  const { overlay } = view;
  view.dpr = Math.min(2, window.devicePixelRatio || 1);
  overlay.width = Math.round(overlay.clientWidth * view.dpr);
  overlay.height = Math.round(overlay.clientHeight * view.dpr);
}

export function laneOf(view, i) {
  return laneZ(i, view.players.length);
}

// wereldpunt → pixel op het overlay-canvas
export function toScreen(view, x, y, z) {
  tmp.set(x, y, z).project(view.world.camera);
  return { x: (tmp.x + 1) / 2 * view.overlay.width, y: (1 - tmp.y) / 2 * view.overlay.height, behind: tmp.z > 1 };
}

// schaal van het overlay ten opzichte van de oude 800 px brede baan (voor deeltjesgrootte)
export function pxScale(view) {
  return view.overlay.width / 800;
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
  view.world.renderer.render(view.world.scene, view.world.camera);

  const ctx = view.overlay.getContext('2d');
  ctx.clearRect(0, 0, view.overlay.width, view.overlay.height);
  drawParticles(ctx, race.particles);
  if (race.phase === 'countdown') {
    race.runners.forEach((r, i) => {
      const p = toScreen(view, r.x, RUNNER_H + 0.5, laneOf(view, i));
      if (!p.behind) drawLabel(ctx, view.players[i].character.name, p.x, p.y, 15 * view.dpr);
    });
  }
}

export function disposeView(view) {
  window.removeEventListener('resize', view.onResize);
  view.world.renderer.dispose();
}
