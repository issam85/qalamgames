// Toetsen per speler. Met één speler sturen beide sets dezelfde speler.
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
      result[id] = {
        x: held(sets, 'right') - held(sets, 'left'),
        z: held(sets, 'down') - held(sets, 'up'), // naar beneden in beeld = naar de camera
        sprint: held(sets, 'sprint'),
        shoot: held(sets, 'shoot'),
        pass: held(sets, 'pass'),
        lob: held(sets, 'lob'),
        tackle: held(sets, 'tackle'),
      };
    });
    return result;
  }

  return { intents };
}
