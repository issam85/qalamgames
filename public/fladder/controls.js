// Toetsen, tikken en de geluidsknop.
import { isMuted, setMuted, unlockSound } from './sound.js';

const FLAP_KEYS = ['Space', 'ArrowUp', 'KeyW'];

export function bindControls({ press, start, togglePause }) {
  addEventListener('keydown', (e) => {
    if (FLAP_KEYS.includes(e.code)) {
      e.preventDefault();
      if (!e.repeat) press();
    } else if (e.code === 'Escape' || e.code === 'KeyP') {
      togglePause();
    } else if (e.code === 'Enter') {
      start();
    }
  });
  document.getElementById('stage').addEventListener('pointerdown', (e) => {
    e.preventDefault();
    press();
  });
  const mute = document.getElementById('mute');
  const draw = () => {
    mute.textContent = isMuted() ? '🔇' : '🔊';
    mute.setAttribute('aria-label', isMuted() ? 'Geluid aan' : 'Geluid uit');
    mute.setAttribute('aria-pressed', String(isMuted()));
  };
  mute.addEventListener('click', () => {
    setMuted(!isMuted());
    unlockSound();
    draw();
  });
  draw();
}
