// De kledingkast: categorieën, soorten per categorie en de kleuren.
// De volgorde van de soorten hoort bij de tekeningen in doll-parts.js. De eerste
// FREE_ITEMS soorten heb je meteen; de rest koop je in de winkel (shop.js).
// Sieraden kun je combineren: choice.sieraden is een lijst ([] = Geen, [1, 3] =
// ketting en armbanden). Om je hals past maar één ketting.
export const CATS = [
  { key: 'hoofddoek', label: 'Hoofddoek', items: ['Simpel', 'Met strik', 'Lang', 'Tulband', 'Met bloem', 'Twee kleuren', 'Met parels'] },
  { key: 'jurk', label: 'Jurk en abaya', items: ['Abaya', 'Met bloemen', 'Rok en blouse', 'Feestjurk', 'Gestreept', 'Met jasje', 'Prinsessenjurk'] },
  { key: 'schoenen', label: 'Schoenen', items: ['Sneakers', "Ballerina's", 'Laarsjes', 'Sandalen', 'Hakjes', 'Slippers', 'Glitterschoenen'] },
  { key: 'tas', label: 'Tas', items: ['Rugzak', 'Handtas', 'Schoudertas', 'Clutch', 'Shopper', 'Geen tas', 'Hartjestas'] },
  { key: 'sieraden', label: 'Sieraden', items: ['Geen', 'Ketting', 'Parelketting', 'Armbanden', 'Horloge', 'Broche', 'Lange ketting'] },
  { key: 'extra', label: "Extra's", items: ['Geen', 'Zonnebril', 'Bril', 'Kroontje', 'Bloemen', 'Strik', 'Vlinder'] },
];
export const FREE_ITEMS = 6;
export const NECKLACES = [1, 2, 6]; // ketting, parelketting, lange ketting
const JEWELS = CATS.find((c) => c.key === 'sieraden').items.length;

export const SWATCHES = [
  ['#ff8ac8', 'roze'], ['#b36bff', 'paars'], ['#5ec8ff', 'blauw'], ['#4cd4a0', 'mint'],
  ['#ffd43b', 'goud'], ['#ff7a59', 'oranje'], ['#ffffff', 'wit'], ['#2b2b2b', 'zwart'],
];

export function defaultOutfit() {
  return {
    choice: { hoofddoek: 0, jurk: 0, schoenen: 0, tas: 0, sieraden: [1], extra: 0 },
    color: { hoofddoek: '#b36bff', jurk: '#ff8ac8', schoenen: '#ffffff', tas: '#ffd43b', sieraden: '#ffd43b', extra: '#2b2b2b' },
  };
}

// mag je deze soort aan? (gratis, of gekocht in de winkel)
export const hasItem = (owned, cat, index) => index < FREE_ITEMS || owned.includes(`${cat}:${index}`);

// sieraad i erbij doen (0 = Geen: alles af); een nieuwe ketting vervangt de oude
export function wearJewel(list, i) {
  if (i === 0) return [];
  const rest = list.filter((j) => j !== i && !(NECKLACES.includes(i) && NECKLACES.includes(j)));
  return [...rest, i].sort((a, b) => a - b);
}

// een tik op sieraad i: aan als het af was, af als het aan was
export const toggleJewel = (list, i) => (i && list.includes(i) ? list.filter((j) => j !== i) : wearJewel(list, i));

// De sieraden uit een bewaard spel. Vroeger was het één nummer (0 = Geen); nu een
// lijst. Geeft null terug als het niet klopt.
export function jewelsFrom(value) {
  if (Number.isInteger(value)) return value > 0 && value < JEWELS ? [value] : (value === 0 ? [] : null);
  if (!Array.isArray(value) || !value.every((i) => Number.isInteger(i) && i > 0 && i < JEWELS)) return null;
  return value.reduce(wearJewel, []);
}

export function randomOutfit(owned) {
  const outfit = { choice: {}, color: {} };
  CATS.forEach((cat) => {
    const options = cat.items.map((_, i) => i).filter((i) => hasItem(owned, cat.key, i));
    const pick = options[Math.floor(Math.random() * options.length)];
    outfit.choice[cat.key] = cat.key === 'sieraden' ? wearJewel([], pick) : pick;
    outfit.color[cat.key] = SWATCHES[Math.floor(Math.random() * SWATCHES.length)][0];
  });
  return outfit;
}
