// De prinsessen, de soorten in het kleedhokje en de kleuren. De volgorde van de
// soorten hoort bij de tekeningen in dresses.js en jewels.js.
export const PRINCESSES = [
  { name: 'Lina', skin: '#f6d2b4', hair: '#f2c94c', style: 'golf', eyes: '#3d7ad6' },
  { name: 'Sara', skin: '#9c6644', hair: '#24160f', style: 'krul', eyes: '#6b3e1e' },
  { name: 'Yasmina', skin: '#d9a47c', hair: '#4a2a17', style: 'vlecht', eyes: '#2f7d4f' },
  { name: 'Roos', skin: '#f3cfae', hair: '#c4522a', style: 'steil', eyes: '#7a4fc2' },
];

export const CATS = [
  { key: 'jurk', label: 'Jurk', items: ['Baljurk', 'Met sleep', 'Zeemeermin', 'Zomerjurk', 'Laagjes', 'Sterrenjurk', 'Glitterjurk', 'Bloemenjurk'] },
  { key: 'kroon', label: 'Kroon', items: ['Tiara', 'Grote kroon', 'Sterrenkroon', 'Bloemenkrans', 'Schelpenkroon', 'Hartjeskroon'] },
  { key: 'ketting', label: 'Ketting', items: ['Parels', 'Hartje', 'Diamant', 'Schelp', 'Sterretjes', 'Kristal'] },
  { key: 'schoenen', label: 'Schoenen', items: ['Hakjes', 'Hoge hakken', 'Glazen muiltjes', "Ballerina's", 'Sandalen', 'Laarsjes'] },
];

// "alle kleuren"
export const SWATCHES = [
  ['#ff8ac8', 'roze'], ['#ffc2e0', 'lichtroze'], ['#e53950', 'rood'], ['#ff8a3d', 'oranje'],
  ['#ffd43b', 'goud'], ['#fff3a3', 'lichtgeel'], ['#7ed957', 'groen'], ['#4cd4a0', 'mint'],
  ['#2ec4c4', 'turkoois'], ['#8fd3ff', 'lichtblauw'], ['#2f6fe0', 'blauw'], ['#1d2a6b', 'donkerblauw'],
  ['#b36bff', 'paars'], ['#d9b8ff', 'lila'], ['#ffffff', 'wit'], ['#c0c6d4', 'zilver'],
  ['#2b2b2b', 'zwart'], ['#8a5a3c', 'bruin'],
];
// de ketting mag ook "zoals de jurk" zijn: dan krijgt hij de kleur van de jurk
export const MATCH = 'jurk';

export function defaultOutfit() {
  return {
    choice: { jurk: 0, kroon: 0, ketting: 0, schoenen: 2 },
    color: { jurk: '#ff8ac8', kroon: '#ffd43b', ketting: MATCH, schoenen: '#8fd3ff' },
  };
}

const pick = (list) => list[Math.floor(Math.random() * list.length)];
export function randomOutfit() {
  const outfit = { choice: {}, color: {} };
  CATS.forEach((cat) => {
    outfit.choice[cat.key] = Math.floor(Math.random() * cat.items.length);
    outfit.color[cat.key] = pick(SWATCHES)[0];
  });
  outfit.color.kroon = pick(['#ffd43b', '#c0c6d4', '#ffc2e0']);
  outfit.color.ketting = MATCH;
  return outfit;
}
