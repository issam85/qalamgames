// Poorten: een grote gloeiende ovaal waar je doorheen gaat. Roze = vliegen, mint = weer lopen.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { glowSprite } from './pattern.js';

export const PORTAL_COLORS = { fly: '#ff6ec7', run: '#5cf2d6' };
const HEIGHT = 5.2;

function buildPortal(portal) {
  const color = PORTAL_COLORS[portal.mode];
  const group = new THREE.Group();
  group.position.set(portal.x, HEIGHT / 2, 0);
  group.rotation.y = Math.PI / 2 - 0.55; // schuin naar de camera, zodat je de ovaal ziet
  const frame = new THREE.Mesh(new THREE.TorusGeometry(1, 0.11, 10, 40), new THREE.MeshBasicMaterial({ color }));
  frame.scale.set(1, HEIGHT / 2, 1);
  const inner = new THREE.Mesh(
    new THREE.CircleGeometry(1, 40),
    new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.22, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }),
  );
  inner.scale.set(0.95, HEIGHT / 2 - 0.1, 1);
  const glow = glowSprite(color, 5);
  glow.scale.set(4, 8, 1);
  group.add(inner, frame, glow);
  return { group, inner };
}

export function createPortals(stage, level) {
  const portals = level.portals.slice(1).map(buildPortal);
  portals.forEach((p) => stage.add(p.group));
  let time = 0;
  return {
    update(dt) {
      time += dt;
      portals.forEach((p, i) => {
        p.inner.material.opacity = 0.18 + Math.sin(time * 5 + i) * 0.08;
        p.group.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.03);
      });
    },
  };
}
