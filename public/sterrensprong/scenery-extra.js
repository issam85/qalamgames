// Extra achtergrond: marktkraampjes met lichtsnoeren (bazaar) en wolken (paleis).
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { stripeTexture } from './textures-blocks.js';

const MARKET_Z = -9;
const AWNINGS = ['#e53935', '#1aa6a0', '#f08a24', '#8e44c9'];
const hash = (n) => {
  const v = Math.sin(n * 91.7) * 4375.5;
  return v - Math.floor(v);
};

function instanced(group, geometry, material, items) {
  const mesh = new THREE.InstancedMesh(geometry, material, items.length);
  const color = new THREE.Color();
  items.forEach(([matrix, tint], i) => {
    mesh.setMatrixAt(i, matrix);
    if (tint) mesh.setColorAt(i, color.set(tint));
  });
  mesh.frustumCulled = false;
  group.add(mesh);
}

const place = (x, y, z, sx, sy, sz, tilt = 0) => new THREE.Matrix4()
  .makeTranslation(x, y, z)
  .multiply(new THREE.Matrix4().makeRotationX(tilt))
  .scale(new THREE.Vector3(sx, sy, sz));

export function addMarket(group, span) {
  const counters = [];
  const awnings = [];
  const lights = [];
  for (let i = 0, x = -50; x < span; i++, x += 7 + hash(i) * 4) {
    counters.push([place(x, 0.6, MARKET_Z, 3, 1.2, 1.4)]);
    awnings.push([place(x, 2.5, MARKET_Z + 0.4, 3.4, 1.6, 1, -0.9), AWNINGS[i % AWNINGS.length]]);
    // lichtsnoer naar het volgende kraampje, met een boogje
    for (let t = 0; t < 1; t += 0.12) {
      lights.push([place(x + 1.6 + t * 5, 3.3 - Math.sin(t * Math.PI) * 0.7, MARKET_Z + 0.9, 0.12, 0.12, 0.12),
        ['#ffd43b', '#ff6ec7', '#5cf2d6'][Math.floor(t * 9) % 3]]);
    }
  }
  instanced(group, new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: '#3b2350', fog: false }), counters);
  instanced(group, new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: stripeTexture(), side: THREE.DoubleSide, fog: false }), awnings);
  instanced(group, new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ fog: false }), lights);
}

export function addClouds(group, span) {
  const puffs = [];
  for (let i = 0, x = -50; x < span; i++, x += 9 + hash(i) * 8) {
    const y = 8 + hash(i + 3) * 5;
    for (let p = 0; p < 4; p++) {
      const r = 1 + hash(i * 4 + p) * 0.9;
      puffs.push([place(x + p * 1.3, y + Math.sin(p * 2) * 0.4, -15, r, r * 0.75, r)]);
    }
  }
  const material = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.18, fog: false, depthWrite: false });
  instanced(group, new THREE.SphereGeometry(1, 12, 8), material, puffs);
}
