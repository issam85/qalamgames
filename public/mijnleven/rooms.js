// Sluit de kamers aan op het spel: wat elke kamer mag lezen en bewaren, en wanneer
// "Klaar!" mag. Geeft per scherm terug wat er moet gebeuren als je binnenkomt.
import { initSalon, showSalon } from './salon.js';
import { initBathroom, showBathroom } from './bathroom.js';
import { initKitchen, showKitchen, cookedMeal } from './kitchen.js';
import { initFamily, showFamily } from './family-room.js';
import { initMosque, showMosque } from './mosque-room.js';
import { initBedroom, showBedroom, fallAsleep, inPyjama } from './bedroom.js';
import { knotsLeft } from './hair.js';
import { washed } from './bath.js';
import { progress as familyProgress } from './family.js';
import { wuduDone, prayersDone } from './mosque.js';
import { freshMakeup } from './makeup.js';
import { today, setNights } from './ui.js';

const JOURNEY_STARS = 3; // voor de reis naar Mekka, één keer per dag
const SLEEP_AFTER = 3; // zoveel kamers moet je op een dag af hebben voor je moe bent

// game = het spel · set(sleutel) = bewaar dat stukje · done(dagveld, wat) = Klaar!
// met sterren · reward(dagveld, sterren, tekst) = extra sterren, één keer per dag ·
// home() = terug naar het huis
export function connectRooms({ game, set, done, toast, reward, home }) {
  const get = (key) => () => game[key];
  // per kamer: waarom "Klaar!" nog niet mag ('' = het mag), en wat er dan bewaard is
  const rules = {
    kapper: [() => (knotsLeft(game.hair) > 0 ? 'Borstel eerst alle knopen uit je haar' : ''), 'Je kapsel'],
    bad: [() => {
      if (!washed(game.bath)) return 'Was je eerst onder de douche';
      return game.bath.teeth ? '' : 'Poets eerst je tanden bij de spiegel';
    }, 'Je make-up'],
    // het eten dat klaar is gaat mee naar het gezin
    keuken: [() => {
      if (!cookedMeal()) return 'Maak eerst je gerecht af';
      set('meal')(cookedMeal());
      return '';
    }, 'Het eten'],
    gezin: [() => (familyProgress(game.family) < 1 ? 'Je gezin wil nog iets: kijk naar de hartjes' : ''), 'Je gezin'],
    moskee: [() => {
      if (!wuduDone(game.mosque)) return 'Doe eerst wudu';
      return prayersDone(game.mosque) ? '' : 'Bid eerst de vijf gebeden';
    }, 'Je gebed'],
  };
  initSalon({ getOutfit: get('outfit'), getMakeup: get('makeup'), getHair: get('hair'), setHair: set('hair') });
  initBathroom({ getHair: get('hair'), getBath: get('bath'), setBath: set('bath'), getMakeup: get('makeup'), setMakeup: set('makeup') });
  initKitchen();
  initFamily({ getFamily: get('family'), setFamily: set('family'), getMeal: get('meal'), eatMeal: () => set('meal')('') });
  initMosque({
    getMosque: get('mosque'),
    setMosque: set('mosque'),
    journeyDone: () => reward('mekkaDay', JOURNEY_STARS, 'Je reis naar Mekka is klaar!'),
  });
  // hoeveel kamers zijn er vandaag af (de kast telt ook mee)
  const tired = () => ({
    done: ['starDay', ...Object.keys(rules).map((room) => `${room}Day`)].filter((key) => game[key] === today()).length,
    need: SLEEP_AFTER,
  });
  initBedroom({ getPyjama: get('pyjama'), setPyjama: set('pyjama'), getOutfit: get('outfit'), getHair: get('hair'), getMakeup: get('makeup'), tired });
  // slapen: een nieuwe dag begint, en je make-up is eraf
  document.getElementById('slaap-done').addEventListener('click', () => {
    const left = SLEEP_AFTER - tired().done;
    if (left > 0) toast(`Je bent nog niet moe. Doe eerst nog ${left} ${left === 1 ? 'ding' : 'dingen'} in huis`);
    else if (!inPyjama(game.pyjama)) toast('Trek eerst je pyjama aan');
    else {
      fallAsleep(() => {
        set('nights')(game.nights + 1);
        setNights(game.nights);
        set('makeup')(freshMakeup());
        home();
        toast('Goedemorgen! Een nieuwe dag begint');
      });
    }
  });
  Object.entries(rules).forEach(([room, [blocked, what]]) => {
    document.getElementById(`${room}-done`).addEventListener('click', () => {
      const why = blocked();
      if (why) toast(why);
      else done(`${room}Day`, what);
    });
  });
  return {
    'screen-kapper': showSalon, 'screen-bad': showBathroom, 'screen-keuken': showKitchen, 'screen-gezin': showFamily,
    'screen-moskee': showMosque, 'screen-slaap': showBedroom,
  };
}
