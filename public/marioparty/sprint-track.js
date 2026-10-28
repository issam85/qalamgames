// De atletiekbaan: blauw asfalt met witte banen, start, finish, randstenen en gras.
// Wereldassen: X = langs de baan (start 0, finish TRACK_LEN), Z = naar de camera toe.
import * as THREE from './vendor/three.module.min.js';
import { canvasTexture } from './sprint-tex.js';

export const TRACK_LEN = 60;
export const LANE_W = 2.4;
const RUNUP = 10;
const PX = 24; // pixels per wereldeenheid in de baantextuur

// baan i (0 = dichtst bij de camera) → Z-positie van het midden van de baan
export function laneZ(i, lanes) {
  return ((lanes - 1) / 2 - i) * LANE_W;
}

// korrelig oppervlak, zodat het niet als een plat vlak oogt
function speckle(ctx, w, h, n, colors) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
}

function trackTexture(lanes) {
  const len = TRACK_LEN + RUNUP * 2;
  const c = document.createElement('canvas');
  c.width = len * PX;
  c.height = lanes * LANE_W * PX;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#5876a8';
  ctx.fillRect(0, 0, c.width, c.height);
  speckle(ctx, c.width, c.height, c.width * 6, ['#4f6c9d', '#6683b4', '#5a78aa']);
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  for (let i = 0; i <= lanes; i++) ctx.fillRect(0, i * LANE_W * PX - 3, c.width, 6);
  ctx.fillRect(RUNUP * PX - 4, 0, 8, c.height);
  const fx = (RUNUP + TRACK_LEN) * PX;
  const sq = (LANE_W * PX) / 4;
  for (let row = 0; row < lanes * 4; row++) {
    for (let col = 0; col < 3; col++) {
      ctx.fillStyle = (row + col) % 2 ? '#1d1d1d' : '#ffffff';
      ctx.fillRect(fx + col * sq, row * sq, sq, sq);
    }
  }
  return canvasTexture(c);
}

function checkerTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 32;
  const ctx = c.getContext('2d');
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 2; y++) {
      ctx.fillStyle = (x + y) % 2 ? '#1d1d1d' : '#ffffff';
      ctx.fillRect(x * 16, y * 16, 16, 16);
    }
  }
  return canvasTexture(c);
}

function curbTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 32;
  const ctx = c.getContext('2d');
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 ? '#f4f4f4' : '#d84343';
    ctx.fillRect(i * 64, 0, 64, 32);
  }
  return canvasTexture(c, (TRACK_LEN + RUNUP * 4) / 4);
}

function grassTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#6fbf4a';
  ctx.fillRect(0, 0, 256, 256);
  speckle(ctx, 256, 256, 2500, ['#62b13f', '#7cca55', '#5aa63a']);
  const tex = canvasTexture(c, 40);
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(40, 20);
  return tex;
}

function flagPole(x, z) {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.2, 8), new THREE.MeshLambertMaterial({ color: '#eeeeee' }));
  pole.position.set(0, 2.1, 0);
  group.add(pole);
  group.position.set(x, 0, z);
  return group;
}

export function buildTrack(scene, lanes) {
  const width = lanes * LANE_W;
  const len = TRACK_LEN + RUNUP * 2;
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), new THREE.MeshLambertMaterial({ map: grassTexture() }));
  grass.rotation.x = -Math.PI / 2;
  grass.position.set(TRACK_LEN / 2, -0.02, -30);
  scene.add(grass);

  const track = new THREE.Mesh(new THREE.PlaneGeometry(len, width), new THREE.MeshLambertMaterial({ map: trackTexture(lanes) }));
  track.rotation.x = -Math.PI / 2;
  track.position.set(TRACK_LEN / 2, 0, 0);
  scene.add(track);

  // rood-witte randstenen voor en achter de baan
  const curbGeo = new THREE.BoxGeometry(TRACK_LEN + RUNUP * 4, 0.18, 0.7);
  [width / 2 + 0.35, -width / 2 - 0.35].forEach((z) => {
    const curb = new THREE.Mesh(curbGeo, new THREE.MeshLambertMaterial({ map: curbTexture() }));
    curb.position.set(TRACK_LEN / 2, 0.09, z);
    scene.add(curb);
  });

  // finishpalen met een geruit spandoek erboven
  const fx = TRACK_LEN + 0.6;
  const banner = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.9, width + 1.6), new THREE.MeshLambertMaterial({ map: checkerTexture() }));
  banner.position.set(fx, 4.2, 0);
  scene.add(flagPole(fx, width / 2 + 0.8), flagPole(fx, -width / 2 - 0.8), banner);
  return { width };
}
