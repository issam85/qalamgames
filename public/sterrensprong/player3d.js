// De hoofdfiguur: een gouden lantaarn met oogjes, die salto's maakt in de lucht.
import * as THREE from '../marioparty/vendor/three.module.min.js';

const RADIUS = 0.46; // van het midden tot de onderkant van de lantaarn
const SPIN = 11.5; // één rondje per sprong
const TURN = Math.PI * 2;

function eye(x) {
  const group = new THREE.Group();
  const white = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 10), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshBasicMaterial({ color: '#1b1034' }));
  pupil.position.set(0.03, 0, 0.07);
  group.add(white, pupil);
  group.position.set(x, 0.06, 0.32);
  return group;
}

function buildLantern() {
  const lantern = new THREE.Group();
  const bronze = new THREE.MeshLambertMaterial({ color: '#b5651d' });
  const bodyGeo = new THREE.CylinderGeometry(0.33, 0.38, 0.56, 8);
  const body = new THREE.Mesh(bodyGeo, new THREE.MeshBasicMaterial({ color: '#ffc93c' }));
  const ribs = new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeo), new THREE.LineBasicMaterial({ color: '#7a3e10' }));
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.2, 8), bronze);
  cap.position.y = 0.38;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), bronze);
  knob.position.y = 0.49;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.14, 8), bronze);
  base.position.y = -0.36;
  lantern.add(body, ribs, cap, knob, base, eye(0.0), eye(0.2));
  return lantern;
}

export function createPlayer(scene) {
  const lantern = buildLantern();
  const glow = new THREE.PointLight('#ffb84d', 14, 8);
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.5, 20),
    new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.4 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  scene.add(lantern, glow, shadow);

  let spin = 0;
  let squash = 0;
  let wasGrounded = true;

  return {
    setVisible(on) {
      lantern.visible = on;
      glow.visible = on;
      shadow.visible = on;
    },
    reset() {
      spin = 0;
      squash = 0;
      wasGrounded = true;
    },
    update(run, dt) {
      if (run.grounded) {
        if (!wasGrounded) squash = 1;
        spin += (Math.round(spin / TURN) * TURN - spin) * Math.min(1, dt * 24);
      } else {
        spin -= SPIN * dt;
      }
      wasGrounded = run.grounded;
      squash = Math.max(0, squash - dt * 6);
      const amount = 0.2 * squash;
      lantern.position.set(run.x, run.y + RADIUS * (1 - amount), 0);
      lantern.rotation.z = spin + (run.grounded ? Math.sin(run.x * 4) * 0.07 : 0);
      lantern.scale.set(1 + amount, 1 - amount, 1 + amount);
      glow.position.set(run.x, run.y + 1, 1.2);
      const height = run.y - run.floor;
      shadow.position.set(run.x, run.floor + 0.04, 0);
      shadow.material.opacity = Math.max(0.08, 0.4 - height * 0.1);
    },
  };
}
