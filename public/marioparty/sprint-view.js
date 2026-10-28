// Beeld van de sprint: 3D-scène (wereld, baan, lopers, camera) met daarboven een
// 2D-canvas voor deeltjes en namen. Vervangt het oude platte sprint-draw.js.
import * as THREE from './vendor/three.module.min.js';
import { createWorld, disposeScene } from './sprint-world.js';
import { buildTrack, laneZ, TRACK_LEN } from './sprint-track.js';
import { createRunner3d, updateRunner3d, preloadStrips, RUNNER_H } from './sprint-runner3d.js';
import { createDirector, updateDirector } from './sprint-camera.js';
import { drawParticles3d } from './sprint-particles.js';
import { buildCrowd, updateCrowd } from './sprint-crowd.js';
import { buildDecor } from './sprint-decor.js';
import { speedLines, flash, playerMarker, edgeArrow } from './sprint-fx.js';
import { speedFraction } from './sprint-momentum.js';

const tmp = new THREE.Vector3();
// zo lang blijft de camera op de eerste finisher
const FOCUS_MS = 2400;
// het overlay tekent in een vaste logische maat van 960×540 en wordt geschaald naar de
// echte schermresolutie, zodat het overal even groot en scherp is
const OVERLAY_W = 960;
const OVERLAY_H = 540;

export function createView(overlay, canvas3d, players, runners) {
  const world = createWorld(canvas3d, TRACK_LEN);
  const { width } = buildTrack(world.scene, players.length);
  buildDecor(world.scene, width);
  const crowd = buildCrowd(world.scene, width);
  const meshes = runners.map((r) => createRunner3d(world.scene, r.sprite));
  // alle strips die tijdens de race nodig zijn alvast naar de GPU
  preloadStrips(world.renderer, runners.map((r) => r.sprite), ['idle', 'run', 'cheer', 'sad']);
  preloadStrips(world.renderer, [crowd.fans[0].sprite], ['idle', 'cheer', 'clap', 'jump']);
  const view = { world, overlay, players, meshes, crowd, director: createDirector(world.camera) };
  view.onResize = () => resizeView(view);
  window.addEventListener('resize', view.onResize);
  resizeView(view);
  return view;
}

function resizeView(view) {
  view.world.resize();
  const { overlay } = view;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  overlay.width = Math.max(1, Math.round(overlay.clientWidth * dpr));
  overlay.height = Math.max(1, Math.round(overlay.clientHeight * dpr));
}

export function laneOf(view, i) {
  return laneZ(i, view.players.length);
}

// wereldpunt → pixel op het overlay-canvas
export function toScreen(view, x, y, z) {
  tmp.set(x, y, z).project(view.world.camera);
  return { x: (tmp.x + 1) / 2 * OVERLAY_W, y: (1 - tmp.y) / 2 * OVERLAY_H, behind: tmp.z > 1 };
}

export function drawLabel(ctx, text, x, y, size) {
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
  const humans = race.players.map((p, i) => (p.control === 'CPU' ? null : race.runners[i].x)).filter((x) => x !== null);
  const turbo = race.players.some((p, i) => p.control !== 'CPU' && race.runners[i].momentum.turbo);
  return { mode: 'follow', xs: race.runners.map((r) => r.x), humans, turbo };
}

// race: runners met x (wereld) en lift; shot voor de camera; labels tijdens het aftellen
export function renderView(view, race, dt, shot) {
  updateDirector(view.director, dt, shot, race.shake * 0.02);
  race.runners.forEach((r, i) => updateRunner3d(view.meshes[i], r.x, laneOf(view, i), view.world.camera, {
    lean: race.phase === 'running' && r.finishTime === undefined ? speedFraction(r.momentum) : 0,
  }));
  const mood = race.phase === 'countdown' ? 'wait' : race.firstFinish !== null ? 'finish' : 'race';
  updateCrowd(view.crowd, dt, mood, view.world.camera, Math.max(...race.runners.map((r) => r.x)));
  view.world.renderer.render(view.world.scene, view.world.camera);

  const ctx = view.overlay.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, view.overlay.width, view.overlay.height);
  ctx.setTransform(view.overlay.width / OVERLAY_W, 0, 0, view.overlay.height / OVERLAY_H, 0, 0);
  race.runners.forEach((r, i) => {
    if (!r.momentum.turbo || r.finishTime !== undefined) return;
    const feet = toScreen(view, r.x, 0, laneOf(view, i));
    const head = toScreen(view, r.x, RUNNER_H, laneOf(view, i));
    speedLines(ctx, feet.x, feet.y, feet.y - head.y, race.time);
  });
  drawParticles3d(ctx, race.particles, (x, y, z) => toScreen(view, x, y, z));
  flash(ctx, OVERLAY_W, OVERLAY_H, race.flash || 0);
  drawNames(view, ctx, race);
}

// tijdens het aftellen alle namen; daarna een vaste markering boven de eigen loper(s),
// met een pijl aan de rand als je buiten beeld bent
function drawNames(view, ctx, race) {
  race.runners.forEach((r, i) => {
    const player = view.players[i];
    // dicht bij de camera zou een grote marge de markering ver boven het hoofd zetten
    const p = toScreen(view, r.x, RUNNER_H + 0.15, laneOf(view, i));
    if (race.phase === 'countdown') {
      if (!p.behind) drawLabel(ctx, player.character.name, p.x, p.y, 16);
      return;
    }
    if (player.control === 'CPU') return;
    const tag = player.control.replace('Speler ', 'P');
    if (p.x < 0 || p.x > OVERLAY_W) edgeArrow(ctx, p.x < 0 ? 'left' : 'right', Math.min(OVERLAY_H - 40, Math.max(40, p.y + 60)), OVERLAY_W, tag, player.character.color);
    else playerMarker(ctx, p.x, p.y, tag, player.character.color);
  });
}

export function disposeView(view) {
  window.removeEventListener('resize', view.onResize);
  disposeScene(view.world.scene);
}
