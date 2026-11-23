// Een voetballer van simpele vormen (kijkt naar +x), met lopen, schieten en opladen.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { blobTexture, labelTexture } from './textures.js';

const SKIN = '#c98b5e';
const blob = blobTexture();
const lambert = (color) => new THREE.MeshLambertMaterial({ color });

function capsule(r, len, material) {
  return new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), material);
}

// een ledemaat dat draait om het bovenste punt
function limb(r, len, material, foot) {
  const pivot = new THREE.Group();
  const part = capsule(r, len, material);
  part.position.y = -len / 2 - r;
  pivot.add(part);
  if (foot) {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.13), foot);
    shoe.position.set(0.05, -len - r * 2, 0);
    pivot.add(shoe);
  }
  return pivot;
}

function buildHead(hair) {
  const head = new THREE.Group();
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), lambert(SKIN)));
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.1), lambert(hair));
  cap.rotation.z = 0.25;
  cap.position.x = -0.015;
  head.add(cap);
  const eye = new THREE.MeshBasicMaterial({ color: '#1b1034' });
  [-0.06, 0.06].forEach((z) => {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), eye);
    e.position.set(0.155, 0.02, z);
    head.add(e);
  });
  return head;
}

export function createFigure(scene, kit, tag) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const shirt = lambert(kit.shirt), pants = lambert(kit.pants), shoe = lambert(kit.shoes || '#ffffff');
  const legs = [-0.1, 0.1].map((z) => {
    const leg = limb(0.075, 0.6, pants, shoe);
    leg.position.set(0, 0.82, z);
    body.add(leg);
    return leg;
  });
  const torso = capsule(0.17, 0.32, shirt);
  torso.position.y = 1.08;
  torso.scale.z = 1.2;
  body.add(torso);
  const arms = [-0.25, 0.25].map((z) => {
    const arm = limb(0.06, 0.4, shirt);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(kit.gloves ? 0.08 : 0.06, 8, 6), lambert(kit.gloves || SKIN));
    hand.position.y = -0.55;
    arm.add(hand);
    arm.position.set(0, 1.3, z);
    body.add(arm);
    return arm;
  });
  const head = buildHead(kit.hair || '#2b1a10');
  head.position.y = 1.55;
  body.add(head);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  root.add(shadow);
  scene.add(root);
  return { root, body, legs, arms, head, phase: 0, tag: tag ? addTag(root, tag) : null };
}

// een ring onder de voeten en een label boven het hoofd
function addTag(root, tag) {
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.62, 32), new THREE.MeshBasicMaterial({ color: tag.color, transparent: true, opacity: 0.9 }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture(tag.text, tag.color), depthTest: false }));
  label.scale.set(0.9, 0.45, 1);
  label.position.y = 2.15;
  label.renderOrder = 10;
  const group = new THREE.Group();
  group.add(ring, label);
  root.add(group);
  return group;
}

// zet de figuur op de plek van de speler en speelt de bewegingen
export function poseFigure(fig, player, dt) {
  fig.root.position.set(player.pos.x, 0, player.pos.z);
  fig.root.rotation.y = player.facing;
  const speed = Math.hypot(player.vel.x, player.vel.z);
  fig.phase += dt * speed * 1.7;
  const stride = Math.min(1, speed / 6) * 0.75;
  const swing = Math.sin(fig.phase) * stride;
  fig.legs[0].rotation.z = swing;
  fig.legs[1].rotation.z = -swing;
  fig.arms[0].rotation.z = -swing * 0.8;
  fig.arms[1].rotation.z = swing * 0.8;
  fig.body.position.y = Math.abs(Math.cos(fig.phase)) * 0.05 * stride;
  fig.body.rotation.z = -Math.min(1, speed / 9) * 0.18;
  if (player.charging) {
    fig.legs[1].rotation.z = -0.4 - player.charge * 0.6; // been naar achteren
    fig.body.rotation.z = 0.08;
  }
  if (player.tackle > 0) { // glijden: laag, been vooruit, naar achteren leunen
    fig.body.position.y = -0.35;
    fig.body.rotation.z = 0.5;
    fig.legs[1].rotation.z = 1.3;
    fig.legs[0].rotation.z = 0.5;
  } else if (player.stumble > 0) { // struikelen: voorover met maaiende armen
    fig.body.rotation.z = -0.55;
    fig.arms[0].rotation.z = Math.sin(fig.phase * 4 + player.stumble * 30) * 1.2;
    fig.arms[1].rotation.z = -fig.arms[0].rotation.z;
  }
  if (player.kickTime > 0) {
    const t = 1 - player.kickTime / 0.25;
    fig.legs[1].rotation.z = -0.9 + t * 2.2; // de trap naar voren
    fig.arms[0].rotation.z = 0.7;
  }
}
