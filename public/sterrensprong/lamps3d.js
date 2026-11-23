// Kleurlampen in 3D: gouden en blauwe blokken (vast = vol, uit = doorschijnend), lichtzuilen en
// zwevende lampen. De regels staan in lamps.js.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { glowSprite } from './pattern.js';
import { addNeonEdges } from './neon.js';
import { styleOf } from './styles.js';

export const TONE_COLORS = { gold: '#ffc23d', blue: '#3fa9ff' };
const DEPTH = 1.7;
const GHOST = 0.16; // zo doorzichtig is een blok in de kleur die uit staat
const HEAD = 6.4; // hoogte van de kop van een lichtzuil

const box = (x, y, sx, sy) =>
  new THREE.Matrix4().makeTranslation(x, y, 0).scale(new THREE.Vector3(sx, sy, DEPTH));

function toneBlocks(stage, blocks, tone, style) {
  if (!blocks.length) return null;
  const cells = [];
  blocks.forEach((b) => {
    for (let x = 0; x < b.w; x++) for (let y = 0; y < b.h; y++) cells.push(box(b.x + x + 0.5, b.y + y + 0.5, 1, 1));
  });
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({
    map: style.block(), color: TONE_COLORS[tone], emissive: TONE_COLORS[tone], emissiveIntensity: 0.25,
    transparent: true,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, cells.length);
  cells.forEach((m, i) => mesh.setMatrixAt(i, m));
  mesh.frustumCulled = false;
  stage.add(mesh);
  const outlines = blocks.map((b) => box(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h));
  const edges = addNeonEdges(stage, geometry, outlines, '#ffffff', 0.07);
  edges.material.transparent = true;
  edges.material.color.set(TONE_COLORS[tone]).lerp(new THREE.Color('#ffffff'), 0.5);
  return { tone, mesh, edges, shown: 1 };
}

function buildLamp(ob) {
  const color = TONE_COLORS[ob.tone];
  const group = new THREE.Group();
  const shine = new THREE.MeshBasicMaterial({ color });
  if (ob.beam) {
    const column = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, HEAD, 10),
      new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false,
      }),
    );
    column.position.y = HEAD / 2;
    const head = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), shine);
    head.position.y = HEAD;
    const glow = glowSprite(color, 4);
    glow.position.y = HEAD;
    group.add(column, head, glow);
    group.position.set(ob.x + ob.w / 2, 0, 0);
  } else {
    const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1), shine);
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 10, 4), new THREE.MeshBasicMaterial({ color: '#d8c8a0' }));
    chain.position.y = 5.5;
    group.add(ball, chain, glowSprite(color, 3));
    group.position.set(ob.x + ob.w / 2, ob.y + ob.h / 2, 0);
  }
  return { ob, group };
}

export function createLamps(stage, level) {
  const style = styleOf(level);
  const blocks = level.obstacles.filter((o) => o.type === 'block' && o.tone);
  const sets = ['gold', 'blue'].map((t) => toneBlocks(stage, blocks.filter((b) => b.tone === t), t, style)).filter(Boolean);
  const lamps = level.obstacles.filter((o) => o.type === 'lamp').map(buildLamp);
  lamps.forEach((l) => stage.add(l.group));
  let time = 0;
  return {
    used: lamps.length > 0,
    update(run, dt) {
      time += dt;
      sets.forEach((s) => {
        const want = s.tone === run.tone ? 1 : GHOST;
        s.shown += (want - s.shown) * Math.min(1, dt * 12);
        s.mesh.material.opacity = s.shown;
        s.mesh.material.depthWrite = s.shown > 0.9;
        s.edges.material.opacity = 0.3 + s.shown * 0.7;
      });
      lamps.forEach((l, i) => {
        const on = l.ob.tone === run.tone; // deze kleur staat al aan: kleiner en stil
        const beat = on ? 0.7 : 1 + Math.sin(time * 6 + i) * 0.08;
        if (!l.ob.beam) l.group.scale.setScalar(beat);
      });
    },
  };
}
