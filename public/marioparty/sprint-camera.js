// Camera-regie voor de sprint: openingsshot tijdens het aftellen, de kopgroep
// volgen met zoom op de afstand tussen de lopers, en inzoomen bij de finish.
import * as THREE from './vendor/three.module.min.js';

const look = new THREE.Vector3();
const jitter = new THREE.Vector3();
const wantPos = new THREE.Vector3();
const wantLook = new THREE.Vector3();

function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

export function createDirector(camera) {
  return { camera, pos: new THREE.Vector3(-16, 18, 36), look: new THREE.Vector3(12, 0.4, 0), fov: 40 };
}

// openingsshot: van hoog en breed naar laag bij de startlijn
function introShot(t) {
  const k = ease(Math.min(1, t));
  wantPos.set(-16 + k * 10.5, 18 - k * 12.2, 36 - k * 24.5);
  wantLook.set(12 - k * 8, 0.4 + k * 0.4, -k * 1);
  return 40 - k * 8;
}

// volgt de kopgroep, maar houdt de menselijke spelers in beeld: zoomt uit tot de
// langzaamste speler erin past; is dat te ver, dan blijft de speler in beeld
function followShot(xs, humans, turbo) {
  const lead = Math.max(...xs);
  const back = Math.min(lead - 3, ...humans);
  const spread = lead - back;
  const focus = spread > 26 ? back + 10 : (lead + back) / 2 + 2;
  const dist = Math.min(24, 11.5 + spread * 0.55);
  wantPos.set(focus - 6, 3 + dist * 0.2, dist);
  wantLook.set(focus + 1.5, 0.6, -1.5);
  // bij turbo een iets wijdere blik: voelt sneller
  return turbo ? 37 : 32;
}

function finishShot(x, z) {
  // voorbij de finish, terugkijkend: de palen staan dan niet tussen camera en winnaar
  wantPos.set(x + 5, 3, z + 9);
  wantLook.set(x - 0.5, 1.1, z);
  return 30;
}

// shot: { mode: 'intro' | 'follow' | 'finish', t, xs, x, z }; shake in wereldeenheden
export function updateDirector(d, dt, shot, shake = 0) {
  let fov;
  let rate = 3;
  if (shot.mode === 'intro') {
    fov = introShot(shot.t);
    rate = 12;
  } else if (shot.mode === 'finish') {
    fov = finishShot(shot.x, shot.z);
    rate = 5;
  } else {
    fov = followShot(shot.xs, shot.humans || [], shot.turbo);
  }
  const k = 1 - Math.exp(-dt * rate);
  d.pos.lerp(wantPos, k);
  d.look.lerp(wantLook, k);
  d.fov += (fov - d.fov) * k;
  const cam = d.camera;
  cam.position.copy(d.pos);
  if (shake > 0) cam.position.add(jitter.set((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake, 0));
  look.copy(d.look);
  cam.lookAt(look);
  if (Math.abs(cam.fov - d.fov) > 0.01) {
    cam.fov = d.fov;
    cam.updateProjectionMatrix();
  }
}
