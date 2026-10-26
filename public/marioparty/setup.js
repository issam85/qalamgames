// Keuzescherm: aantal spelers en karakters; levert de 4 deelnemers op.
import { CHARACTERS, characterCanvas } from './characters.js';

const PLAYER_COUNT = 4;
const picks = [null, null];
let humans = 1;

const startBtn = document.getElementById('start-btn');

function buildPicker(picker) {
  const slot = Number(picker.dataset.slot);
  CHARACTERS.forEach((ch) => {
    const card = document.createElement('button');
    card.className = 'char-card';
    card.dataset.key = ch.key;
    card.appendChild(characterCanvas(ch, 5));
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

export function initSetup(onStart) {
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      humans = Number(btn.dataset.humans);
      if (humans === 1) picks[1] = null;
      refreshSetup();
    });
  });
  document.querySelectorAll('.picker').forEach(buildPicker);
  startBtn.addEventListener('click', () => onStart(createPlayers()));
  refreshSetup();
}
