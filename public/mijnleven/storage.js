// Bewaart het spel op dit apparaat: de outfit, het haar, de make-up, het wassen, het
// eten dat klaarstaat, het gezin, de moskee, de sterren en de dag van de laatste beloning per kamer. In een privévenster lukt opslaan niet; dan geldt het alleen voor dit bezoek.
import { defaultOutfit, CATS, SWATCHES } from './data.js';
import { freshHair, STYLES, HAIR_COLORS, SPOTS } from './hair.js';
import { STRAND_X, MIN_END, MAX_END } from './hair-styles.js';
import { freshBath, SPOTS as WASH_SPOTS, CLEAN } from './bath.js';
import { freshMakeup, validMakeup } from './makeup.js';
import { RECIPES } from './recipes.js';
import { freshFamily, MEMBERS, THROWS } from './family.js';
import { freshMosque, WUDU, PRAYERS, ROUNDS } from './mosque.js';

const KEY = 'mijnleven';

// alleen een outfit met geldige keuzes en kleuren, anders de standaard
function validOutfit(outfit) {
  if (!outfit || !outfit.choice || !outfit.color) return false;
  const colors = SWATCHES.map(([hex]) => hex);
  return CATS.every((cat) => Number.isInteger(outfit.choice[cat.key])
    && outfit.choice[cat.key] >= 0 && outfit.choice[cat.key] < cat.items.length
    && colors.includes(outfit.color[cat.key]));
}

function validHair(hair) {
  return Boolean(hair) && Number.isInteger(hair.style) && hair.style >= 0 && hair.style < STYLES.length
    && HAIR_COLORS.some(([hex]) => hex === hair.color)
    && Array.isArray(hair.knots) && hair.knots.length === SPOTS.length
    && hair.knots.every((hp) => typeof hp === 'number' && hp >= 0)
    && typeof hair.day === 'string';
}

// de lengte per lok; een ouder spel had één lengte (0, 1 of 2) voor al het haar
function loadHair(saved) {
  if (!validHair(saved)) return freshHair();
  const { length, ...hair } = saved;
  const ok = Array.isArray(hair.ends) && hair.ends.length === STRAND_X.length
    && hair.ends.every((end) => typeof end === 'number' && end >= MIN_END && end <= MAX_END);
  const old = [MIN_END, (MIN_END + MAX_END) / 2, MAX_END][length] || MAX_END;
  return { ...freshHair(), ...hair, ends: ok ? hair.ends : STRAND_X.map(() => old) };
}

function validBath(bath) {
  return Boolean(bath) && Array.isArray(bath.spots) && bath.spots.length === WASH_SPOTS.length
    && bath.spots.every((s) => Number.isInteger(s) && s >= 0 && s <= CLEAN)
    && typeof bath.teeth === 'boolean' && typeof bath.day === 'string';
}

const bools = (list, size) => Array.isArray(list) && list.length === size && list.every((v) => typeof v === 'boolean');

function validFamily(family) {
  const kids = MEMBERS.length - 1;
  return Boolean(family) && bools(family.fed, MEMBERS.length) && typeof family.tea === 'boolean'
    && Array.isArray(family.play) && family.play.length === kids
    && family.play.every((n) => Number.isInteger(n) && n >= 0 && n <= THROWS)
    && bools(family.read, kids) && bools(family.bed, kids) && typeof family.day === 'string';
}

const upTo = (n, max) => typeof n === 'number' && n >= 0 && n <= max;

function validMosque(mosque) {
  return Boolean(mosque) && upTo(mosque.wudu, WUDU.length) && upTo(mosque.prayers, PRAYERS.length)
    && Number.isInteger(mosque.wudu) && Number.isInteger(mosque.prayers) && upTo(mosque.tawaf, ROUNDS)
    && typeof mosque.zamzam === 'boolean' && upTo(mosque.sai, ROUNDS) && Number.isInteger(mosque.sai)
    && typeof mosque.day === 'string';
}

export function loadGame() {
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    data = {};
  }
  return {
    outfit: validOutfit(data.outfit) ? data.outfit : defaultOutfit(),
    stars: Number.isInteger(data.stars) && data.stars >= 0 ? data.stars : 0,
    starDay: typeof data.starDay === 'string' ? data.starDay : '',
    hair: loadHair(data.hair),
    kapperDay: typeof data.kapperDay === 'string' ? data.kapperDay : '',
    bath: validBath(data.bath) ? data.bath : freshBath(),
    makeup: validMakeup(data.makeup) ? data.makeup : freshMakeup(),
    badDay: typeof data.badDay === 'string' ? data.badDay : '',
    meal: RECIPES.some((r) => r.key === data.meal) ? data.meal : '',
    keukenDay: typeof data.keukenDay === 'string' ? data.keukenDay : '',
    family: validFamily(data.family) ? data.family : freshFamily(),
    gezinDay: typeof data.gezinDay === 'string' ? data.gezinDay : '',
    mosque: validMosque(data.mosque) ? data.mosque : freshMosque(),
    moskeeDay: typeof data.moskeeDay === 'string' ? data.moskeeDay : '',
    mekkaDay: typeof data.mekkaDay === 'string' ? data.mekkaDay : '',
  };
}

export function saveGame(game) {
  try {
    localStorage.setItem(KEY, JSON.stringify(game));
  } catch {
    // opslaan geblokkeerd: het spel werkt gewoon door
  }
}
