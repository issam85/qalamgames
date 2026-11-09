// Mijn Leven: het huis met de kamers. Houdt het spel bij (outfit, sterren), wisselt
// van scherm en regelt de foto en de beloning. De kamers zelf zitten in rooms.js.
import { loadGame, saveGame } from './storage.js';
import { renderDoll } from './doll.js';
import { initWardrobe, showWardrobe } from './wardrobe.js';
import { connectRooms } from './rooms.js';
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
  renderDoll(document.getElementById('huis-doll'), game.outfit, game.makeup);
}

function show(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
  (SHOW[id] || refresh)();
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

// extra sterren, één keer per dag (dayKey = het veld met de dag van de laatste keer)
function reward(dayKey, stars, text) {
  if (game[dayKey] === today()) return;
  game[dayKey] = today();
  game.stars += stars;
  saveGame(game);
  refresh();
  toast(`${text} Je krijgt ${stars} sterren`);
}

// een stukje van het spel bewaren, bijvoorbeeld set('hair') → (hair) => ...
const set = (key) => (value) => {
  game[key] = value;
  saveGame(game);
};

async function photo() {
  try {
    const url = await makePhoto(game.outfit, game.makeup);
    document.getElementById('photo-img').src = url;
    document.getElementById('photo-save').href = url;
    photoEl.hidden = false;
  } catch {
    toast('De foto is niet gelukt. Probeer het nog eens.');
  }
}

initWardrobe({ getOutfit: () => game.outfit, setOutfit: set('outfit'), getMakeup: () => game.makeup });
const SHOW = { 'screen-kast': showWardrobe, ...connectRooms({ game, set, done, toast, reward }) };
document.querySelectorAll('.room.is-open').forEach((room) => {
  room.addEventListener('click', () => show(`screen-${room.dataset.room}`));
});
document.querySelectorAll('.home').forEach((btn) => btn.addEventListener('click', () => show('screen-huis')));
document.getElementById('kast-done').addEventListener('click', () => done('starDay', 'Je outfit'));
document.getElementById('kast-photo').addEventListener('click', photo);
document.getElementById('photo-close').addEventListener('click', () => { photoEl.hidden = true; });
refresh();
