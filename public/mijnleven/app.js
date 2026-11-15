// Mijn Leven: het huis met de kamers. Houdt het spel bij (outfit, sterren), wisselt
// van scherm en regelt de foto en de beloning. De kamers zelf zitten in rooms.js.
// Terug gaat via de geschiedenis van de browser: een kamer of de foto openen zet er
// een stap bij, zodat ook de terugtoets van een tablet één stap teruggaat.
import { loadGame, saveGame } from './storage.js';
import { renderDoll } from './doll.js';
import { initWardrobe, showWardrobe } from './wardrobe.js';
import { connectRooms } from './rooms.js';
import { isNight } from './bedroom.js';
import { decorateHouse } from './house-icons.js';
import { preparePhoto } from './photo.js';
import { today, setNights } from './ui.js';

const DAILY_STARS = 2; // per kamer, voor de eerste keer op een dag
const TOAST_MS = 3500;
const game = loadGame();
setNights(game.nights);
const toastEl = document.getElementById('toast');
const photoEl = document.getElementById('photo');
let toastTimer = 0;
let current = 'screen-huis';

// een meldinkje onderin, met een plaatje als dat er is; een tik haalt het weg
function toast(text, icon = '') {
  toastEl.hidden = false;
  toastEl.innerHTML = icon ? `<span class="toast-icon">${icon}</span>` : '';
  toastEl.append(text);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, TOAST_MS);
}

// het veld in het spel met de dag van de laatste beloning (de kast heeft starDay)
const dayKey = (room) => (room === 'kast' ? 'starDay' : `${room}Day`);

function refresh() {
  document.querySelectorAll('.stars-count').forEach((el) => { el.textContent = game.stars; });
  renderDoll(document.getElementById('huis-doll'), game.outfit, game.makeup);
  // wat vandaag al af is krijgt een gouden ster
  document.querySelectorAll('.room[data-room]').forEach((room) => {
    room.classList.toggle('is-done', game[dayKey(room.dataset.room)] === today());
  });
}

function show(id) {
  current = id;
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
  (SHOW[id] || refresh)();
}

// een kamer openen: één stap erbij in de geschiedenis
function open(id) {
  history.pushState({ mijnleven: id }, '');
  show(id);
}

// terug naar het huis (na Klaar! of na het slapen): de stap van de kamer gaat eraf
const home = () => (history.state?.mijnleven ? history.back() : show('screen-huis'));

// De terugknop, de terugtoets of het vegen: één stap terug. Eerst gaat de foto dicht,
// tijdens de nacht kun je niet weg, anders ga je naar het huis.
window.addEventListener('popstate', () => {
  if (!photoEl.hidden) photoEl.hidden = true;
  else if (isNight()) history.pushState({ mijnleven: current }, '');
  else if (current !== 'screen-huis') show('screen-huis');
});

// "Klaar!" in een kamer: de eerste keer per dag krijg je sterren. key = het veld
// in het spel waarin de dag van de laatste beloning staat
function done(key, what) {
  if (game[key] !== today()) {
    game[key] = today();
    game.stars += DAILY_STARS;
    saveGame(game);
    toast(`Wat mooi! Je krijgt ${DAILY_STARS} sterren`);
  } else {
    toast(`Wat mooi! ${what} is bewaard`);
  }
  home();
}

// extra sterren, één keer per dag (key = het veld met de dag van de laatste keer)
function reward(key, stars, text) {
  if (game[key] === today()) return;
  game[key] = today();
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
    await preparePhoto(game.outfit, game.makeup);
    history.pushState({ mijnleven: current, photo: true }, '');
    photoEl.hidden = false;
  } catch {
    toast('De foto is niet gelukt. Probeer het nog eens.');
  }
}

initWardrobe({ getOutfit: () => game.outfit, setOutfit: set('outfit'), getMakeup: () => game.makeup, getOwned: () => game.owned });
const SHOW = { 'screen-kast': showWardrobe, ...connectRooms({ game, set, done, toast, reward, home, refresh }) };
decorateHouse();
document.querySelectorAll('.room.is-open').forEach((room) => {
  room.addEventListener('click', () => open(`screen-${room.dataset.room}`));
});
document.querySelectorAll('.home').forEach((btn) => btn.addEventListener('click', home));
document.getElementById('kast-done').addEventListener('click', () => done('starDay', 'Je outfit'));
document.getElementById('kast-photo').addEventListener('click', photo);
document.getElementById('photo-close').addEventListener('click', () => history.back());
toastEl.addEventListener('click', () => { toastEl.hidden = true; });
// opnieuw geladen terwijl je in een kamer was: je begint weer in het huis
if (history.state?.mijnleven) history.replaceState(null, '');
refresh();
