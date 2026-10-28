// Een karakter in de 3D-sprint: de bestaande sprite-strip op een vlak dat met de
// voeten op de grond staat en om de verticale as naar de camera draait.
import * as THREE from './vendor/three.module.min.js';
import { getImage } from './assets.js';
import { frameOf } from './sprites.js';

// staande hoogte van een karakter in wereldeenheden
export const RUNNER_H = 2.3;
let shadowTex = null;
// één basistextuur per strip voor het hele spel; figuren krijgen een kloon met dezelfde
// bron, zodat elke strip maar één keer naar de GPU gaat (alleen het frame verschilt)
const bases = new Map();

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
  shadowTex.userData.keep = true;
  return shadowTex;
}

function baseTexture(url, frames) {
  if (!bases.has(url)) {
    const tex = new THREE.Texture(getImage(url));
    tex.colorSpace = THREE.SRGBColorSpace;
    // geen mipmaps: scheelt geheugen en voorkomt randjes van het buurframe
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.repeat.x = 1 / frames;
    tex.needsUpdate = true;
    tex.userData.keep = true;
    bases.set(url, tex);
  }
  return bases.get(url);
}

// laadt strips alvast naar de GPU, zodat er bij GO en de finish niets hapert
export function preloadStrips(renderer, sprites, anims) {
  sprites.forEach((sprite) => anims.forEach((anim) => {
    const info = frameOf({ ...sprite, anim, t: 0 });
    if (info.url.endsWith(`-${anim}.webp`)) renderer.initTexture(baseTexture(info.url, info.frames));
  }));
}

function textureFor(cache, url, frames) {
  if (!cache.has(url)) cache.set(url, baseTexture(url, frames).clone());
  return cache.get(url);
}

// height = staande hoogte in wereldeenheden (publiek is kleiner dan de lopers)
export function createRunner3d(scene, sprite, height = RUNNER_H) {
  const info = frameOf(sprite);
  const { m } = info;
  const s = height / info.stand;
  const w = m.frameW * s;
  const h = m.frameH * s;
  const geo = new THREE.PlaneGeometry(w, h);
  // verschuif het vlak zodat het voetpunt van de sprite in de oorsprong ligt
  geo.translate(w / 2 - (m.footX / m.frameW) * w, (m.footY / m.frameH) * h - h / 2, 0);
  const mat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.35, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(height * 0.75, height * 0.3),
    new THREE.MeshBasicMaterial({ map: blobShadow(), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow, mesh);
  return { mesh, shadow, sprite, cache: new Map() };
}

// zet frame, positie en draaiing. base = hoogte van de vloer (tribune), lift = sprongetje,
// lean = vooroverhellen bij snelheid (0–1)
export function updateRunner3d(r, x, z, camera, { base = 0, lift = 0, lean = 0 } = {}) {
  const info = frameOf(r.sprite);
  const tex = textureFor(r.cache, info.url, info.frames);
  tex.offset.x = info.index / info.frames;
  if (r.mesh.material.map !== tex) {
    r.mesh.material.map = tex;
    r.mesh.material.needsUpdate = true;
  }
  r.mesh.position.set(x, base + lift, z);
  r.mesh.rotation.set(0, Math.atan2(camera.position.x - x, camera.position.z - z), -lean * 0.12);
  // een stilstaande pose (één frame) krijgt een rustige ademhaling
  r.mesh.scale.y = info.frames === 1 ? 1 + Math.sin(r.sprite.t * 3) * 0.025 : 1;
  r.shadow.position.set(x + 0.1, base + 0.03, z);
  const scale = 1 - Math.min(0.4, lift * 0.3);
  r.shadow.scale.set(scale, scale, 1);
}
