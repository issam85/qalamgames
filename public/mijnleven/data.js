// De kledingkast: categorieën, soorten per categorie en de kleuren.
// De volgorde van de soorten hoort bij de tekeningen in doll-parts.js. De eerste
// FREE_ITEMS soorten heb je meteen; de rest koop je in de winkel (shop.js).
export const CATS = [
  { key: 'hoofddoek', label: 'Hoofddoek', items: ['Simpel', 'Met strik', 'Lang', 'Tulband', 'Met bloem', 'Twee kleuren', 'Met parels'] },
  { key: 'jurk', label: 'Jurk en abaya', items: ['Abaya', 'Met bloemen', 'Rok en blouse', 'Feestjurk', 'Gestreept', 'Met jasje', 'Prinsessenjurk'] },
  { key: 'schoenen', label: 'Schoenen', items: ['Sneakers', "Ballerina's", 'Laarsjes', 'Sandalen', 'Hakjes', 'Slippers', 'Glitterschoenen'] },
  { key: 'tas', label: 'Tas', items: ['Rugzak', 'Handtas', 'Schoudertas', 'Clutch', 'Shopper', 'Geen tas', 'Hartjestas'] },
  { key: 'sieraden', label: 'Sieraden', items: ['Geen', 'Ketting', 'Parelketting', 'Armbanden', 'Horloge', 'Broche', 'Lange ketting'] },
  { key: 'extra', label: "Extra's", items: ['Geen', 'Zonnebril', 'Bril', 'Kroontje', 'Bloemen', 'Strik', 'Vlinder'] },
];
export const FREE_ITEMS = 6;

export const SWATCHES = [
  ['#ff8ac8', 'roze'], ['#b36bff', 'paars'], ['#5ec8ff', 'blauw'], ['#4cd4a0', 'mint'],
  ['#ffd43b', 'goud'], ['#ff7a59', 'oranje'], ['#ffffff', 'wit'], ['#2b2b2b', 'zwart'],
];

export function defaultOutfit() {
  return {
    choice: { hoofddoek: 0, jurk: 0, schoenen: 0, tas: 0, sieraden: 1, extra: 0 },
    color: { hoofddoek: '#b36bff', jurk: '#ff8ac8', schoenen: '#ffffff', tas: '#ffd43b', sieraden: '#ffd43b', extra: '#2b2b2b' },
  };
}

// mag je deze soort aan? (gratis, of gekocht in de winkel)
export const hasItem = (owned, cat, index) => index < FREE_ITEMS || owned.includes(`${cat}:${index}`);

export function randomOutfit(owned) {
  const outfit = { choice: {}, color: {} };
  CATS.forEach((cat) => {
    const options = cat.items.map((_, i) => i).filter((i) => hasItem(owned, cat.key, i));
    outfit.choice[cat.key] = options[Math.floor(Math.random() * options.length)];
    outfit.color[cat.key] = SWATCHES[Math.floor(Math.random() * SWATCHES.length)][0];
  });
  return outfit;
}
