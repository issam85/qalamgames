// Decor langs de baan: tribune voor het publiek, blauwe borden met pijlen en een geel
// finishbord met geruite vlaggen. Alles getekend op canvas-texturen.
import * as THREE from './vendor/three.module.min.js';
import { TRACK_LEN } from './sprint-track.js';

// hoogte van de bovenkant van de twee tribunetreden (het publiek staat erop)
export const STAND_TOPS = [0.2, 1.1];

function canvasTex(draw, w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

// blauw bord met drie witte pijlen naar rechts (looprichting)
const arrowTex = () => canvasTex((ctx, w, h) => {
  ctx.fillStyle = '#4f86c6';
  roundRect(ctx, 0, 0, w, h, 18);
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 3; i++) {
    const x = 40 + i * 70;
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x + 34, h / 2);
    ctx.lineTo(x, h - 20);
    ctx.lineTo(x + 18, h - 20);
    ctx.lineTo(x + 52, h / 2);
    ctx.lineTo(x + 18, 20);
    ctx.fill();
  }
}, 280, 110);

// geel bord met twee gekruiste geruite vlaggen
const finishTex = () => canvasTex((ctx, w, h) => {
  ctx.fillStyle = '#f5c518';
  roundRect(ctx, 0, 0, w, h, 18);
  [[w / 2 - 50, -0.35], [w / 2 + 10, 0.35]].forEach(([x, rot]) => {
    ctx.save();
    ctx.translate(x + 20, 26);
    ctx.rotate(rot);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = (r + c) % 2 ? '#222' : '#fff';
        ctx.fillRect(c * 10, r * 10, 10, 10);
      }
    }
    ctx.fillStyle = '#444';
    ctx.fillRect(-3, 0, 3, 56);
    ctx.restore();
  });
}, 280, 110);

function board(tex, x, z) {
  const group = new THREE.Group();
  const face = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 0.12), [
    ...Array(4).fill(new THREE.MeshLambertMaterial({ color: '#3a6aa8' })),
    new THREE.MeshLambertMaterial({ map: tex }),
    new THREE.MeshLambertMaterial({ color: '#3a6aa8' }),
  ]);
  face.position.y = 0.9;
  face.rotation.x = -0.25;
  const legMat = new THREE.MeshLambertMaterial({ color: '#d0d6de' });
  [-1.1, 1.1].forEach((lx) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.12), legMat);
    leg.position.set(lx, 0.35, -0.1);
    group.add(leg);
  });
  group.add(face);
  group.position.set(x, 0, z);
  return group;
}

export function buildDecor(scene, trackWidth) {
  const back = -trackWidth / 2;
  // tribune: twee lage treden achter de randsteen, zodat de achterste rij hoger staat
  const standMat = new THREE.MeshLambertMaterial({ color: '#e7ecf2' });
  const len = TRACK_LEN + 24;
  [[STAND_TOPS[0], back - 2.2], [STAND_TOPS[1], back - 3.8]].forEach(([top, z]) => {
    const step = new THREE.Mesh(new THREE.BoxGeometry(len, top + 0.4, 1.6), standMat);
    step.position.set(TRACK_LEN / 2 + 3, top / 2 - 0.2, z);
    scene.add(step);
  });
  const arrows = arrowTex();
  [4, 18, 32, 46].forEach((x) => scene.add(board(arrows, x, back - 1.2)));
  scene.add(board(finishTex(), TRACK_LEN + 6, back - 1.2));
}
