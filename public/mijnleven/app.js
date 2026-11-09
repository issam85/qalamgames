// Mijn Leven: het huis met de kamers. Houdt het spel bij (outfit, sterren), wisselt
// van scherm en regelt de foto en de beloning.
import { loadGame, saveGame } from './storage.js';
import { renderDoll } from './doll.js';
import { initWardrobe, showWardrobe } from './wardrobe.js';
import { initSalon, showSalon } from './salon.js';
import { initBathroom, showBathroom } from './bathroom.js';
import { washed } from './bath.js';
import { initKitchen, showKitchen, cookedMeal } from './kitchen.js';
import { knotsLeft } from './hair.js';
import { makePhoto } from './photo.js';
import { today } from './ui.js';

const DAILY_STARS = 2; // per kamer, voor de eerste keer op een dag
const game = loadGame();
const SHOW = {
  'screen-kast': showWardrobe, 'screen-kapper': showSalon, 'screen-bad': showBathroom, 'screen-keuken': showKitchen,
};
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

// bij de kapper moeten eerst de knopen eruit
function salonDone() {
  if (knotsLeft(game.hair) > 0) toast('Borstel eerst alle knopen uit je haar');
  else done('kapperDay', 'Je kapsel');
}

// in de badkamer moet je je eerst wassen en je tanden poetsen
function bathDone() {
  if (!washed(game.bath)) toast('Was je eerst onder de douche');
  else if (!game.bath.teeth) toast('Poets eerst je tanden bij de spiegel');
  else done('badDay', 'Je make-up');
}

// het eten dat klaar is gaat mee naar het gezin
function kitchenDone() {
  if (!cookedMeal()) {
    toast('Maak eerst je gerecht af');
    return;
  }
  set('meal')(cookedMeal());
  done('keukenDay', 'Het eten');
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
document.querySelectorAll('.room.is-open').forEach((room) => {
  room.addEventListener('click', () => show(`screen-${room.dataset.room}`));
});
initSalon({ getOutfit: () => game.outfit, getMakeup: () => game.makeup, getHair: () => game.hair, setHair: set('hair') });
initBathroom({
  getHair: () => game.hair,
  getBath: () => game.bath,
  setBath: set('bath'),
  getMakeup: () => game.makeup,
  setMakeup: set('makeup'),
});
document.querySelectorAll('.home').forEach((btn) => btn.addEventListener('click', () => show('screen-huis')));
document.getElementById('kast-done').addEventListener('click', () => done('starDay', 'Je outfit'));
document.getElementById('kapper-done').addEventListener('click', salonDone);
document.getElementById('bad-done').addEventListener('click', bathDone);
initKitchen();
document.getElementById('keuken-done').addEventListener('click', kitchenDone);
document.getElementById('kast-photo').addEventListener('click', photo);
document.getElementById('photo-close').addEventListener('click', () => { photoEl.hidden = true; });
refresh();
