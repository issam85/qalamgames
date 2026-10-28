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
  const trunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 2, 8);
  const crownGeo = new THREE.SphereGeometry(1.6, 16, 12);
  for (let x = -16; x < length + 30; x += 7 + (x % 3)) {
    const z = -17 - (x % 4) * 1.5;
    const t = new THREE.Mesh(trunkGeo, trunk);
    t.position.set(x, 1, z);
    const crown = new THREE.Mesh(crownGeo, leaves[Math.abs(x) % 2]);
    crown.scale.setScalar(1 + (x % 2) * 0.25);
    crown.position.set(x, 3, z);
    scene.add(t, crown);
  }
}

// één renderer voor het hele spel: elke ronde een nieuwe zou dezelfde GL-context
// hergebruiken en de oude texturen laten rondslingeren
let shared = null;

function getRenderer(canvas) {
  if (shared && shared.domElement === canvas) return shared;
  const dpr = window.devicePixelRatio || 1;
  // scherpte begrensd voor trage schoolcomputers; anti-aliasing alleen op gewone schermen
  shared = new THREE.WebGLRenderer({ canvas, antialias: dpr < 1.5, alpha: false });
  shared.setPixelRatio(Math.min(1.5, dpr));
  shared.outputColorSpace = THREE.SRGBColorSpace;
  return shared;
}

// ruimt geometrie, materialen en texturen van een ronde op (gedeelde strips blijven)
export function disposeScene(scene) {
  const textures = new Set();
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    [].concat(obj.material || []).forEach((mat) => {
      Object.values(mat).forEach((v) => { if (v && v.isTexture) textures.add(v); });
      mat.dispose();
    });
  });
  if (scene.background && scene.background.isTexture) textures.add(scene.background);
  textures.forEach((tex) => { if (!tex.userData.keep) tex.dispose(); });
}

export function createWorld(canvas, length) {
  const renderer = getRenderer(canvas);
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
  return { renderer, scene, camera, resize };
}
