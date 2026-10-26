// Spelverloop: kiezen → minigame → uitslag → Toad → trap → volgende ronde → einde.
import { renderBoard, renderHud, applyRoundResult, loadBoardAssets } from './board.js';
import { startSprint, KEY_LABELS, loadSprintAssets } from './minigame-sprint.js';
import { renderToad } from './toad.js';
import { initSetup } from './setup.js';
import { loadCharacters } from './characters.js';

const ROUNDS = 5;
const PLACE_LABELS = ['1e 🥇', '2e 🥈', '3e', '4e'];

const state = { players: [], round: 1, ranking: [] };

const nextBtn = document.getElementById('next-btn');
const stairsCanvas = document.getElementById('stairs');
const sprintCanvas = document.getElementById('sprint');
const hud = document.getElementById('hud');

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
}

function fillList(list, lines) {
  list.innerHTML = '';
  lines.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
}

function showBoard() {
  const done = state.round > ROUNDS;
  const label = done ? 'Alle rondes gespeeld!' : `Ronde ${state.round} van ${ROUNDS}`;
  document.getElementById('round-label').textContent = label;
  nextBtn.textContent = done ? 'Bekijk de winnaar ▶' : 'Speel minigame ▶';
  renderBoard(stairsCanvas, state.players);
  renderHud(hud, state.players);
  showScreen('screen-board');
}

function startGame(players) {
  state.players = players;
  state.round = 1;
  showBoard();
}

function startMinigame() {
  const humans = state.players.filter((p) => p.control !== 'CPU');
  const hint = humans.map((p) => `${p.control}: ${KEY_LABELS[p.control]}`).join('   ');
  document.getElementById('sprint-hint').textContent = hint;
  document.getElementById('sprint-result').hidden = true;
  showScreen('screen-minigame');
  startSprint(sprintCanvas, document.getElementById('sprint-status'), state.players, showResult);
}

function showResult(ranking) {
  state.ranking = ranking;
  const lines = ranking.map((p, i) => `${PLACE_LABELS[i]} ${p.character.name}`);
  fillList(document.getElementById('sprint-ranking'), lines);
  document.getElementById('sprint-status').textContent = 'Finish!';
  document.getElementById('sprint-result').hidden = false;
}

function showToad() {
  renderToad(document.getElementById('toad-box'), state.ranking);
  showScreen('screen-toad');
}

function endRound() {
  applyRoundResult(state.players, state.ranking);
  state.round += 1;
  showBoard();
}

function showEnd() {
  const order = [...state.players]
    .sort((a, b) => b.step - a.step || b.stars - a.stars || b.points - a.points);
  document.getElementById('winner-label').textContent = `${order[0].character.name} wint!`;
  const lines = order.map((p, i) => `${PLACE_LABELS[i]} ${p.character.name} — trede ${p.step}, ⭐ ${p.stars}, 🍄 ${p.points}`);
  fillList(document.getElementById('final-ranking'), lines);
  showScreen('screen-end');
}

const ready = Promise.all([loadCharacters(), loadBoardAssets(), loadSprintAssets()]);
initSetup((players) => ready.then(() => startGame(players)).catch(console.error));
nextBtn.addEventListener('click', () => (state.round > ROUNDS ? showEnd() : startMinigame()));
document.getElementById('to-toad-btn').addEventListener('click', showToad);
document.getElementById('toad-btn').addEventListener('click', endRound);
document.getElementById('restart-btn').addEventListener('click', () => showScreen('screen-setup'));
