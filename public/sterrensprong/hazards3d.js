// Sterzagen die rondtollen en knotsen die aan een ketting zwaaien.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { glowSprite } from './pattern.js';
import { maceBall } from './hazards.js';

const DANGER = '#ff4d8d';

// een achtpuntige ster met scherpe punten, als dikke schijf
function sawGeometry() {
  const shape = new THREE.Shape();
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    const r = i % 2 ? 0.66 : 1;
    if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.24, bevelEnabled: false });
  geometry.translate(0, 0, -0.12);
  return geometry;
}

function buildSaw(ob, parts) {
  const group = new THREE.Group();
  group.position.set(ob.cx, ob.cy, 0);
  group.scale.setScalar(ob.r);
  const blade = new THREE.Mesh(parts.blade, parts.steel);
  const rim = new THREE.LineSegments(parts.edges, parts.rim);
  const hub = new THREE.Mesh(parts.hub, parts.gold);
  hub.rotation.x = Math.PI / 2;
  group.add(blade, rim, hub);
  return group;
}

function buildMace(ob, parts) {
  const pivot = new THREE.Group();
  pivot.position.set(ob.px, ob.py, 0);
  const swing = new THREE.Group();
  const chain = new THREE.Mesh(parts.chain, parts.gold);
  chain.scale.y = ob.length;
  chain.position.y = -ob.length / 2;
  const ball = new THREE.Group();
  ball.position.y = -ob.length;
  ball.scale.setScalar(ob.r);
  ball.add(new THREE.Mesh(parts.ball, parts.metal), new THREE.Mesh(parts.spikes, parts.spikeMat), glowSprite(DANGER, 2.6));
  swing.add(chain, ball);
  const hook = new THREE.Mesh(parts.hook, parts.gold);
  pivot.add(swing, hook);
  return { ob, pivot, swing };
}

// stekels: een kegeltje op elke hoek van een twintigvlak
function spikeBall() {
  const corners = new THREE.IcosahedronGeometry(1, 0).attributes.position;
  const seen = new Set();
  const cones = [];
  const v = new THREE.Vector3();
  for (let i = 0; i < corners.count; i++) {
    v.fromBufferAttribute(corners, i);
    const key = v.toArray().map((n) => n.toFixed(2)).join();
    if (seen.has(key)) continue;
    seen.add(key);
    const cone = new THREE.ConeGeometry(0.3, 0.7, 6);
    cone.translate(0, 1.1, 0);
    cone.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize()));
    cones.push(cone);
  }
  return cones;
}

function mergeCones(cones) {
  const positions = [];
  cones.forEach((cone) => {
    const g = cone.toNonIndexed();
    positions.push(...g.attributes.position.array);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function createHazards(stage, level) {
  const blade = sawGeometry();
  const parts = {
    blade,
    edges: new THREE.EdgesGeometry(blade),
    hub: new THREE.CylinderGeometry(0.3, 0.3, 0.34, 16),
    chain: new THREE.CylinderGeometry(0.05, 0.05, 1, 6),
    hook: new THREE.TorusGeometry(0.22, 0.06, 8, 16),
    ball: new THREE.IcosahedronGeometry(1, 1),
    spikes: mergeCones(spikeBall()),
    metal: new THREE.MeshLambertMaterial({ color: '#2b1640', emissive: '#3a0f2a' }),
    steel: new THREE.MeshLambertMaterial({ color: '#e4defa', emissive: '#4a3a6e' }),
    spikeMat: new THREE.MeshLambertMaterial({ color: DANGER, emissive: '#7a1040' }),
    rim: new THREE.LineBasicMaterial({ color: DANGER }),
    gold: new THREE.MeshLambertMaterial({ color: '#ffd43b', emissive: '#6a4a00' }),
  };
  const saws = level.obstacles.filter((o) => o.type === 'saw').map((ob) => buildSaw(ob, parts));
  const maces = level.obstacles.filter((o) => o.type === 'mace').map((ob) => buildMace(ob, parts));
  saws.forEach((s) => stage.add(s));
  maces.forEach((m) => stage.add(m.pivot));
  return {
    update(run, dt) {
      saws.forEach((s) => { s.rotation.z -= dt * 7; });
      maces.forEach((m) => { m.swing.rotation.z = maceBall(m.ob, run.x).angle; });
    },
  };
}
