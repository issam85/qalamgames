// De bal in beeld: rolt mee met de snelheid en heeft een schaduw die kleiner wordt als hij hoog is.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { BALL } from './config.js';
import { ballTexture, blobTexture } from './textures.js';

const axis = new THREE.Vector3();
const spin = new THREE.Quaternion();

export function createBall3d(scene) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(BALL.radius, 20, 14),
    new THREE.MeshLambertMaterial({ map: ballTexture(), emissive: '#222222' }));
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: blobTexture(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  scene.add(mesh, shadow);
  return { mesh, shadow };
}

export function poseBall(view, ball, dt) {
  const { pos, vel } = ball;
  view.mesh.position.set(pos.x, pos.y, pos.z);
  const speed = Math.hypot(vel.x, vel.z);
  if (speed > 0.01) {
    axis.set(vel.z, 0, -vel.x).normalize();
    spin.setFromAxisAngle(axis, (speed * dt) / BALL.radius);
    view.mesh.quaternion.premultiply(spin);
  }
  const lift = Math.max(0, pos.y - BALL.radius);
  const size = Math.max(0.25, 0.7 - lift * 0.08);
  view.shadow.position.set(pos.x, 0.012, pos.z);
  view.shadow.scale.set(size, size, 1);
  view.shadow.material.opacity = Math.max(0.25, 1 - lift * 0.12);
}
