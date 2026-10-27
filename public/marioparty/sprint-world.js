// 3D-wereld van de sprint: renderer, lucht, licht, heuvels en bomen (three.js).
import * as THREE from './vendor/three.module.min.js';

// verticaal kleurverloop als achtergrond, zoals de blauwe lucht van het spel
function skyTexture() {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 256;
  const g = c.getContext('2d').createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#1e88e5');
  g.addColorStop(0.55, '#7fd3ff');
  g.addColorStop(1, '#d8f4ff');
  const ctx = c.getContext('2d');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function addHills(scene) {
  const mat = new THREE.MeshLambertMaterial({ color: '#6cc04a', flatShading: false });
  const dark = new THREE.MeshLambertMaterial({ color: '#4fa33a' });
  [[-20, -55, 26, 9], [20, -62, 30, 12], [55, -58, 24, 10], [90, -64, 34, 13], [125, -56, 22, 8]]
    .forEach(([x, z, r, h], i) => {
      const hill = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), i % 2 ? dark : mat);
      hill.scale.set(r, h, r * 0.6);
      hill.position.set(x, -0.5, z);
      scene.add(hill);
    });
}

// ronde cartoonbomen achter het publiek
function addTrees(scene, length) {
  const trunk = new THREE.MeshLambertMaterial({ color: '#8d5a32' });
  const leaves = [new THREE.MeshLambertMaterial({ color: '#43a047' }), new THREE.MeshLambertMaterial({ color: '#66bb35' })];
  for (let x = -16; x < length + 30; x += 7 + (x % 3)) {
    const z = -17 - (x % 4) * 1.5;
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 2, 8), trunk);
    t.position.set(x, 1, z);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(1.6 + (x % 2) * 0.4, 16, 12), leaves[Math.abs(x) % 2]);
    crown.position.set(x, 3, z);
    scene.add(t, crown);
  }
}

export function createWorld(canvas, length) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = skyTexture();
  scene.fog = new THREE.Fog('#cfefff', 60, 140);
  scene.add(new THREE.HemisphereLight('#e6f6ff', '#5d9a3a', 1.6));
  const sun = new THREE.DirectionalLight('#fff4d6', 1.4);
  sun.position.set(-20, 30, 25);
  scene.add(sun);
  addHills(scene);
  addTrees(scene, length);
  const camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.5, 400);

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  return { THREE, renderer, scene, camera, resize };
}
