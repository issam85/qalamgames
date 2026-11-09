// De 3D-wereld: renderer, licht, vloer, sterrenmuur en de camera die meeloopt.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { starTexture } from './pattern.js';

const NIGHT = '#140a30';
const FLOOR_TILE = 4;
const WALL_TILE = 7;
const WALL_WIDTH = 140;
const WALL_HEIGHT = 56;
const PARALLAX = 0.4; // de muur schuift langzamer dan de vloer

function addFloor(scene, length) {
  const size = length + 120;
  const depth = 34;
  const map = starTexture(
    { background: '#1a1048', fill: '#21145c', line: '#4a37a8', width: 3 },
    size / FLOOR_TILE,
    depth / FLOOR_TILE,
  );
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(size, 1, depth),
    new THREE.MeshLambertMaterial({ map }),
  );
  floor.position.set(size / 2 - 40, -0.5, -3);
  scene.add(floor);
  const glow = new THREE.MeshBasicMaterial({ color: '#38e8d8' });
  [-1, 1].forEach((z) => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(size, 0.03, 0.07), glow);
    strip.position.set(size / 2 - 40, 0.02, z);
    scene.add(strip);
  });
}

function addWall(scene) {
  const map = starTexture(
    { background: '#1c1050', fill: '#261766', line: '#3f2c96', width: 4 },
    WALL_WIDTH / WALL_TILE,
    WALL_HEIGHT / WALL_TILE,
  );
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(WALL_WIDTH, WALL_HEIGHT),
    new THREE.MeshBasicMaterial({ map, fog: false }),
  );
  wall.position.set(0, WALL_HEIGHT / 2 - 2, -20);
  scene.add(wall);
  return { wall, map };
}

export function createWorld(canvas, level) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(NIGHT);
  scene.fog = new THREE.Fog(NIGHT, 26, 70);
  scene.add(new THREE.HemisphereLight('#b9a6ff', '#2a1a66', 1.7));
  const sun = new THREE.DirectionalLight('#ffe9c4', 1.6);
  sun.position.set(-4, 10, 8);
  scene.add(sun);

  addFloor(scene, level.length);
  const { wall, map } = addWall(scene);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  let distance = 14;
  let lift = 0;

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    distance = 14 * Math.min(2, Math.max(1, 1.6 / camera.aspect));
  }
  window.addEventListener('resize', resize);
  resize();

  function follow(run, dt) {
    lift += (Math.max(0, run.y - 2.5) * 0.6 - lift) * Math.min(1, dt * 5);
    camera.position.set(run.x + 3.4, 3.8 + lift, distance);
    camera.lookAt(run.x + 5.6, 2.5 + lift, 0);
    wall.position.x = camera.position.x;
    map.offset.x = (camera.position.x * PARALLAX) / WALL_TILE;
  }

  return { scene, follow, render: () => renderer.render(scene, camera) };
}
