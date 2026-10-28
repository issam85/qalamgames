// Camera-regie voor de sprint: openingsshot tijdens het aftellen, de kopgroep
// schuin van voren volgen met zoom op de afstand tussen de lopers, en inzoomen bij
// de finish. De lopers rennen op de camera af, zoals bij een tv-registratie.
import * as THREE from './vendor/three.module.min.js';
import { TRACK_LEN } from './sprint-track.js';

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

// openingsshot: van hoog en breed naar laag vóór de startlijn, terugkijkend
function introShot(t) {
  const k = ease(Math.min(1, t));
  wantPos.set(-16 + k * 25.9, 18 - k * 14.705, 36 - k * 28.54);
  wantLook.set(12 - k * 16.15, 0.4 + k * 0.6, -k * 1);
  return 40 - k * 5;
}

// hangt vóór de kopgroep en kijkt terug, zodat de lopers op de camera af rennen; zoomt
// uit tot de langzaamste speler erin past. Is die te ver achter, dan blijft de speler
// in beeld en mag de kop eruit lopen
function followShot(xs, humans, turbo) {
  const lead = Math.max(...xs);
  const back = Math.min(lead - 3, ...humans);
  const front = lead - back > 26 ? back + 16 : lead;
  const span = front - back;
  const dist = Math.min(15, 6.5 + span * 0.32);
  wantPos.set(Math.min(front + 9 + span * 0.3, TRACK_LEN + 6), 2.4 + dist * 0.12, dist);
  // iets voor het midden van de groep: de achterste loper blijft rechts van de HUD
  wantLook.set(front - span * 0.55 - 2.5, 1, -1);
  // bij turbo een iets wijdere blik: voelt sneller
  return turbo ? 40 : 35;
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
