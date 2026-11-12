// Het vliegende tapijt onder de lantaarn: rood met een gouden rand en sterren, golft in de wind.
import * as THREE from '../marioparty/vendor/three.module.min.js';

const WIDTH = 2;
const DEPTH = 1.2;
const FACE_CAMERA = 0.45; // iets gekanteld, anders zie je het tapijt alleen van opzij

function carpetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#b3202a';
  ctx.fillRect(0, 0, 256, 160);
  ctx.strokeStyle = '#ffd43b';
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, 228, 132);
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 196, 100);
  ctx.fillStyle = '#ffd43b';
  [[128, 80, 22], [70, 80, 10], [186, 80, 10]].forEach(([cx, cy, r]) => {
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = (i * Math.PI) / 8;
      const rad = i % 2 ? r * 0.55 : r;
      ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    }
    ctx.fill();
  });
  for (let y = 18; y < 150; y += 10) ctx.fillRect(0, y, 8, 4); // franjes
  for (let y = 18; y < 150; y += 10) ctx.fillRect(248, y, 8, 4);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

export function createCarpet(scene) {
  const geometry = new THREE.PlaneGeometry(WIDTH, DEPTH, 16, 1);
  geometry.rotateX(-Math.PI / 2);
  const base = geometry.attributes.position.array.slice();
  const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ map: carpetTexture(), side: THREE.DoubleSide }));
  mesh.visible = false;
  scene.add(mesh);
  let time = 0;

  return {
    update(run, dt, visible) {
      mesh.visible = visible;
      if (!visible) return;
      time += dt;
      const position = geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = base[i * 3];
        const edge = (x + WIDTH / 2) / WIDTH; // achterkant golft het meest
        position.array[i * 3 + 1] = Math.sin(x * 5 - time * 12) * 0.07 * (1.2 - edge);
      }
      position.needsUpdate = true;
      mesh.position.set(run.x - 0.1, run.y + 0.02, 0);
      mesh.rotation.set(FACE_CAMERA, 0, Math.max(-0.35, Math.min(0.35, run.vy * 0.04)));
    },
  };
}
