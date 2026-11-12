// De 3D-wereld: renderer, licht en camera blijven; vloer, muur en stad wisselen per wereld.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { starTexture } from './pattern.js';
import { createScenery } from './scenery.js';

const NIGHT = '#140a30';
const FLOOR_TILE = 4;
const WALL_TILE = 7;
const WALL_WIDTH = 140;
const WALL_HEIGHT = 56;
const PARALLAX = 0.25; // de muur schuift langzamer dan de stad en de vloer

function addFloor(stage, length) {
  const size = length + 120;
  const depth = 34;
  const map = starTexture(size / FLOOR_TILE, depth / FLOOR_TILE);
  const material = new THREE.MeshLambertMaterial({ map });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(size, 1, depth), material);
  floor.position.set(size / 2 - 40, -0.5, -3);
  stage.add(floor);
  const glow = new THREE.MeshBasicMaterial();
  [-1, 1].forEach((z) => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(size, 0.03, 0.09), glow);
    strip.position.set(size / 2 - 40, 0.02, z);
    stage.add(strip);
  });
  return { material, glow };
}

function addWall(stage) {
  const map = starTexture(WALL_WIDTH / WALL_TILE, WALL_HEIGHT / WALL_TILE);
  const material = new THREE.MeshBasicMaterial({ map, fog: false });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(WALL_WIDTH, WALL_HEIGHT), material);
  wall.position.set(0, WALL_HEIGHT / 2 - 2, -20);
  stage.add(wall);
  return { wall, map, material };
}

// geeft het geheugen van de vorige wereld terug aan de videokaart
function dispose(stage) {
  stage.traverse((item) => {
    item.geometry?.dispose();
    item.material?.map?.dispose();
    item.material?.dispose();
    if (item.isInstancedMesh) item.dispose();
  });
}

export function createWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(NIGHT);
  scene.fog = new THREE.Fog(NIGHT, 26, 70);
  scene.add(new THREE.HemisphereLight('#c9b9ff', '#2a1a66', 1.9));
  const sun = new THREE.DirectionalLight('#ffe9c4', 1.8);
  sun.position.set(-4, 10, 8);
  scene.add(sun);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  const tint = new THREE.Color();
  let parts = null;
  let distance = 14;
  let lift = 0;
  let shake = 0;
  let lastX = Infinity;

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

  // bouwt de vaste delen van een wereld en geeft de groep terug voor de hindernissen
  function load(level) {
    if (parts) {
      scene.remove(parts.stage);
      dispose(parts.stage);
    }
    const stage = new THREE.Group();
    scene.add(stage);
    const floor = addFloor(stage, level.length);
    parts = { stage, floor, ...addWall(stage), scenery: createScenery(stage, level) };
    lastX = Infinity;
    return stage;
  }

  function applyZone(zone, rate) {
    parts.material.color.lerp(tint.set(zone.wall), rate);
    parts.floor.material.color.lerp(tint.set(zone.floor), rate);
    parts.floor.glow.color.lerp(tint.set(zone.glow), rate);
  }

  function moveBackdrop() {
    parts.wall.position.x = camera.position.x;
    parts.map.offset.x = (camera.position.x * PARALLAX) / WALL_TILE;
    parts.scenery.update(camera.position.x);
  }

  // in het kleurenscherm staat de lantaarn groot in beeld, naast of boven de knoppen
  function showcase(run) {
    camera.position.set(run.x, 1.4, 5.4);
    if (camera.aspect >= 1.05) camera.lookAt(run.x - 1.5, 1, 0);
    else camera.lookAt(run.x, -0.8, 0);
    moveBackdrop();
  }

  function follow(run, dt, inMenu) {
    applyZone(run.level.zones[run.zone], run.x < lastX ? 1 : Math.min(1, dt * 2.5));
    lastX = run.x;
    if (inMenu) {
      showcase(run);
      return;
    }
    const want = run.fly ? 1.4 : Math.max(0, run.y - 2.5) * 0.6; // vliegen: plafond in beeld
    lift += (want - lift) * Math.min(1, dt * 5);
    shake = Math.max(0, shake - dt * 2.4);
    const jitterX = (Math.random() - 0.5) * shake;
    const jitterY = (Math.random() - 0.5) * shake;
    camera.position.set(run.x + 3.4 + jitterX, 3.8 + lift + jitterY, distance);
    camera.lookAt(run.x + 5.6 + jitterX, 2.5 + lift + jitterY, 0);
    moveBackdrop();
  }

  return {
    scene,
    load,
    follow,
    kick: (amount) => { shake = Math.max(shake, amount); },
    render: () => renderer.render(scene, camera),
  };
}
