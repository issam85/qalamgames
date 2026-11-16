// Rondom het dak: lichtmasten, flats met verlichte ramen, sterren en de maan.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { FIELD } from './config.js';
import { windowTexture } from './textures.js';

function glow(color, size) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(canvas), blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
  }));
  sprite.scale.set(size, size, 1);
  return sprite;
}

function addMasts(group) {
  const steel = new THREE.MeshLambertMaterial({ color: '#8d94b0' });
  const lamp = new THREE.MeshBasicMaterial({ color: '#fff6d8' });
  const x = FIELD.halfL + 2.5, z = FIELD.halfW + 2.5;
  [[-x, -z], [x, -z], [-x, z], [x, z]].forEach(([px, pz]) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 12, 8), steel);
    pole.position.set(px, 6, pz);
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 0.3), lamp);
    head.position.set(px, 12, pz);
    head.lookAt(0, 0, 0);
    const halo = glow('rgba(255,240,200,.9)', 6);
    halo.position.copy(head.position);
    group.add(pole, head, halo);
  });
}

// flats in een ring rond het dak, lager dan het dak zodat je over de stad heen kijkt
function addSkyline(group) {
  const tex = windowTexture();
  const count = 70;
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial({ map: tex });
  const flats = new THREE.InstancedMesh(geo, mat, count);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.05;
    const dist = 48 + Math.random() * 40;
    const w = 6 + Math.random() * 8, h = 14 + Math.random() * 34, d = 6 + Math.random() * 6;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a);
    m.compose(new THREE.Vector3(Math.cos(a) * dist * 1.3, h / 2 - 24, Math.sin(a) * dist), q, new THREE.Vector3(w, h, d));
    flats.setMatrixAt(i, m);
  }
  group.add(flats);
}

function addSky(group) {
  const pts = [];
  for (let i = 0; i < 400; i++) {
    const a = Math.random() * Math.PI * 2, up = 0.15 + Math.random() * 0.8;
    pts.push(Math.cos(a) * 180 * Math.cos(up), 180 * Math.sin(up), Math.sin(a) * 180 * Math.cos(up));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  group.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: '#ffffff', size: 1.2, sizeAttenuation: false, fog: false })));
  const moon = new THREE.Mesh(new THREE.SphereGeometry(5, 24, 16), new THREE.MeshBasicMaterial({ color: '#fff3c4', fog: false }));
  moon.position.set(-60, 55, -150);
  const halo = glow('rgba(255,243,196,.5)', 30);
  halo.position.copy(moon.position);
  group.add(moon, halo);
}

export function createCity(scene) {
  const group = new THREE.Group();
  addMasts(group);
  addSkyline(group);
  addSky(group);
  scene.add(group);
  return group;
}
