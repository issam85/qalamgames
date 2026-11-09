// Moskee en Mekka zonder scherm: de stappen van wudu, de vijf gebeden en de reis
// (tawaf, Zamzam, sa'i). Losse functies, zo te testen.
// mosque = { wudu: aantal stappen gedaan, prayers: aantal gebeden goed, tawaf: rondes
//            (met stukjes), zamzam, sai: aantal keer gelopen, day }
export const WUDU = ['Handen', 'Mond', 'Neus', 'Gezicht', 'Armen', 'Hoofd', 'Voeten']; // in deze volgorde
export const WUDU_SHELF = [3, 6, 0, 4, 1, 5, 2]; // de knoppen staan door elkaar
export const PRAYERS = [
  { name: 'Fajr', when: 'de vroege ochtend', sky: 'De lucht wordt lichter, de zon komt bijna op.' },
  { name: 'Dhuhr', when: 'de middag', sky: 'De zon staat hoog aan de hemel.' },
  { name: 'Asr', when: 'de namiddag', sky: 'Het is namiddag: de zon zakt en de schaduwen worden lang.' },
  { name: 'Maghrib', when: 'de zonsondergang', sky: 'De zon is net onder en de lucht kleurt oranje.' },
  { name: 'Isha', when: 'de avond', sky: 'Het is donker en de sterren staan aan de hemel.' },
];
const ASK = [1, 4, 0, 3, 2]; // in deze volgorde wordt naar de gebeden gevraagd
export const ROUNDS = 7; // rondes om de Kaaba, en keren tussen Safa en Marwa
export const KAABA = { x: 150, y: 190 }; // midden van het plein in de tekening
export const SAFA_X = 62;
export const MARWA_X = 238;

export const freshMosque = () => ({ wudu: 0, prayers: 0, tawaf: 0, zamzam: false, sai: 0, day: '' });
export const newDay = (mosque, today) => (mosque.day === today ? mosque : { ...freshMosque(), day: today });

export const wuduDone = (mosque) => mosque.wudu >= WUDU.length;
export const prayersDone = (mosque) => mosque.prayers >= PRAYERS.length;
// het gebed waar nu naar gevraagd wordt
export const askedPrayer = (mosque) => PRAYERS[ASK[mosque.prayers]];

// Kies een stap van wudu of een gebed (nummer in WUDU of PRAYERS). Geeft de nieuwe
// stand terug, of null als het niet de goede is
export const pickWudu = (mosque, index) => (index === mosque.wudu ? { ...mosque, wudu: mosque.wudu + 1 } : null);
export const pickPrayer = (mosque, index) => (index === ASK[mosque.prayers] ? { ...mosque, prayers: mosque.prayers + 1 } : null);

// de reis: 'tawaf' → 'zamzam' → 'sai' → 'klaar'
export function journeyStep(mosque) {
  if (mosque.tawaf < ROUNDS) return 'tawaf';
  if (!mosque.zamzam) return 'zamzam';
  return mosque.sai < ROUNDS ? 'sai' : 'klaar';
}

// 0 – 1 voor de meter, per onderdeel
export function progress(mosque, part) {
  if (part === 'wudu') return mosque.wudu / WUDU.length;
  if (part === 'gebed') return mosque.prayers / PRAYERS.length;
  return (Math.min(ROUNDS, mosque.tawaf) + (mosque.zamzam ? 1 : 0) + mosque.sai) / (2 * ROUNDS + 1);
}

const angle = (p) => Math.atan2(p.y - KAABA.y, p.x - KAABA.x);
export const onSquare = (p) => {
  const far = Math.hypot(p.x - KAABA.x, p.y - KAABA.y);
  return far > 34 && far < 125;
};

// Tawaf: van from naar to om de Kaaba. Alleen tegen de klok in telt mee (op het
// scherm loopt y naar beneden, dus dan wordt de hoek kleiner)
export function circle(mosque, from, to) {
  if (!onSquare(from) || !onSquare(to)) return mosque;
  let turn = angle(from) - angle(to);
  if (turn > Math.PI) turn -= 2 * Math.PI;
  if (turn < -Math.PI) turn += 2 * Math.PI;
  if (turn <= 0) return mosque;
  return { ...mosque, tawaf: Math.min(ROUNDS, mosque.tawaf + turn / (2 * Math.PI)) };
}

// Sa'i: je begint op Safa en loopt naar Marwa, dan terug, zeven keer; de zevende
// keer eindig je op Marwa. x = waar je nu loopt
export const towardsMarwa = (mosque) => mosque.sai % 2 === 0;
export function walk(mosque, x) {
  const there = towardsMarwa(mosque) ? x >= MARWA_X - 6 : x <= SAFA_X + 6;
  return there && mosque.sai < ROUNDS ? { ...mosque, sai: mosque.sai + 1 } : mosque;
}
