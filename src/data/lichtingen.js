// Lichtingen: per cohort de leerlingen en hun spel (sleutel uit data/games.js).
// `top` met rang = Top 3, `rest` = eervolle vermeldingen; zonder rang = badge "Nieuw".
// Optioneel: `title`/`sub` (afwijkende naam op de kaart), `score`, `v2` (sleutel van versie 2).
export const LICHTINGEN = [
  {
    id: 'lichting4', label: 'Lichting 4', subtitle: 'De nieuwste lichting — oktober 2026',
    top: [{ game: 'marioparty', student: 'Al Qalam kids', klas: 'Al Qalam School' }],
    rest: [],
  },
  {
    id: 'lichting3', label: 'Lichting 3', subtitle: 'De derde lichting gamemakers',
    top: [
      { game: 'fightnight', student: 'Amr Jahouhi', klas: 'Groep 7a' },
      { game: 'hajj', student: 'Al Qalam kids', klas: 'Al Qalam School' },
    ],
    rest: [],
  },
  {
    id: 'lichting2', label: 'Lichting 2', subtitle: 'De tweede lichting, gerangschikt op beoordeling',
    top: [
      { rank: 1, game: 'fifaultimate', student: 'Mohamed Fatehi', klas: 'Groep 7c', score: '9.48' },
      { rank: 2, game: 'sonicultimate', student: 'Abdoerrahmaan Ezzarfani', klas: 'Groep 7c', score: '9.16' },
      { rank: 3, game: 'stuntracer', student: 'Amin van Ee', klas: 'Groep 6b', score: '9.00' },
    ],
    rest: [
      { rank: 4, game: 'grannyhorrorgame', student: 'Abdulahi Abdulkhader', klas: 'Groep 7c', score: '8.63' },
      { rank: 5, game: 'turborace', student: 'Junayd Bakkali', klas: 'Groep 6a', score: '8.41' },
      { rank: 6, game: 'basketballislam', student: 'Adam El Majidi', klas: 'Groep 7b', score: '8.14' },
      { rank: 7, game: 'kickoff3d', student: 'Imran Mestour', klas: 'Groep 6a', score: '7.50' },
      { rank: 8, game: 'mijncraft', student: 'Youssef El Mahjoubi', klas: 'Groep 6b', score: '7.19' },
    ],
  },
  {
    id: 'lichting1', label: 'Lichting 1', subtitle: 'De eerste lichting gamemakers',
    top: [
      { rank: 1, game: 'bananastorm', v2: 'bananastorm2', student: 'Saifeddine Boulabkoul', klas: 'Groep 7b' },
      { rank: 2, game: 'vicecity', v2: 'vicecity2', student: 'Yahya Essanousi', klas: 'Groep 6b' },
      { rank: 3, game: 'game', sub: 'Race of Peace', student: 'Zakaria El Aamim', klas: 'Groep 6b' },
    ],
    rest: [
      { rank: 4, game: 'penalty', sub: 'Toernooi Edition', student: 'Marouan El Amrani', klas: 'Groep 7c' },
      { rank: 5, game: 'autospel', v2: 'autospel2', student: 'Mahir Tazammourti', klas: 'Groep 6a' },
      { rank: 6, game: 'turboracer', v2: 'turboracer2', title: 'Turbo Racer 3D - Mega Maps', student: 'Reda Oruadia', klas: 'Groep 6c' },
      { rank: 7, game: 'turborace', student: 'Junayd Bakkali', klas: 'Groep 6a' },
    ],
  },
];

// Uitgelicht: eerste = brede kaart bovenaan
export const FEATURED = [
  { game: 'marioparty', lichting: 'Lichting 4', maker: 'Al Qalam kids', tags: ['1–2 spelers', 'Toetsenbord'] },
  { game: 'fightnight', maker: 'Amr Jahouhi — Groep 7a' },
  { game: 'hajj', maker: 'Al Qalam kids — Al Qalam School' },
];

// Hall of Legends: de winnaar van elke lichting
export const LEGENDS = [
  { label: 'Lichting 1', name: 'Saifeddine Boulabkoul', game: 'bananastorm2', meta: 'Groep 7b' },
  { label: 'Lichting 2', name: 'Mohamed Fatehi', game: 'fifaultimate', meta: 'Groep 7c — cijfer 9.48' },
  { label: 'Lichting 3', name: 'Al Qalam kids', game: 'hajj', meta: 'Namens de hele groep — Al Qalam School' },
];
