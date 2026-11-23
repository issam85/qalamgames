// Woestijnoase: duinen in twee lagen, palmen, een karavaan kamelen en glinsterend water.
// Alles in een paar tekenopdrachten (instanced), net als de markt en de wolken.
import * as THREE from '../marioparty/vendor/three.module.min.js';

const hash = (n) => {
  const v = Math.sin(n * 73.3) * 5813.1;
  return v - Math.floor(v);
};
const place = (x, y, z, sx, sy, sz, turn = 0) => new THREE.Matrix4()
  .makeTranslation(x, y, z)
  .multiply(new THREE.Matrix4().makeRotationZ(turn))
  .scale(new THREE.Vector3(sx, sy, sz));

function instanced(group, geometry, color, items, extra = {}) {
  if (!items.length) return;
  const material = new THREE.MeshBasicMaterial({ color, fog: false, ...extra });
  const mesh = new THREE.InstancedMesh(geometry, material, items.length);
  items.forEach((m, i) => mesh.setMatrixAt(i, m));
  mesh.frustumCulled = false;
  group.add(mesh);
}

// duinen: platte halve bollen, achteraan donker en groot, vooraan lichter en lager
function dunes(span) {
  const back = [];
  const front = [];
  for (let i = 0, x = -60; x < span; i++, x += 7 + hash(i) * 6) {
    back.push(place(x, -0.4, -11.5, 6 + hash(i + 1) * 5, 2.4 + hash(i + 2) * 2, 2));
    front.push(place(x + 4, -0.6, -8.5, 5 + hash(i + 3) * 4, 1.4 + hash(i + 4) * 1.2, 1.5));
  }
  return { back, front };
}

// palm: schuine stam van stukjes en een kroon van zes bladeren
function palm(items, x, z, seed) {
  const lean = (hash(seed) - 0.5) * 0.5;
  const tall = 4 + hash(seed + 1) * 2;
  for (let s = 0; s < 6; s++) {
    const y = (s + 0.5) * (tall / 6);
    items.trunks.push(place(x + Math.sin(lean) * y, y, z, 0.32, tall / 6 + 0.05, 0.32, -lean));
  }
  const topX = x + Math.sin(lean) * tall;
  for (let l = 0; l < 6; l++) {
    const a = (l / 6) * Math.PI * 2;
    items.leaves.push(place(topX + Math.cos(a) * 1.1, tall - 0.2 + Math.sin(a) * 0.35, z, 2.4, 0.32, 0.6, Math.cos(a) * 0.6));
  }
}

// kameel als silhouet: lijf, bult, nek, kop en vier poten
function camel(items, x, z) {
  const add = (dx, dy, sx, sy, turn = 0) => items.camels.push(place(x + dx, dy, z, sx, sy, 0.6, turn));
  add(0, 1.7, 1.9, 0.8);
  add(0, 2.2, 0.9, 0.7);
  add(1.1, 2.4, 0.3, 1.1, -0.5);
  add(1.45, 2.95, 0.6, 0.3);
  [-0.7, -0.4, 0.4, 0.7].forEach((dx) => add(dx, 0.75, 0.16, 1.3));
}

export function addDesert(group, span) {
  const { back, front } = dunes(span);
  const items = { trunks: [], leaves: [], camels: [], pools: [], glints: [] };
  for (let i = 0, x = -50; x < span; i++, x += 14 + hash(i + 9) * 10) {
    if (i % 3 === 1) {
      // oase: water met palmen eromheen
      items.pools.push(place(x, 0.02, -7.6, 5, 0.04, 1.6));
      for (let g = 0; g < 5; g++) items.glints.push(place(x - 2 + g * 1 + hash(i + g) * 0.6, 0.06, -7.2, 0.5, 0.03, 0.08));
      palm(items, x - 3, -7.9, i);
      palm(items, x + 3.2, -8.2, i + 50);
    } else if (i % 3 === 2) {
      // karavaan van drie kamelen op de duinen
      [0, 2.8, 5.6].forEach((dx) => camel(items, x + dx, -10));
    } else palm(items, x, -9, i + 100);
  }
  const box = new THREE.BoxGeometry(1, 1, 1);
  instanced(group, new THREE.SphereGeometry(1, 20, 8, 0, Math.PI * 2, 0, Math.PI / 2), '#3a1f48', back);
  instanced(group, new THREE.SphereGeometry(1, 20, 8, 0, Math.PI * 2, 0, Math.PI / 2), '#5a3050', front);
  instanced(group, new THREE.CylinderGeometry(0.5, 0.6, 1, 6), '#2a1630', items.trunks);
  instanced(group, new THREE.SphereGeometry(0.5, 8, 6), '#1f4a3a', items.leaves);
  instanced(group, box, '#24122e', items.camels);
  instanced(group, new THREE.CylinderGeometry(0.5, 0.5, 1, 24), '#2f8fd8', items.pools, { transparent: true, opacity: 0.7 });
  instanced(group, box, '#fff1b8', items.glints);
}
