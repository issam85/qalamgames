// Dikke lichtranden langs de ribben van een vorm; gewone lijnen zijn maar één pixel dun.
import * as THREE from '../marioparty/vendor/three.module.min.js';

const UP = new THREE.Vector3(0, 1, 0);

export function addNeonEdges(scene, geometry, matrices, color, thickness) {
  if (!matrices.length) return;
  const edges = new THREE.EdgesGeometry(geometry).attributes.position;
  const pairs = edges.count / 2;
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color }),
    pairs * matrices.length,
  );
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const mid = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const turn = new THREE.Quaternion();
  const bar = new THREE.Matrix4();
  matrices.forEach((matrix, i) => {
    for (let p = 0; p < pairs; p++) {
      a.fromBufferAttribute(edges, p * 2).applyMatrix4(matrix);
      b.fromBufferAttribute(edges, p * 2 + 1).applyMatrix4(matrix);
      mid.addVectors(a, b).multiplyScalar(0.5);
      b.sub(a);
      const length = b.length();
      turn.setFromUnitVectors(UP, b.normalize());
      scale.set(thickness, length + thickness, thickness);
      mesh.setMatrixAt(i * pairs + p, bar.compose(mid, turn, scale));
    }
  });
  mesh.frustumCulled = false;
  scene.add(mesh);
}
