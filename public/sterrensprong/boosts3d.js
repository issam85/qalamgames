// Springringen die draaien en gloeien, en veren op de grond die pulseren.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { glowSprite } from './pattern.js';

const RING_COLOR = '#5cf2d6';
const PAD_COLOR = '#ffd43b';

function buildRing(ob) {
  const group = new THREE.Group();
  group.position.set(ob.x + ob.w / 2, ob.y + ob.h / 2, 0);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.1, 10, 8),
    new THREE.MeshBasicMaterial({ color: RING_COLOR }),
  );
  const inner = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.045, 8, 8),
    new THREE.MeshBasicMaterial({ color: '#ffffff' }),
  );
  group.add(ring, inner, glowSprite(RING_COLOR, 3.2));
  return { ob, group, ring, inner };
}

function buildPad(ob) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.5, ob.h, 8),
    new THREE.MeshBasicMaterial({ color: PAD_COLOR }),
  );
  mesh.position.set(ob.x + ob.w / 2, ob.y + ob.h / 2, 0);
  const glow = glowSprite(PAD_COLOR, 2.2);
  glow.position.set(ob.x + ob.w / 2, ob.y + 0.3, 0);
  return { ob, mesh, glow };
}

export function createBoosts(scene, level) {
  const rings = level.obstacles.filter((o) => o.type === 'ring').map(buildRing);
  const pads = level.obstacles.filter((o) => o.type === 'pad').map(buildPad);
  rings.forEach((r) => scene.add(r.group));
  pads.forEach((p) => scene.add(p.mesh, p.glow));
  let time = 0;

  return {
    update(run, dt) {
      time += dt;
      rings.forEach((r) => {
        r.ring.rotation.z = time * 2;
        r.inner.rotation.z = -time * 3;
        const used = run.used.has(r.ob);
        const beat = 1 + Math.sin(time * 6) * 0.05;
        r.group.scale.setScalar(used ? 0.55 : beat);
      });
      pads.forEach((p) => {
        const used = run.used.has(p.ob);
        p.mesh.scale.y = used ? 2.4 : 1 + Math.sin(time * 8) * 0.2;
      });
    },
  };
}
