// Mijn Leven: het huis met de kamers. Houdt het spel bij (outfit, sterren), wisselt
// van scherm en regelt de foto en de beloning.
import { loadGame, saveGame } from './storage.js';
import { renderDoll } from './doll.js';
import { initWardrobe, showWardrobe } from './wardrobe.js';
import { initSalon, showSalon } from './salon.js';
import { knotsLeft } from './hair.js';
import { makePhoto } from './photo.js';
import { today } from './ui.js';

const DAILY_STARS = 2; // per kamer, voor de eerste keer op een dag
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
  else if (id === 'screen-kapper') showSalon();
  else refresh();
}

// "Klaar!" in een kamer: de eerste keer per dag krijg je sterren. dayKey = het veld
// in het spel waarin de dag van de laatste beloning staat
function done(dayKey, what) {
  if (game[dayKey] !== today()) {
    game[dayKey] = today();
    game.stars += DAILY_STARS;
    saveGame(game);
    toast(`Wat mooi! Je krijgt ${DAILY_STARS} sterren`);
  } else {
    toast(`Wat mooi! ${what} is bewaard`);
  }
  show('screen-huis');
}

// bij de kapper moeten eerst de knopen eruit
function salonDone() {
  if (knotsLeft(game.hair) > 0) toast('Borstel eerst alle knopen uit je haar');
  else done('kapperDay', 'Je kapsel');
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
initSalon({
  getOutfit: () => game.outfit,
  getHair: () => game.hair,
  setHair: (hair) => {
    game.hair = hair;
    saveGame(game);
  },
});
document.getElementById('kast-home').addEventListener('click', () => show('screen-huis'));
document.getElementById('kapper-home').addEventListener('click', () => show('screen-huis'));
document.getElementById('kast-done').addEventListener('click', () => done('starDay', 'Je outfit'));
document.getElementById('kapper-done').addEventListener('click', salonDone);
document.getElementById('kast-photo').addEventListener('click', photo);
document.getElementById('photo-close').addEventListener('click', () => { photoEl.hidden = true; });
refresh();
