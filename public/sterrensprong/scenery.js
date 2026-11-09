// Achtergrond: een nachtstad met koepels en minaretten, en de maan.
import * as THREE from '../marioparty/vendor/three.module.min.js';

const CITY_Z = -13;
const PARALLAX = 0.5; // de stad schuift half zo snel als de baan
const hash = (n) => {
  const v = Math.sin(n * 57.31) * 9731.7;
  return v - Math.floor(v);
};
const place = (x, y, z, sx, sy, sz) =>
  new THREE.Matrix4().makeTranslation(x, y, z).scale(new THREE.Vector3(sx, sy, sz));

function fill(group, geometry, material, matrices) {
  const mesh = new THREE.InstancedMesh(geometry, material, matrices.length);
  matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
  mesh.frustumCulled = false;
  group.add(mesh);
}

function layoutCity(length) {
  const city = { walls: [], domes: [], towers: [], tips: [], windows: [] };
  let x = -60;
  for (let i = 0; x < length * PARALLAX + 70; i++) {
    const w = 3 + hash(i) * 3.5;
    const h = 3 + hash(i + 40) * 5;
    city.walls.push(place(x + w / 2, h / 2, CITY_Z, w, h, 3));
    if (i % 3 === 0) city.domes.push(place(x + w / 2, h, CITY_Z, w * 0.42, w * 0.42, w * 0.42));
    if (i % 5 === 2) {
      const tall = h + 6;
      city.towers.push(place(x + w + 0.4, tall / 2, CITY_Z, 0.5, tall, 0.5));
      city.tips.push(place(x + w + 0.4, tall + 0.5, CITY_Z, 0.5, 1, 0.5));
    }
    for (let wx = x + 0.7; wx < x + w - 0.5; wx += 1.1) {
      for (let wy = 1; wy < h - 0.8; wy += 1.4) {
        if (hash(wx * 7 + wy) > 0.62) city.windows.push(place(wx, wy, CITY_Z + 1.55, 0.36, 0.56, 0.05));
      }
    }
    x += w + 0.3 + hash(i + 80) * 1.5;
  }
  return city;
}

function moonSprite() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(120, 128, 92, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(158, 112, 80, 0, Math.PI * 2);
  ctx.fill();
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, fog: false }));
  sprite.scale.setScalar(6);
  return sprite;
}

export function createScenery(scene, level) {
  const group = new THREE.Group();
  const city = layoutCity(level.length);
  const dark = new THREE.MeshBasicMaterial({ color: '#150c3a', fog: false });
  fill(group, new THREE.BoxGeometry(1, 1, 1), dark, city.walls);
  fill(group, new THREE.SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), dark, city.domes);
  fill(group, new THREE.CylinderGeometry(0.5, 0.5, 1, 8), dark, city.towers);
  fill(group, new THREE.ConeGeometry(0.9, 1, 8), dark, city.tips);
  fill(group, new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: '#ffcf6b', fog: false }), city.windows);
  scene.add(group);
  const moon = moonSprite();
  scene.add(moon);

  return {
    update(cameraX) {
      group.position.x = cameraX * PARALLAX;
      moon.position.set(cameraX + 9, 11.5, -18);
    },
  };
}
