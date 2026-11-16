// Beste score en geluid aan/uit, bewaard op dit apparaat.
const KEY = 'fladder';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...read(), ...data }));
  } catch {
    // Geen opslag: dan geldt het alleen voor nu.
  }
}

export const loadBest = () => read().best || 0;
export const saveBest = (best) => write({ best });
export const loadMuted = () => read().muted === true;
export const saveMuted = (muted) => write({ muted });
