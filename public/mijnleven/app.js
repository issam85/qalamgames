// Mijn Leven: het huis met de kamers. Houdt het spel bij (outfit, sterren), wisselt
// van scherm en regelt de foto en de beloning.
import { loadGame, saveGame } from './storage.js';
import { renderDoll } from './doll.js';
import { initWardrobe, showWardrobe } from './wardrobe.js';
import { makePhoto } from './photo.js';

const DAILY_STARS = 2; // voor de eerste outfit van de dag
const game = loadGame();
const toastEl = document.getElementById('toast');
const photoEl = document.getElementById('photo');
let toastTimer = 0;

function toast(text) {
  toastEl.textContent = text;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2200);
}

function refresh() {
  document.querySelectorAll('.stars-count').forEach((el) => { el.textContent = game.stars; });
  renderDoll(document.getElementById('huis-doll'), game.outfit);
}

function show(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
  if (id === 'screen-kast') showWardrobe();
  else refresh();
}

// "Klaar!": outfit is al bewaard; de eerste keer per dag krijg je sterren
function done() {
  const today = new Date().toISOString().slice(0, 10);
  if (game.starDay !== today) {
    game.starDay = today;
    game.stars += DAILY_STARS;
    saveGame(game);
    toast(`Wat mooi! Je krijgt ${DAILY_STARS} sterren`);
  } else {
    toast('Wat mooi! Je outfit is bewaard');
  }
  show('screen-huis');
}

async function photo() {
  try {
    const url = await makePhoto(game.outfit);
    document.getElementById('photo-img').src = url;
    document.getElementById('photo-save').href = url;
    photoEl.hidden = false;
  } catch {
    toast('De foto is niet gelukt. Probeer het nog eens.');
  }
}

initWardrobe({
  getOutfit: () => game.outfit,
  setOutfit: (outfit) => {
    game.outfit = outfit;
    saveGame(game);
  },
});
document.querySelectorAll('.room.is-open').forEach((room) => {
  room.addEventListener('click', () => show(`screen-${room.dataset.room}`));
});
document.getElementById('kast-home').addEventListener('click', () => show('screen-huis'));
document.getElementById('kast-done').addEventListener('click', done);
document.getElementById('kast-photo').addEventListener('click', photo);
document.getElementById('photo-close').addEventListener('click', () => { photoEl.hidden = true; });
refresh();
