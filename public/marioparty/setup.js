// Keuzescherm: aantal spelers, filmpjes aan/uit en karakters; levert de 4
// deelnemers op. De filmpjeskeuze wordt onthouden op dit apparaat.
import { CHARACTERS, characterImage } from './characters.js';

const PLAYER_COUNT = 4;
const CLIPS_KEY = 'marioparty-clips';
const picks = [null, null];
let humans = 1;
let clips = true;

function loadClips() {
  try {
    clips = localStorage.getItem(CLIPS_KEY) !== '0';
  } catch {
    clips = true;
  }
}

function saveClips() {
  try {
    localStorage.setItem(CLIPS_KEY, clips ? '1' : '0');
  } catch {
    // privémodus of opslag geblokkeerd: dan alleen voor dit bezoek
  }
}

const startBtn = document.getElementById('start-btn');

function buildPicker(picker) {
  const slot = Number(picker.dataset.slot);
  CHARACTERS.forEach((ch) => {
    const card = document.createElement('button');
    card.className = 'char-card';
    card.dataset.key = ch.key;
    card.appendChild(characterImage(ch, 96));
    const name = document.createElement('span');
    name.textContent = ch.name;
    card.appendChild(name);
    card.addEventListener('click', () => {
      picks[slot] = ch.key;
      refreshSetup();
    });
    picker.appendChild(card);
  });
}

function refreshSetup() {
  document.querySelectorAll('.picker').forEach((picker) => {
    const slot = Number(picker.dataset.slot);
    picker.querySelectorAll('.char-card').forEach((card) => {
      const takenByOther = picks.some((key, i) => i !== slot && key === card.dataset.key);
      card.classList.toggle('selected', picks[slot] === card.dataset.key);
      card.disabled = takenByOther;
    });
  });
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.classList.toggle('selected', Number(btn.dataset.humans) === humans);
  });
  document.querySelectorAll('.clip-btn').forEach((btn) => {
    btn.classList.toggle('selected', Boolean(Number(btn.dataset.clips)) === clips);
  });
  document.getElementById('pick-block-2').hidden = humans < 2;
  startBtn.disabled = !picks.slice(0, humans).every(Boolean);
}

function makePlayer(key, control) {
  const character = CHARACTERS.find((ch) => ch.key === key);
  return { character, control, step: 0, stars: 0, points: 0 };
}

function createPlayers() {
  const humanKeys = picks.slice(0, humans);
  const players = humanKeys.map((key, i) => makePlayer(key, `Speler ${i + 1}`));
  const free = CHARACTERS.filter((ch) => !humanKeys.includes(ch.key));
  while (players.length < PLAYER_COUNT) {
    const [pick] = free.splice(Math.floor(Math.random() * free.length), 1);
    players.push(makePlayer(pick.key, 'CPU'));
  }
  return players;
}

// onStart(players, { clips }): clips = of de filmpjes mogen spelen
export function initSetup(onStart) {
  loadClips();
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      humans = Number(btn.dataset.humans);
      if (humans === 1) picks[1] = null;
      refreshSetup();
    });
  });
  document.querySelectorAll('.clip-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      clips = Boolean(Number(btn.dataset.clips));
      saveClips();
      refreshSetup();
    });
  });
  document.querySelectorAll('.picker').forEach(buildPicker);
  startBtn.addEventListener('click', () => onStart(createPlayers(), { clips }));
  refreshSetup();
}
