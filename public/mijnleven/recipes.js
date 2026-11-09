// De keuken: ingrediënten (naam en kleur) en de recepten.
// need = wat erin moet, in deze volgorde · shelf = wat er op het aanrecht staat (met
// twee dingen die er niet in horen) · mix = kleur na het roeren · pot = in een pan met
// hoge rand (anders een koekenpan) · rounds = hoe vaak je op tijd moet zijn bij het vuur
export const INGREDIENTS = {
  bloem: ['Bloem', '#fff8e7'], melk: ['Melk', '#ffffff'], eieren: ['Eieren', '#ffd43b'], boter: ['Boter', '#ffe066'],
  couscous: ['Couscous', '#f2d58a'], water: ['Water', '#bfe6ff'], groente: ['Groente', '#4cd4a0'],
  kikkererwten: ['Kikkererwten', '#e0b872'], tomaten: ['Tomaten', '#e53935'], linzen: ['Linzen', '#b5651d'],
  kruiden: ['Kruiden', '#43a047'],
};

export const RECIPES = [
  {
    key: 'pannenkoeken', label: 'Pannenkoeken', need: ['bloem', 'melk', 'eieren', 'boter'],
    shelf: ['melk', 'tomaten', 'bloem', 'boter', 'linzen', 'eieren'], mix: '#f6dc9a', pot: false, rounds: 3,
    action: 'Omdraaien!', fire: 'Tik op Omdraaien! als de pannenkoek goudbruin is: de pijl staat dan in het groen.',
    good: 'Mooi goudbruin!', early: 'Te vroeg: hij is nog bleek.', late: 'Te laat: aangebrand!',
  },
  {
    key: 'couscous', label: 'Couscous', need: ['water', 'couscous', 'groente', 'kikkererwten'],
    shelf: ['groente', 'couscous', 'melk', 'water', 'kikkererwten', 'bloem'], mix: '#f0cf7a', pot: true, rounds: 1,
    action: 'Van het vuur!', fire: 'Tik op Van het vuur! als de couscous gaar is: de pijl staat dan in het groen.',
    good: 'Precies gaar!', early: 'Te vroeg: het is nog niet gaar.', late: 'Te laat: aangebrand!',
  },
  {
    key: 'soep', label: 'Soep', need: ['water', 'tomaten', 'linzen', 'kruiden'],
    shelf: ['linzen', 'eieren', 'water', 'kruiden', 'tomaten', 'boter'], mix: '#e0603a', pot: true, rounds: 1,
    action: 'Van het vuur!', fire: 'Tik op Van het vuur! als de soep lekker heet is: de pijl staat dan in het groen.',
    good: 'Lekker heet!', early: 'Te vroeg: de soep is nog lauw.', late: 'Te laat: de soep kookt over!',
  },
];
