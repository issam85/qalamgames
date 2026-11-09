// De uitleg bij Moskee en Mekka: wat er bij elke stap van de reis staat, en wat je
// te zien krijgt als je een onderdeel opent.
import { wuduDone, prayersDone, askedPrayer, journeyStep } from './mosque.js';

export const JOURNEY = {
  tawaf: 'Sleep rondjes om de Kaaba, tegen de klok in. Zeven rondes!',
  zamzam: 'Zeven rondes gelopen! Drink nu van het Zamzam-water.',
  sai: 'Loop nu zeven keer tussen de heuvels Safa en Marwa: sleep heen en weer.',
  klaar: 'Je reis is klaar. Wil je de hele hadj beleven? Speel het Hajj-spel!',
};

// part = 'wudu', 'gebed' of 'mekka'
export function intro(mosque, part) {
  if (part === 'wudu') {
    return wuduDone(mosque) ? 'Je wudu is klaar. Nu kun je bidden.' : 'Doe wudu: tik de stappen in de goede volgorde. Wat was je eerst?';
  }
  if (part === 'mekka') return JOURNEY[journeyStep(mosque)];
  if (!wuduDone(mosque)) return 'Doe eerst wudu voordat je gaat bidden.';
  return prayersDone(mosque) ? 'Je hebt alle vijf gebeden gebeden. Goed gedaan!' : `${askedPrayer(mosque).sky} Welk gebed is het?`;
}
