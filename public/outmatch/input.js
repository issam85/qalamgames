// Toetsen per speler, plus de aanraakknoppen. Met één speler sturen beide sets dezelfde speler.
import { touchState } from './touch.js';

export const KEYS = {
  p1: {
    up: ['KeyW'], down: ['KeyS'], left: ['KeyA'], right: ['KeyD'],
    sprint: ['ShiftLeft'], shoot: ['KeyF'], pass: ['Space'], lob: ['KeyR'], tackle: ['KeyE'], call: ['KeyQ'],
  },
  p2: {
    up: ['ArrowUp'], down: ['ArrowDown'], left: ['ArrowLeft'], right: ['ArrowRight'],
    sprint: ['ShiftRight'], shoot: ['Enter'], pass: ['Slash'], lob: ['Period'], tackle: ['Quote'], call: ['Backslash'],
  },
};

const ALL = new Set(Object.values(KEYS).flatMap((set) => Object.values(set).flat()));

export function createInput() {
  const down = new Set();
  window.addEventListener('keydown', (e) => {
    if (!ALL.has(e.code)) return;
    e.preventDefault();
    document.body.classList.remove('touch'); // wie toetsen gebruikt, heeft geen knoppen nodig
    down.add(e.code);
  });
  window.addEventListener('keyup', (e) => down.delete(e.code));
  window.addEventListener('blur', () => down.clear());

  const held = (sets, action) => sets.some((set) => set[action].some((code) => down.has(code)));

  // ids: de spelers die echt meespelen, bv. ['p1'] of ['p1', 'p2']
  function intents(ids) {
    const result = {};
    ids.forEach((id) => {
      const sets = ids.length === 1 ? [KEYS.p1, KEYS.p2] : [KEYS[id]];
      const t = touchState(id) || {};
      const key = (action) => held(sets, action) || Boolean(t[action]);
      const clamp = (v) => Math.max(-1, Math.min(1, v));
      result[id] = {
        x: clamp(held(sets, 'right') - held(sets, 'left') + (t.x || 0)),
        z: clamp(held(sets, 'down') - held(sets, 'up') + (t.z || 0)), // naar beneden in beeld = naar de camera
        sprint: key('sprint'),
        shoot: key('shoot'),
        pass: key('pass'),
        lob: key('lob'),
        tackle: key('tackle'),
        call: key('call'),
      };
    });
    return result;
  }

  return { intents };
}
