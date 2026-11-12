// Zet een level om in 3D: één tekenopdracht per soort, licht genoeg voor een Chromebook.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { glowSprite } from './pattern.js';
import { styleOf } from './styles.js';
import { addNeonEdges } from './neon.js';

const BLOCK_DEPTH = 1.7;
const SPIKE_DEPTH = 1;
const THORN_STEP = 0.32;
const TURN = { up: 0, down: Math.PI, left: Math.PI / 2 }; // de punt wijst omhoog, omlaag of naar links
const of = (level, type) => level.obstacles.filter((o) => o.type === type);
const box = (x, y, z, sx, sy, sz) =>
  new THREE.Matrix4().makeTranslation(x, y, z).scale(new THREE.Vector3(sx, sy, sz));

function instanced(scene, geometry, material, matrices) {
  if (!matrices.length) return;
  const mesh = new THREE.InstancedMesh(geometry, material, matrices.length);
  matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
  mesh.frustumCulled = false;
  scene.add(mesh);
}

function addBlocks(scene, blocks, style) {
  const cells = [];
  blocks.forEach((b) => {
    for (let x = 0; x < b.w; x++) {
      for (let y = 0; y < b.h; y++) cells.push(box(b.x + x + 0.5, b.y + y + 0.5, 0, 1, 1, BLOCK_DEPTH));
    }
  });
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  instanced(scene, geometry, new THREE.MeshLambertMaterial({ map: style.block(), color: style.tint }), cells);
  const outlines = blocks.map((b) => box(b.x + b.w / 2, b.y + b.h / 2, 0, b.w, b.h, BLOCK_DEPTH));
  addNeonEdges(scene, geometry, outlines, style.edge, 0.06);
}

function addSpikes(scene, spikes) {
  const geometry = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4);
  geometry.rotateY(Math.PI / 4);
  const matrices = spikes.map((s) => new THREE.Matrix4()
    .makeTranslation(s.x + s.w / 2, s.y + s.h / 2, 0)
    .multiply(new THREE.Matrix4().makeRotationZ(TURN[s.dir || 'up']))
    .scale(new THREE.Vector3(s.w, s.h, SPIKE_DEPTH)));
  instanced(scene, geometry, new THREE.MeshLambertMaterial({ color: '#d81b60', emissive: '#8a1048' }), matrices);
  addNeonEdges(scene, geometry, matrices, '#ffd0e0', 0.035);
}

// vaste 'willekeur': elke poging ziet het doornenveld er hetzelfde uit
const wobble = (n) => {
  const v = Math.sin(n * 91.7) * 4375.5;
  return v - Math.floor(v);
};

function addThorns(scene, thorns) {
  const matrices = [];
  thorns.forEach((t) => {
    for (let x = t.x + 0.12; x < t.x + t.w - 0.1; x += THORN_STEP) {
      [-0.5, 0, 0.5].forEach((z, row) => {
        const h = 0.35 + wobble(x + row) * 0.45;
        matrices.push(box(x + wobble(x * 3 + row) * 0.08, t.y + h / 2, z, 0.3, h, 0.3));
      });
    }
  });
  const geometry = new THREE.ConeGeometry(0.5, 1, 5);
  instanced(scene, geometry, new THREE.MeshLambertMaterial({ color: '#ad1457', emissive: '#5c0b35' }), matrices);
}

function addFinish(scene, x) {
  const gold = new THREE.MeshBasicMaterial({ color: '#ffd43b' });
  [-1.4, 1.4].forEach((z) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 7, 10), gold);
    pillar.position.set(x, 3.5, z);
    scene.add(pillar);
  });
  const arch = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.14, 10, 28, Math.PI), gold);
  arch.rotation.y = Math.PI / 2;
  arch.position.set(x, 7, 0);
  const glow = glowSprite('#ffb84d', 9);
  glow.position.set(x, 6.5, 0);
  scene.add(arch, glow);
}

export function buildObstacles(scene, level) {
  addBlocks(scene, of(level, 'block'), styleOf(level));
  addSpikes(scene, of(level, 'spike'));
  addThorns(scene, of(level, 'thorn'));
  addFinish(scene, level.length);
}
