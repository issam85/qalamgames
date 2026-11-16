// De kooi op het dak: veld, boarding, gaas, plafondnet, doelen en lichtmasten.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { FIELD, GOAL } from './config.js';
import { pitchTexture, meshTexture } from './textures.js';

const L = FIELD.halfL, W = FIELD.halfW, H = FIELD.ceiling;
const BOARD = 1.1; // hoogte van de dichte rand onderaan

function box(w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  return mesh;
}

function gauze(w, h, opacity) {
  return new THREE.MeshBasicMaterial({
    map: meshTexture(w / 0.5, h / 0.5), transparent: true, opacity,
    depthWrite: false, side: THREE.DoubleSide,
  });
}

function addPitch(group) {
  const pitch = new THREE.Mesh(new THREE.PlaneGeometry(L * 2, W * 2),
    new THREE.MeshLambertMaterial({ map: pitchTexture() }));
  pitch.rotation.x = -Math.PI / 2;
  group.add(pitch);
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(70, 50), new THREE.MeshLambertMaterial({ color: '#3b3f5c' }));
  roof.rotation.x = -Math.PI / 2;
  roof.position.y = -0.02;
  group.add(roof);
}

// boarding en gaas langs alle kanten; de kant naar de camera is bijna doorzichtig
function addWalls(group) {
  const boardMat = new THREE.MeshLambertMaterial({ color: '#1e3a8a' });
  const nearMat = new THREE.MeshLambertMaterial({ color: '#1e3a8a', transparent: true, opacity: 0.45 });
  const stripe = new THREE.MeshBasicMaterial({ color: '#ffd43b' });
  group.add(box(L * 2, BOARD, 0.12, boardMat, 0, BOARD / 2, -W - 0.06));
  group.add(box(L * 2, BOARD, 0.12, nearMat, 0, BOARD / 2, W + 0.06));
  group.add(box(L * 2, 0.08, 0.14, stripe, 0, BOARD - 0.1, -W - 0.06));
  [-1, 1].forEach((s) => {
    const part = W - GOAL.halfW;
    [-1, 1].forEach((t) => {
      const z = t * (GOAL.halfW + part / 2);
      group.add(box(0.12, BOARD, part, boardMat, s * (L + 0.06), BOARD / 2, z));
    });
    const above = box(0.12, H - GOAL.height, GOAL.halfW * 2, boardMat, s * (L + 0.06), GOAL.height + (H - GOAL.height) / 2, 0);
    above.material = gauze(GOAL.halfW * 2, H - GOAL.height, 0.5);
    group.add(above);
  });
  const far = new THREE.Mesh(new THREE.PlaneGeometry(L * 2, H - BOARD), gauze(L * 2, H - BOARD, 0.55));
  far.position.set(0, BOARD + (H - BOARD) / 2, -W - 0.06);
  group.add(far);
  [-1, 1].forEach((s) => {
    [-1, 1].forEach((t) => {
      const part = W - GOAL.halfW;
      const side = new THREE.Mesh(new THREE.PlaneGeometry(part, H - BOARD), gauze(part, H - BOARD, 0.5));
      side.rotation.y = Math.PI / 2;
      side.position.set(s * (L + 0.06), BOARD + (H - BOARD) / 2, t * (GOAL.halfW + part / 2));
      group.add(side);
    });
  });
}

// stalen frame aan de verre kant en op de hoeken; de kant naar de camera blijft open
function addFrame(group) {
  const steel = new THREE.MeshLambertMaterial({ color: '#c7cede' });
  for (let x = -L; x <= L + 0.01; x += L / 3) {
    group.add(box(0.16, H, 0.16, steel, x, H / 2, -W - 0.1));
  }
  [-1, 1].forEach((s) => group.add(box(0.16, BOARD, 0.16, steel, s * L, BOARD / 2, W + 0.1)));
  group.add(box(L * 2, 0.12, 0.12, steel, 0, H, -W - 0.1));
}

function addGoal(group, side) {
  const white = new THREE.MeshLambertMaterial({ color: '#ffffff' });
  const r = GOAL.post;
  const x = side * L;
  const postGeo = new THREE.CylinderGeometry(r, r, GOAL.height, 10);
  [-1, 1].forEach((t) => {
    const post = new THREE.Mesh(postGeo, white);
    post.position.set(x, GOAL.height / 2, t * GOAL.halfW);
    group.add(post);
  });
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(r, r, GOAL.halfW * 2 + r * 2, 10), white);
  bar.rotation.x = Math.PI / 2;
  bar.position.set(x, GOAL.height, 0);
  group.add(bar);
  const d = GOAL.depth, net = gauze(4, 2, 0.75);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(GOAL.halfW * 2, GOAL.height), net);
  back.rotation.y = Math.PI / 2;
  back.position.set(x + side * d, GOAL.height / 2, 0);
  const top = new THREE.Mesh(new THREE.PlaneGeometry(d, GOAL.halfW * 2), net);
  top.rotation.x = Math.PI / 2;
  top.position.set(x + side * d / 2, GOAL.height, 0);
  group.add(back, top);
  [-1, 1].forEach((t) => {
    const wing = new THREE.Mesh(new THREE.PlaneGeometry(d, GOAL.height), net);
    wing.position.set(x + side * d / 2, GOAL.height / 2, t * GOAL.halfW);
    group.add(wing);
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(d, GOAL.halfW * 2), new THREE.MeshLambertMaterial({ color: '#2b8a3e' }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(x + side * d / 2, 0.005, 0);
  group.add(floor);
}

export function createArena(scene) {
  const group = new THREE.Group();
  addPitch(group);
  addWalls(group);
  addFrame(group);
  addGoal(group, -1);
  addGoal(group, 1);
  scene.add(group);
  return group;
}
