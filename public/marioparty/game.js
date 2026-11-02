// Spelverloop: kiezen → intro → trap → minigame → uitslag → Toad → trap →
// volgende ronde → overwinning en finale → einde. Cutscenes op vaste momenten;
// de rondefilmpjes alleen in ronde 1, daarna gaat het spel meteen door.
import { applyRoundResult, loadBoardAssets } from './board.js';
import { renderHud } from './hud.js';
import { startBoard, stopBoard } from './board-anim.js';
import { startToad, stopToad } from './toad.js';
import { initSetup } from './setup.js';
import { pickMinigame, resetDeck, fillCard, keyHint } from './minigames.js';
import { CHARACTERS, loadCharacters } from './characters.js';
import { loadSprites } from './sprites.js';
import { playCutscene, playCutscenes, resetCutscenes } from './cutscene.js';
import { withWipe } from './transition.js';

const ROUNDS = 5;
const PLACE_LABELS = ['1e 🥇', '2e 🥈', '3e', '4e'];

const state = { players: [], round: 1, ranking: [], minigame: null };

const nextBtn = document.getElementById('next-btn');
const stairsCanvas = document.getElementById('stairs');
const stage2d = document.getElementById('stage-2d');
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

// racestart, Toad en trap: alleen de eerste keer, anders duurt een spel te lang
function roundClip(name) {
  return state.round === 1 ? playCutscene(name) : Promise.resolve();
}

async function startGame(players, { clips }) {
  state.players = players;
  state.round = 1;
  resetDeck();
  resetCutscenes(clips);
  await playCutscene('intro');
  return showBoard();
}

// kiest de minigame van deze ronde en toont eerst de titelkaart met de uitleg
async function startMinigame() {
  stopBoard();
  state.minigame = pickMinigame();
  if (state.minigame.clip) await roundClip(state.minigame.clip);
  fillCard(state.minigame, state.players);
  return showScreen('screen-card');
}

function playMinigame() {
  const mg = state.minigame;
  document.getElementById('minigame-title').textContent = mg.title;
  document.getElementById('stage-hint').textContent = keyHint(mg, state.players);
  document.getElementById('minigame-result').hidden = true;
  document.getElementById('stage-3d').hidden = !mg.three;
  const statusEl = document.getElementById('stage-status');
  return showScreen('screen-minigame', () => mg.start(stage2d, statusEl, state.players, showResult));
}

function showResult(ranking) {
  state.ranking = ranking;
  const lines = ranking.map((p, i) => `${PLACE_LABELS[i]} ${p.character.name}`);
  fillList(document.getElementById('minigame-ranking'), lines);
  document.getElementById('minigame-result').hidden = false;
}

async function showToad() {
  state.minigame.stop();
  await roundClip('toad-stars');
  return showScreen('screen-toad', () => startToad(state.ranking, state.players));
}

async function endRound() {
  stopToad();
  const moves = applyRoundResult(state.players, state.ranking);
  await roundClip('stairs');
  state.round += 1;
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
initSetup(guarded((players, options) => ready.then(() => startGame(players, options)).catch(console.error)));
nextBtn.addEventListener('click', guarded(() => (state.round > ROUNDS ? showEnd() : startMinigame())));
document.getElementById('card-btn').addEventListener('click', guarded(playMinigame));
document.getElementById('to-toad-btn').addEventListener('click', guarded(showToad));
document.getElementById('toad-btn').addEventListener('click', guarded(endRound));
document.getElementById('restart-btn').addEventListener('click', guarded(() => showScreen('screen-setup')));
