// Renderer, licht en de brede camera die de bal rustig volgt.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { FIELD } from './config.js';

const NIGHT = '#0d1440';
const FOV = 40;

export function createWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(NIGHT);
  scene.fog = new THREE.Fog(NIGHT, 60, 160);
  scene.add(new THREE.HemisphereLight('#c8d6ff', '#28305e', 1.6));
  const flood = new THREE.DirectionalLight('#fff4dc', 2);
  flood.position.set(-6, 18, 10);
  scene.add(flood);

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 400);
  let distance = 20;
  let camX = 0;

  // past de afstand aan zodat de hele breedte van het veld in beeld blijft
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    distance = 17 * Math.min(1.8, Math.max(1, 1.6 / camera.aspect));
  }
  window.addEventListener('resize', resize);
  resize();

  // schuin boven langs de lange zijde; volgt de bal maar niet tot voorbij de doelen
  function follow(target, dt) {
    const visibleHalf = Math.tan((FOV * Math.PI) / 360) * distance * camera.aspect;
    const limit = Math.max(0, FIELD.halfL + 2 - visibleHalf);
    const want = Math.max(-limit, Math.min(limit, target.x * 0.85));
    camX += (want - camX) * Math.min(1, dt * 3);
    camera.position.set(camX, distance * 0.62, distance * 0.86 + 2);
    camera.lookAt(camX, 0, 0.4);
  }

  return {
    scene,
    follow,
    render: () => renderer.render(scene, camera),
  };
}
