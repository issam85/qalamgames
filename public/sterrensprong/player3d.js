// De hoofdfiguur: een lantaarn met sterrenramen en een gezichtje, in kleuren naar keuze.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { glowSprite, lanternTexture } from './pattern.js';
import { createCarpet } from './carpet.js';

const RADIUS = 0.46; // van het midden tot de onderkant van de lantaarn
const SPIN = 11.5; // één rondje per sprong
const TURN = Math.PI * 2;
const basic = (color) => new THREE.MeshBasicMaterial({ color });

function eye(x) {
  const group = new THREE.Group();
  const white = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), basic('#ffffff'));
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 8), basic('#1b1034'));
  pupil.position.set(0.03, -0.005, 0.07);
  const shine = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), basic('#ffffff'));
  shine.position.set(0.055, 0.03, 0.125);
  group.add(white, pupil, shine);
  group.position.set(x, 0.08, 0.3);
  return group;
}

function addFace(lantern) {
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.016, 6, 14, Math.PI), basic('#5a2a10'));
  smile.rotation.z = Math.PI;
  smile.position.set(0.1, -0.06, 0.345);
  const cheekGeo = new THREE.CircleGeometry(0.05, 12);
  const cheekMat = new THREE.MeshBasicMaterial({ color: '#ff6f91', transparent: true, opacity: 0.7 });
  [-0.08, 0.28].forEach((x) => {
    const cheek = new THREE.Mesh(cheekGeo, cheekMat);
    cheek.position.set(x, -0.05, 0.34);
    lantern.add(cheek);
  });
  lantern.add(eye(0), eye(0.2), smile);
}

function buildLantern(materials) {
  const lantern = new THREE.Group();
  const bodyGeo = new THREE.CylinderGeometry(0.33, 0.38, 0.56, 8);
  const body = new THREE.Mesh(bodyGeo, materials.body);
  const ribs = new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeo), materials.lines);
  body.rotation.y = Math.PI / 8; // een plat raam naar de camera
  ribs.rotation.y = Math.PI / 8;
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.43, 0.2, 8), materials.metal);
  cap.position.y = 0.38;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), materials.metal);
  knob.position.y = 0.49;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.028, 8, 16), materials.metal);
  handle.position.y = 0.61;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.14, 8), materials.metal);
  base.position.y = -0.36;
  lantern.add(body, ribs, cap, knob, handle, base);
  addFace(lantern);
  return lantern;
}

export function createPlayer(scene) {
  const materials = {
    body: new THREE.MeshBasicMaterial({ map: lanternTexture() }),
    metal: new THREE.MeshLambertMaterial({ emissive: '#2a1a10' }),
    lines: new THREE.LineBasicMaterial(),
  };
  const lantern = buildLantern(materials);
  const glow = new THREE.PointLight('#ffffff', 14, 8);
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.5, 20),
    new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.4 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  const halo = glowSprite('#ffffff', 3.4);
  scene.add(lantern, glow, shadow, halo);
  const carpet = createCarpet(scene);

  let spin = 0;
  let squash = 0;
  let wasGrounded = true;
  let time = 0;

  return {
    setSkin({ body, metal }) {
      materials.body.color.set(body);
      materials.metal.color.set(metal);
      materials.lines.color.set(metal);
      glow.color.set(body);
      halo.material.color.set(body);
    },
    setVisible(on) {
      [lantern, glow, shadow, halo].forEach((part) => { part.visible = on; });
    },
    reset() {
      spin = 0;
      squash = 0;
      wasGrounded = true;
    },
    update(run, dt, inMenu) {
      time += dt;
      if (run.fly) {
        spin += (Math.round(spin / TURN) * TURN - spin) * Math.min(1, dt * 12); // rechtop op het tapijt
      } else if (run.grounded) {
        if (!wasGrounded) squash = 1;
        spin += (Math.round(spin / TURN) * TURN - spin) * Math.min(1, dt * 24);
      } else {
        spin -= SPIN * dt;
      }
      wasGrounded = run.grounded;
      squash = Math.max(0, squash - dt * 6);
      const amount = 0.2 * squash;
      const bob = inMenu ? Math.abs(Math.sin(time * 2.4)) * 0.12 : 0;
      lantern.position.set(run.x, run.y + RADIUS * (1 - amount) + bob, 0);
      lantern.rotation.y = inMenu ? Math.sin(time * 1.1) * 0.45 : 0;
      const sway = run.grounded && !inMenu ? Math.sin(run.x * 4) * 0.07 : 0;
      const tilt = run.fly ? Math.max(-0.35, Math.min(0.35, run.vy * 0.04)) : 0;
      lantern.rotation.z = spin + sway + tilt;
      carpet.update(run, dt, lantern.visible && run.fly && !inMenu);
      lantern.scale.set(1 + amount, 1 - amount, 1 + amount);
      glow.position.set(run.x, run.y + 1, 1.2);
      halo.position.set(run.x, run.y + RADIUS + bob, 0);
      const height = run.y - run.floor;
      shadow.position.set(run.x, run.floor + 0.04, 0);
      shadow.material.opacity = Math.max(0.08, 0.4 - height * 0.1);
    },
  };
}
