// Spelverloop: kiezen → intro → trap → minigame → uitslag → Toad → trap →
// volgende ronde → overwinning en finale → einde. Cutscenes op vaste momenten.
import { applyRoundResult, loadBoardAssets } from './board.js';
import { renderHud } from './hud.js';
import { startBoard, stopBoard } from './board-anim.js';
import { startSprint, stopSprint, KEY_LABELS } from './minigame-sprint.js';
import { startToad, stopToad } from './toad.js';
import { initSetup } from './setup.js';
import { CHARACTERS, loadCharacters } from './characters.js';
import { loadSprites } from './sprites.js';
import { playCutscene, playCutscenes } from './cutscene.js';
import { withWipe } from './transition.js';

const ROUNDS = 5;
const PLACE_LABELS = ['1e 🥇', '2e 🥈', '3e', '4e'];

const state = { players: [], round: 1, ranking: [] };

const nextBtn = document.getElementById('next-btn');
const stairsCanvas = document.getElementById('stairs');
const sprintCanvas = document.getElementById('sprint');
const hud = document.getElementById('hud');

// wisselt van scherm achter de sterwipe; onSwitch draait op het moment van wisselen
function showScreen(id, onSwitch) {
  return withWipe(() => {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
    if (onSwitch) onSwitch();
  });
}

function fillList(list, lines) {
  list.innerHTML = '';
  lines.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
}

// moves: de bewegingen op de trap van de laatste ronde (leeg bij de start)
function showBoard(moves = []) {
  const done = state.round > ROUNDS;
  const label = done ? 'Alle rondes gespeeld!' : `Ronde ${state.round} van ${ROUNDS}`;
  document.getElementById('round-label').textContent = label;
  nextBtn.textContent = done ? 'Bekijk de winnaar ▶' : 'Speel minigame ▶';
  renderHud(hud, state.players);
  return showScreen('screen-board', () => startBoard(stairsCanvas, state.players, moves));
}

async function startGame(players) {
  state.players = players;
  state.round = 1;
  await playCutscene('intro');
  return showBoard();
}

async function startMinigame() {
  const humans = state.players.filter((p) => p.control !== 'CPU');
  const hint = humans.map((p) => `${p.control}: ${KEY_LABELS[p.control]}`).join('   ');
  document.getElementById('sprint-hint').textContent = hint;
  document.getElementById('sprint-result').hidden = true;
  stopBoard();
  await playCutscene('race-start');
  const statusEl = document.getElementById('sprint-status');
  return showScreen('screen-minigame', () => startSprint(sprintCanvas, statusEl, state.players, showResult));
}

function showResult(ranking) {
  state.ranking = ranking;
  const lines = ranking.map((p, i) => `${PLACE_LABELS[i]} ${p.character.name}`);
  fillList(document.getElementById('sprint-ranking'), lines);
  document.getElementById('sprint-result').hidden = false;
}

async function showToad() {
  stopSprint();
  await playCutscene('toad-stars');
  return showScreen('screen-toad', () => startToad(state.ranking, state.players));
}

async function endRound() {
  stopToad();
  const moves = applyRoundResult(state.players, state.ranking);
  state.round += 1;
  await playCutscene('stairs');
  return showBoard(moves);
}

async function showEnd() {
  stopBoard();
  const order = [...state.players]
    .sort((a, b) => b.step - a.step || b.stars - a.stars || b.points - a.points);
  await playCutscenes([`win-${order[0].character.key}`, 'finale']);
  document.getElementById('winner-label').textContent = `${order[0].character.name} wint!`;
  const lines = order.map((p, i) => `${PLACE_LABELS[i]} ${p.character.name} — trede ${p.step}, ⭐ ${p.stars}, 🍄 ${p.points}`);
  fillList(document.getElementById('final-ranking'), lines);
  return showScreen('screen-end');
}

// voorkomt dat een dubbele klik een stap twee keer start
let busy = false;
function guarded(step) {
  return async (...args) => {
    if (busy) return;
    busy = true;
    try {
      await step(...args);
    } finally {
      busy = false;
    }
  };
}

const ready = Promise.all([
  loadCharacters(), loadBoardAssets(), loadSprites(CHARACTERS.map((ch) => ch.key)),
]);
initSetup(guarded((players) => ready.then(() => startGame(players)).catch(console.error)));
nextBtn.addEventListener('click', guarded(() => (state.round > ROUNDS ? showEnd() : startMinigame())));
document.getElementById('to-toad-btn').addEventListener('click', guarded(showToad));
document.getElementById('toad-btn').addEventListener('click', guarded(endRound));
document.getElementById('restart-btn').addEventListener('click', guarded(() => showScreen('screen-setup')));
