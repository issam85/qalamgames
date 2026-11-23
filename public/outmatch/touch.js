// Bediening voor tablet en telefoon: per speler een joystick (links) en knoppen (rechts).
// De joystick verschijnt waar je duim neerkomt. Met twee spelers heeft ieder een eigen helft.
const RADIUS = 46; // hoe ver je de knop kunt slepen, in pixels
const DEAD = 0.18; // een klein beetje slepen telt nog niet
const BUTTONS = [['lob', 'Lob'], ['tackle', 'Tackle'], ['sprint', 'Sprint'], ['pass', 'Pas'], ['shoot', 'Schiet']];

const pads = document.createElement('div');
pads.id = 'pads';
document.body.append(pads);
const states = {};

function stick(el, state) {
  const base = el.querySelector('.base');
  const knob = el.querySelector('.knob');
  let id = null, ox = 0, oy = 0;
  const rest = () => {
    id = null;
    Object.assign(state, { x: 0, z: 0 });
    base.removeAttribute('style');
    knob.style.transform = '';
  };
  el.addEventListener('pointerdown', (e) => {
    if (id !== null) return;
    id = e.pointerId;
    const box = el.getBoundingClientRect();
    ox = e.clientX;
    oy = e.clientY;
    base.style.cssText = `left:${ox - box.left}px;top:${oy - box.top}px;bottom:auto`;
    el.setPointerCapture(id); // de duim mag buiten het vak schuiven
  });
  el.addEventListener('pointermove', (e) => {
    if (e.pointerId !== id) return;
    const dx = e.clientX - ox, dy = e.clientY - oy;
    const len = Math.hypot(dx, dy);
    const k = Math.min(1, len / RADIUS);
    const nx = len ? dx / len : 0, ny = len ? dy / len : 0;
    knob.style.transform = `translate(${nx * k * RADIUS}px, ${ny * k * RADIUS}px)`;
    const power = k < DEAD ? 0 : (k - DEAD) / (1 - DEAD);
    Object.assign(state, { x: nx * power, z: ny * power }); // omlaag in beeld = naar de camera
  });
  ['pointerup', 'pointercancel'].forEach((type) => el.addEventListener(type, (e) => {
    if (e.pointerId === id) rest();
  }));
}

function button(el, state, action) {
  const up = () => { state[action] = false; el.classList.remove('down'); };
  el.addEventListener('pointerdown', (e) => {
    state[action] = true;
    el.classList.add('down');
    el.setPointerCapture(e.pointerId); // ook loslaten naast de knop telt
  });
  ['pointerup', 'pointercancel'].forEach((type) => el.addEventListener(type, up));
}

// bouwt de pads opnieuw voor deze spelers, bv. ['p1'] of ['p1', 'p2']
export function setTouchPlayers(ids) {
  pads.innerHTML = ids.map((id) => `<div class="pad ${id}">
    <div class="stick"><b class="tag">${id.toUpperCase()}</b><div class="base"><div class="knob"></div></div></div>
    <div class="btns">${BUTTONS.map(([a, t]) => `<button type="button" class="tb ${a}" data-a="${a}">${t}</button>`).join('')}</div>
  </div>`).join('');
  ids.forEach((id) => {
    const state = { x: 0, z: 0 };
    states[id] = state;
    const pad = pads.querySelector(`.pad.${id}`);
    stick(pad.querySelector('.stick'), state);
    pad.querySelectorAll('.tb').forEach((b) => button(b, state, b.dataset.a));
  });
}

export const touchState = (id) => states[id];

// aanraakknoppen tonen op een tablet of telefoon, of zodra iemand het scherm aanraakt
const coarse = window.matchMedia('(pointer: coarse)').matches;
document.body.classList.toggle('touch', coarse);
window.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'touch') document.body.classList.add('touch');
}, true);
