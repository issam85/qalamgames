// Het muziekdoosje: acht toetsen en drie eigen liedjes (zelf bedacht, geen bestaande
// nummers). Het geluid wordt in de browser gemaakt; lukt dat niet, dan blijft het stil.
const NOTES = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];
const STEP_MS = 330;
const R = -1; // rust

// per liedje de toetsen op een rij (0 – 7), R = even stil
export const TUNES = [
  ['Sterrenlicht', [0, 2, 4, 2, 3, 2, 1, R, 0, 2, 4, 5, 4, R, 2, R, 3, 4, 3, 1, 2, R, 0, R]],
  ['Maanwiegje', [5, 4, 2, 4, 5, R, 7, R, 6, 5, 4, 2, 3, R, R, R, 2, 4, 5, 4, 2, 1, 0, R]],
  ['Droomwolk', [0, 0, 2, 4, 4, 2, 3, R, 1, 1, 3, 5, 5, 3, 4, R, 4, 5, 4, 2, 1, 2, 0, R]],
];

let audio = null;
let timers = [];

// één toets: een heldere toon die snel wegsterft, zoals een muziekdoosje
export function playKey(index) {
  try {
    audio = audio || new AudioContext();
    const now = audio.currentTime;
    const tone = audio.createOscillator();
    const volume = audio.createGain();
    tone.type = 'triangle';
    tone.frequency.value = NOTES[index];
    volume.gain.setValueAtTime(0.25, now);
    volume.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    tone.connect(volume).connect(audio.destination);
    tone.start(now);
    tone.stop(now + 0.95);
  } catch {
    // geen geluid op dit apparaat
  }
}

export function stopTune() {
  timers.forEach(clearTimeout);
  timers = [];
}

// speelt een liedje; onKey(toets) bij elke stap (-1 = rust), onEnd() als het uit is
export function playTune(steps, onKey, onEnd) {
  stopTune();
  timers = steps.map((key, n) => setTimeout(() => {
    if (key !== R) playKey(key);
    onKey(key);
  }, n * STEP_MS));
  timers.push(setTimeout(onEnd, steps.length * STEP_MS + 300));
}
