// De kledingkast: categorieën, soorten per categorie en de kleuren.
// De volgorde van de soorten hoort bij de tekeningen in doll-parts.js.
export const CATS = [
  { key: 'hoofddoek', label: 'Hoofddoek', items: ['Simpel', 'Met strik', 'Lang', 'Tulband', 'Met bloem', 'Twee kleuren'] },
  { key: 'jurk', label: 'Jurk en abaya', items: ['Abaya', 'Met bloemen', 'Rok en blouse', 'Feestjurk', 'Gestreept', 'Met jasje'] },
  { key: 'schoenen', label: 'Schoenen', items: ['Sneakers', "Ballerina's", 'Laarsjes', 'Sandalen', 'Hakjes', 'Slippers'] },
  { key: 'tas', label: 'Tas', items: ['Rugzak', 'Handtas', 'Schoudertas', 'Clutch', 'Shopper', 'Geen tas'] },
  { key: 'sieraden', label: 'Sieraden', items: ['Geen', 'Ketting', 'Parelketting', 'Armbanden', 'Horloge', 'Broche'] },
  { key: 'extra', label: "Extra's", items: ['Geen', 'Zonnebril', 'Bril', 'Kroontje', 'Bloemen', 'Strik'] },
];

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

export function randomOutfit() {
  const outfit = { choice: {}, color: {} };
  CATS.forEach((cat) => {
    outfit.choice[cat.key] = Math.floor(Math.random() * cat.items.length);
    outfit.color[cat.key] = SWATCHES[Math.floor(Math.random() * SWATCHES.length)][0];
  });
  return outfit;
}
