// Spelverloop. Stap 1: spelers kiezen en de trap tonen.
import { CHARACTERS, characterCanvas } from './characters.js';
import { renderBoard, renderHud } from './board.js';

const ROUNDS = 5;
const PLAYER_COUNT = 4;

const state = { humans: 1, picks: [null, null], players: [], round: 1 };

const startBtn = document.getElementById('start-btn');
const stairsCanvas = document.getElementById('stairs');
const hud = document.getElementById('hud');

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
}

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
      state.picks[slot] = ch.key;
      refreshSetup();
    });
    picker.appendChild(card);
  });
}

function refreshSetup() {
  document.querySelectorAll('.picker').forEach((picker) => {
    const slot = Number(picker.dataset.slot);
    picker.querySelectorAll('.char-card').forEach((card) => {
      const takenByOther = state.picks.some((key, i) => i !== slot && key === card.dataset.key);
      card.classList.toggle('selected', state.picks[slot] === card.dataset.key);
      card.disabled = takenByOther;
    });
  });
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.classList.toggle('selected', Number(btn.dataset.humans) === state.humans);
  });
  document.getElementById('pick-block-2').hidden = state.humans < 2;
  startBtn.disabled = !state.picks.slice(0, state.humans).every(Boolean);
}

function makePlayer(key, control) {
  const character = CHARACTERS.find((ch) => ch.key === key);
  return { character, control, step: 0, stars: 0, points: 0 };
}

function createPlayers() {
  const humanKeys = state.picks.slice(0, state.humans);
  const players = humanKeys.map((key, i) => makePlayer(key, `Speler ${i + 1}`));
  const free = CHARACTERS.filter((ch) => !humanKeys.includes(ch.key));
  while (players.length < PLAYER_COUNT) {
    const [pick] = free.splice(Math.floor(Math.random() * free.length), 1);
    players.push(makePlayer(pick.key, 'CPU'));
  }
  return players;
}

function showBoard() {
  document.getElementById('round-label').textContent = `Ronde ${state.round} van ${ROUNDS}`;
  renderBoard(stairsCanvas, state.players);
  renderHud(hud, state.players);
  showScreen('screen-board');
}

function startGame() {
  state.players = createPlayers();
  state.round = 1;
  showBoard();
}

document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.humans = Number(btn.dataset.humans);
    if (state.humans === 1) state.picks[1] = null;
    refreshSetup();
  });
});
document.querySelectorAll('.picker').forEach(buildPicker);
startBtn.addEventListener('click', startGame);
refreshSetup();
