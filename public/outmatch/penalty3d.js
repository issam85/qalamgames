// Bij een penalty van een echte speler: een gouden doelwit in het doel en een pijl over de grond.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { FIELD } from './config.js';

export function createPenaltyMarks(scene) {
  const gold = new THREE.MeshBasicMaterial({ color: '#ffd43b', transparent: true, opacity: 0.95, depthTest: false });
  const target = new THREE.Group();
  target.add(new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 8, 28), gold));
  target.add(new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), gold));
  target.renderOrder = 20;
  const arrow = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.14), gold);
  arrow.rotation.x = -Math.PI / 2;
  arrow.renderOrder = 20;
  scene.add(target, arrow);
  target.visible = arrow.visible = false;

  function update(match) {
    const kick = match.phase === 'penalties' ? match.kick : null;
    const show = Boolean(kick && !kick.shooter.cpu && (kick.stage === 'aim' || kick.stage === 'power'));
    target.visible = arrow.visible = show;
    if (!show) return;
    const goalX = kick.shooter.attack * FIELD.halfL;
    target.position.set(goalX, 1.1, kick.aimZ);
    target.scale.setScalar(kick.stage === 'power' ? 1.25 : 1);
    const b = match.ball.pos;
    const dx = goalX - b.x, dz = kick.aimZ - b.z;
    const len = Math.hypot(dx, dz);
    arrow.scale.x = len * 0.8;
    arrow.position.set(b.x + dx * 0.45, 0.03, b.z + dz * 0.45);
    arrow.rotation.z = Math.atan2(-dz, dx);
  }

  return { update };
}
