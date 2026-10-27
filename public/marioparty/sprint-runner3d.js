// Een karakter in de 3D-sprint: de bestaande sprite-strip op een vlak dat met de
// voeten op de grond staat en om de verticale as naar de camera draait.
import * as THREE from './vendor/three.module.min.js';
import { getImage } from './assets.js';
import { frameOf } from './sprites.js';

// staande hoogte van een karakter in wereldeenheden
export const RUNNER_H = 2.3;
let shadowTex = null;

function blobShadow() {
  if (shadowTex) return shadowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
  g.addColorStop(0, 'rgba(0,0,0,0.45)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  shadowTex = new THREE.CanvasTexture(c);
  return shadowTex;
}

// per animatie een eigen textuur (de strip), met repeat/offset op het huidige frame
function textureFor(cache, url, frames) {
  if (!cache.has(url)) {
    const tex = new THREE.Texture(getImage(url));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.repeat.x = 1 / frames;
    tex.needsUpdate = true;
    cache.set(url, tex);
  }
  return cache.get(url);
}

export function createRunner3d(scene, sprite) {
  const info = frameOf(sprite);
  const { m } = info;
  const s = RUNNER_H / info.stand;
  const w = m.frameW * s;
  const h = m.frameH * s;
  const geo = new THREE.PlaneGeometry(w, h);
  // verschuif het vlak zodat het voetpunt van de sprite in de oorsprong ligt
  geo.translate(w / 2 - (m.footX / m.frameW) * w, (m.footY / m.frameH) * h - h / 2, 0);
  const mat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.35, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(RUNNER_H * 0.75, RUNNER_H * 0.3),
    new THREE.MeshBasicMaterial({ map: blobShadow(), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow, mesh);
  return { mesh, shadow, sprite, cache: new Map() };
}

// zet frame, positie en draaiing; lift = hoogte boven de grond (sprongetje)
export function updateRunner3d(r, x, z, camera, lift = 0) {
  const info = frameOf(r.sprite);
  const tex = textureFor(r.cache, info.url, info.frames);
  tex.offset.x = info.index / info.frames;
  if (r.mesh.material.map !== tex) {
    r.mesh.material.map = tex;
    r.mesh.material.needsUpdate = true;
  }
  r.mesh.position.set(x, lift, z);
  r.mesh.rotation.y = Math.atan2(camera.position.x - x, camera.position.z - z);
  r.shadow.position.set(x + 0.1, 0.03, z);
  const scale = 1 - Math.min(0.4, lift * 0.3);
  r.shadow.scale.set(scale, scale, 1);
}
