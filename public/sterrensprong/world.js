// De 3D-wereld: renderer, licht, vloer, sterrenmuur, kleurzones en de meelopende camera.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { starTexture } from './pattern.js';
import { createScenery } from './scenery.js';

const NIGHT = '#140a30';
const FLOOR_TILE = 4;
const WALL_TILE = 7;
const WALL_WIDTH = 140;
const WALL_HEIGHT = 56;
const PARALLAX = 0.25; // de muur schuift langzamer dan de stad en de vloer

function addFloor(scene, length) {
  const size = length + 120;
  const depth = 34;
  const map = starTexture(size / FLOOR_TILE, depth / FLOOR_TILE);
  const material = new THREE.MeshLambertMaterial({ map });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(size, 1, depth), material);
  floor.position.set(size / 2 - 40, -0.5, -3);
  scene.add(floor);
  const glow = new THREE.MeshBasicMaterial();
  [-1, 1].forEach((z) => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(size, 0.03, 0.09), glow);
    strip.position.set(size / 2 - 40, 0.02, z);
    scene.add(strip);
  });
  return { material, glow };
}

function addWall(scene) {
  const map = starTexture(WALL_WIDTH / WALL_TILE, WALL_HEIGHT / WALL_TILE);
  const material = new THREE.MeshBasicMaterial({ map, fog: false });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(WALL_WIDTH, WALL_HEIGHT), material);
  wall.position.set(0, WALL_HEIGHT / 2 - 2, -20);
  scene.add(wall);
  return { wall, map, material };
}

function zoneAt(zones, x) {
  let zone = zones[0];
  zones.forEach((z) => { if (x >= z.x) zone = z; });
  return zone;
}

export function createWorld(canvas, level) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(NIGHT);
  scene.fog = new THREE.Fog(NIGHT, 26, 70);
  scene.add(new THREE.HemisphereLight('#c9b9ff', '#2a1a66', 1.9));
  const sun = new THREE.DirectionalLight('#ffe9c4', 1.8);
  sun.position.set(-4, 10, 8);
  scene.add(sun);

  const floor = addFloor(scene, level.length);
  const { wall, map, material: wallMaterial } = addWall(scene);
  const scenery = createScenery(scene, level);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  const tint = new THREE.Color();
  let distance = 14;
  let lift = 0;
  let shake = 0;
  let lastX = Infinity; // eerste beeld meteen in de juiste kleur

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

  function applyZone(x, rate) {
    const zone = zoneAt(level.zones, x);
    wallMaterial.color.lerp(tint.set(zone.wall), rate);
    floor.material.color.lerp(tint.set(zone.floor), rate);
    floor.glow.color.lerp(tint.set(zone.glow), rate);
  }

  // in het kleurenscherm staat de lantaarn groot in beeld, naast of boven de knoppen
  function showcase(run) {
    camera.position.set(run.x, 1.4, 5.4);
    if (camera.aspect >= 1.05) camera.lookAt(run.x - 1.5, 1, 0);
    else camera.lookAt(run.x, -0.8, 0);
    wall.position.x = camera.position.x;
    scenery.update(camera.position.x);
  }

  function follow(run, dt, inMenu) {
    applyZone(run.x, run.x < lastX ? 1 : Math.min(1, dt * 2.5));
    lastX = run.x;
    if (inMenu) {
      showcase(run);
      return;
    }
    lift += (Math.max(0, run.y - 2.5) * 0.6 - lift) * Math.min(1, dt * 5);
    shake = Math.max(0, shake - dt * 2.4);
    const jitterX = (Math.random() - 0.5) * shake;
    const jitterY = (Math.random() - 0.5) * shake;
    camera.position.set(run.x + 3.4 + jitterX, 3.8 + lift + jitterY, distance);
    camera.lookAt(run.x + 5.6 + jitterX, 2.5 + lift + jitterY, 0);
    wall.position.x = camera.position.x;
    map.offset.x = (camera.position.x * PARALLAX) / WALL_TILE;
    scenery.update(camera.position.x);
  }

  return {
    scene,
    follow,
    kick: (amount) => { shake = Math.max(shake, amount); },
    render: () => renderer.render(scene, camera),
  };
}
