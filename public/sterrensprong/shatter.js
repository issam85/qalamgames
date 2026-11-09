// Bij een botsing spat de lantaarn uiteen in gouden stukjes.
import * as THREE from '../marioparty/vendor/three.module.min.js';

const COUNT = 18;
const LIFE = 0.75;
const GRAVITY = 26;

export function createShatter(scene) {
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.17, 0.17, 0.17),
    new THREE.MeshBasicMaterial({ color: '#ffc93c' }),
    COUNT,
  );
  mesh.frustumCulled = false;
  mesh.visible = false;
  scene.add(mesh);
  const pieces = Array.from({ length: COUNT }, () => ({
    pos: new THREE.Vector3(), vel: new THREE.Vector3(), turn: 0,
  }));
  const holder = new THREE.Object3D();
  let time = 0;

  return {
    burst(x, y) {
      time = LIFE;
      mesh.visible = true;
      pieces.forEach((p) => {
        p.pos.set(x, y + 0.45, 0);
        p.vel.set(Math.random() * 14 - 5, Math.random() * 13 + 2, Math.random() * 8 - 4);
        p.turn = Math.random() * 6;
      });
    },
    hide() {
      time = 0;
      mesh.visible = false;
    },
    update(dt) {
      if (time <= 0) return;
      time -= dt;
      if (time <= 0) mesh.visible = false;
      const size = Math.max(0, time / LIFE);
      pieces.forEach((p, i) => {
        p.vel.y -= GRAVITY * dt;
        p.pos.addScaledVector(p.vel, dt);
        if (p.pos.y < 0.09) {
          p.pos.y = 0.09;
          p.vel.y *= -0.45;
        }
        p.turn += dt * 9;
        holder.position.copy(p.pos);
        holder.rotation.set(p.turn, p.turn * 0.7, 0);
        holder.scale.setScalar(size);
        holder.updateMatrix();
        mesh.setMatrixAt(i, holder.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}
