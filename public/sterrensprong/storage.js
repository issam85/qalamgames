// Bewaren in de browser. Lukt dat niet (privévenster), dan werkt het spel gewoon door.
const KEY = 'sterrensprong';

export function readSave() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function patchSave(patch) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...readSave(), ...patch }));
  } catch {
    // niet bewaard
  }
}
