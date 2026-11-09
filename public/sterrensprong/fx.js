// Vonken: spoor achter de lantaarn, stof bij landen, uitbarsting bij ringen en finish.
import * as THREE from '../marioparty/vendor/three.module.min.js';

const COUNT = 240;
const GRAVITY = 16;
const TRAIL_EVERY = 0.028;
const FLOOR_SPARK = '#5cf2d6';

export function createFx(scene) {
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    COUNT,
  );
  mesh.frustumCulled = false;
  const color = new THREE.Color();
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
  const sparks = Array.from({ length: COUNT }, (_, i) => {
    mesh.setMatrixAt(i, hidden);
    mesh.setColorAt(i, color.set('#ffffff'));
    return { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0, max: 1, size: 0.1 };
  });
  scene.add(mesh);
  const holder = new THREE.Object3D();
  let next = 0;
  let trailTime = 0;
  let airSpark = '#ffcf6b';
  let cheer = 0;

  function emit(x, y, z, vx, vy, vz, life, size, tint) {
    const s = sparks[next];
    Object.assign(s, { x, y, z, vx, vy, vz, life, max: life, size });
    mesh.setColorAt(next, color.set(tint));
    mesh.instanceColor.needsUpdate = true;
    next = (next + 1) % COUNT;
  }

  function burst(x, y, tint, count, power) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = power * (0.4 + Math.random() * 0.6);
      emit(x, y, Math.random() - 0.5, Math.cos(a) * speed, Math.sin(a) * speed, (Math.random() - 0.5) * power, 0.5, 0.14, tint);
    }
  }

  return {
    burst,
    setSpark: (color) => { airSpark = color; },
    finale(x, dt) {
      cheer -= dt;
      if (cheer > 0) return;
      cheer = 0.22;
      burst(x + (Math.random() - 0.5) * 3, 4 + Math.random() * 3, Math.random() < 0.5 ? '#ffd43b' : '#5cf2d6', 24, 9);
    },
    dust(x, y) {
      for (let i = 0; i < 9; i++) {
        emit(x + Math.random() - 0.5, y + 0.05, Math.random() - 0.5, (Math.random() - 0.5) * 7, Math.random() * 3.5, 0, 0.32, 0.11, FLOOR_SPARK);
      }
    },
    trail(run, dt) {
      trailTime -= dt;
      if (trailTime > 0) return;
      trailTime = TRAIL_EVERY;
      const y = run.y + (run.grounded ? 0.08 : 0.45);
      const tint = run.grounded ? FLOOR_SPARK : airSpark;
      emit(run.x - 0.42, y, (Math.random() - 0.5) * 0.5, -2 - Math.random() * 2, Math.random() * 2, 0, 0.36, 0.1, tint);
    },
    update(dt) {
      sparks.forEach((s, i) => {
        if (s.life <= 0) return;
        s.life -= dt;
        if (s.life <= 0) {
          mesh.setMatrixAt(i, hidden);
          return;
        }
        s.vy -= GRAVITY * dt;
        s.x += s.vx * dt;
        s.y = Math.max(0.05, s.y + s.vy * dt);
        s.z += s.vz * dt;
        holder.position.set(s.x, s.y, s.z);
        holder.rotation.set(s.life * 12, s.life * 8, 0);
        holder.scale.setScalar(s.size * (s.life / s.max));
        holder.updateMatrix();
        mesh.setMatrixAt(i, holder.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}
