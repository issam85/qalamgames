// Sluit de kamers aan op het spel: wat elke kamer mag lezen en bewaren, en wanneer
// "Klaar!" mag. Geeft per scherm terug wat er moet gebeuren als je binnenkomt.
import { initSalon, showSalon } from './salon.js';
import { initBathroom, showBathroom } from './bathroom.js';
import { initKitchen, showKitchen, cookedMeal, nextKey as kitchenNext } from './kitchen.js';
import { initFamily, showFamily } from './family-room.js';
import { initMosque, showMosque } from './mosque-room.js';
import { initBedroom, showBedroom, fallAsleep, inPyjama, isNight } from './bedroom.js';
import { initShop, showShop } from './shop-room.js';
import { parseKey } from './shop.js';
import { MAKEUP } from './makeup.js';
import { knotsLeft } from './hair.js';
import { washed, stepDone, STEPS } from './bath.js';
import { progress as familyProgress, wish } from './family.js';
import { wuduDone, prayersDone } from './mosque.js';
import { freshMakeup } from './makeup.js';
import { wearJewel } from './data.js';
import { today, setNights, pulse } from './ui.js';

const JOURNEY_STARS = 3; // voor de reis naar Mekka, één keer per dag
const SLEEP_AFTER = 3; // zoveel kamers moet je op een dag af hebben voor je moe bent

// game = het spel · set(sleutel) = bewaar dat stukje · done(dagveld, wat) = Klaar!
// met sterren · toast(tekst, plaatje) = meldinkje · reward(dagveld, sterren, tekst) =
// extra sterren, één keer per dag · home() = terug naar het huis · refresh() = sterren
// en het meisje in het huis bijwerken
export function connectRooms({ game, set, done, toast, reward, home, refresh }) {
  const get = (key) => () => game[key];
  // per kamer: waarom "Klaar!" nog niet mag ('' = het mag), wat er dan bewaard is, en
  // de knop die je eerst nodig hebt (die licht op; data-key in het scherm van de kamer)
  const rules = {
    kapper: [() => (knotsLeft(game.hair) > 0 ? 'Borstel eerst alle knopen uit je haar' : ''), 'Je kapsel', () => 'borstel'],
    bad: [() => {
      if (!washed(game.bath)) return 'Was je eerst onder de douche';
      return game.bath.teeth ? '' : 'Poets eerst je tanden bij de spiegel';
    }, 'Je make-up', () => (washed(game.bath) ? 'tanden' : STEPS.find((tool) => !stepDone(game.bath.spots, tool)))],
    // het eten is al naar het gezin zodra het klaar is (kitchen.js)
    keuken: [() => (cookedMeal() ? '' : 'Maak eerst je gerecht af'), 'Het eten', kitchenNext],
    gezin: [() => (familyProgress(game.family) < 1 ? 'Je gezin wil nog iets: kijk naar de hartjes' : ''), 'Je gezin', () => wish(game.family)],
    moskee: [() => {
      if (!wuduDone(game.mosque)) return 'Doe eerst wudu';
      return prayersDone(game.mosque) ? '' : 'Bid eerst de vijf gebeden';
    }, 'Je gebed', () => (wuduDone(game.mosque) ? 'gebed' : 'wudu')],
  };
  initSalon({ getOutfit: get('outfit'), getMakeup: get('makeup'), getHair: get('hair'), setHair: set('hair'), getOwned: get('owned') });
  initBathroom({
    getHair: get('hair'), getBath: get('bath'), setBath: set('bath'), getMakeup: get('makeup'), setMakeup: set('makeup'), getOwned: get('owned'),
  });
  // kopen: sterren eraf, en je draagt het meteen
  initShop({
    getStars: get('stars'),
    getOwned: get('owned'),
    getLook: () => ({ outfit: game.outfit, hair: game.hair, makeup: game.makeup }),
    purchase: (item, { owned, stars }) => {
      const [kind, index] = parseKey(item.key);
      set('owned')(owned);
      set('stars')(stars);
      const choice = kind === 'sieraden' ? wearJewel(game.outfit.choice.sieraden, index) : index;
      if (item.group === 'kleren') set('outfit')({ ...game.outfit, choice: { ...game.outfit.choice, [kind]: choice } });
      else if (item.group === 'makeup') set('makeup')({ ...game.makeup, [kind]: MAKEUP[kind][index][0] });
      else set('hair')({ ...game.hair, hat: index, hijab: false });
      refresh();
    },
  });
  initKitchen({ setMeal: set('meal') });
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
    if (isNight()) return; // nog een tik tijdens de nacht telt niet
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
  Object.entries(rules).forEach(([room, [blocked, what, next]]) => {
    document.getElementById(`${room}-done`).addEventListener('click', () => {
      const why = blocked();
      if (!why) {
        done(`${room}Day`, what);
        return;
      }
      const btn = document.querySelector(`#screen-${room} [data-key="${next()}"]`);
      toast(why, btn?.querySelector('.btn-icon')?.innerHTML || '');
      pulse(btn);
    });
  });
  return {
    'screen-kapper': showSalon, 'screen-bad': showBathroom, 'screen-keuken': showKitchen, 'screen-gezin': showFamily,
    'screen-moskee': showMosque, 'screen-slaap': showBedroom, 'screen-winkel': showShop,
  };
}
