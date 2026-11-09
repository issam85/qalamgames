// Zet een level om in 3D: één tekenopdracht per soort, licht genoeg voor een Chromebook.
import * as THREE from '../marioparty/vendor/three.module.min.js';

const BLOCK_DEPTH = 1.7;
const SPIKE_DEPTH = 1;

function spikeGeometry() {
  const geo = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4);
  geo.rotateY(Math.PI / 4);
  return geo;
}

function placeAll(items, matrixOf, geometry, material, edgeColor, scene) {
  if (!items.length) return;
  const mesh = new THREE.InstancedMesh(geometry, material, items.length);
  const edges = new THREE.EdgesGeometry(geometry).attributes.position;
  const positions = new Float32Array(edges.count * 3 * items.length);
  const point = new THREE.Vector3();
  items.forEach((item, i) => {
    const matrix = matrixOf(item);
    mesh.setMatrixAt(i, matrix);
    for (let e = 0; e < edges.count; e++) {
      point.fromBufferAttribute(edges, e).applyMatrix4(matrix);
      point.toArray(positions, (i * edges.count + e) * 3);
    }
  });
  mesh.frustumCulled = false;
  scene.add(mesh);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: edgeColor }));
  lines.frustumCulled = false;
  scene.add(lines);
}

function blockMatrix(ob) {
  return new THREE.Matrix4()
    .makeTranslation(ob.x + ob.w / 2, ob.y + ob.h / 2, 0)
    .scale(new THREE.Vector3(ob.w, ob.h, BLOCK_DEPTH));
}

function spikeMatrix(ob) {
  return new THREE.Matrix4()
    .makeTranslation(ob.x + ob.w / 2, ob.y + ob.h / 2, 0)
    .scale(new THREE.Vector3(ob.w, ob.h, SPIKE_DEPTH));
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
  scene.add(arch);
}

export function buildObstacles(scene, level) {
  const blocks = level.obstacles.filter((o) => o.type === 'block');
  const spikes = level.obstacles.filter((o) => o.type === 'spike');
  placeAll(
    blocks,
    blockMatrix,
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({ color: '#3a2a8c' }),
    '#ffd43b',
    scene,
  );
  placeAll(
    spikes,
    spikeMatrix,
    spikeGeometry(),
    new THREE.MeshLambertMaterial({ color: '#d81b60', emissive: '#8a1048' }),
    '#ff5d8f',
    scene,
  );
  addFinish(scene, level.length);
}
