// Lichtingen: leerlingen en hun spellen per cohort
export const top3 = [
  { rank: 1, name: 'Saifeddine Boulabkoul', game: 'Banana Storm Survivor', klas: 'Groep 7b', playable: 'bananastorm', v2: 'bananastorm2' },
  { rank: 2, name: 'Yahya Essanousi', game: 'Vice City Racing 3D', klas: 'Groep 6b', playable: 'vicecity', v2: 'vicecity2' },
  { rank: 3, name: 'Zakaria El Aamim', game: 'سباق السلام', gameSubtitle: 'Race of Peace', klas: 'Groep 6b', playable: 'game' },
];

export const honorable = [
  { rank: 4, name: 'Marouan El Amrani', game: 'Penalty Shooters Pro', gameSubtitle: 'Toernooi Edition', klas: 'Groep 7c', playable: 'penalty' },
  { rank: 5, name: 'Mahir Tazammourti', game: 'Auto Spel met Islam Vragen', klas: 'Groep 6a', playable: 'autospel', v2: 'autospel2' },
  { rank: 6, name: 'Reda Oruadia', game: 'Turbo Racer 3D - Mega Maps', klas: 'Groep 6c', playable: 'turboracer', v2: 'turboracer2' },
  { rank: 7, name: 'Junayd Bakkali', game: 'Turbo Race', klas: 'Groep 6a', playable: 'turborace' },
];

// Lichting 2 — Tweede ronde gamemakers (gerangschikt op beoordeling)
export const lichting2Top3 = [
  { rank: 1, name: 'Mohamed Fatehi', game: 'Fifa Ultimate', klas: 'Groep 7c', playable: 'fifaultimate', score: '9.48' },
  { rank: 2, name: 'Abdoerrahmaan Ezzarfani', game: 'Sonic Ultimate', klas: 'Groep 7c', playable: 'sonicultimate', score: '9.16' },
  { rank: 3, name: 'Amin van Ee', game: 'Stunt Racer', klas: 'Groep 6b', playable: 'stuntracer', score: '9.00' },
];
export const lichting2Rest = [
  { rank: 4, name: 'Abdulahi Abdulkhader', game: "Granny's Nightmare", klas: 'Groep 7c', playable: 'grannyhorrorgame', score: '8.63' },
  { rank: 5, name: 'Junayd Bakkali', game: 'Turbo Race', klas: 'Groep 6a', playable: 'turborace', score: '8.41' },
  { rank: 6, name: 'Adam El Majidi', game: 'Basketball Islam', klas: 'Groep 7b', playable: 'basketballislam', score: '8.14' },
  { rank: 7, name: 'Imran Mestour', game: 'Voetbal Legends', klas: 'Groep 6a', playable: 'kickoff3d', score: '7.50' },
  { rank: 8, name: 'Youssef El Mahjoubi', game: 'MijnCraft', klas: 'Groep 6b', playable: 'mijncraft', score: '7.19' },
];

// Lichting 3 — Derde ronde gamemakers
export const lichting3 = [
  { name: 'Amr Jahouhi', game: 'Fight Night', klas: 'Groep 7a', playable: 'fightnight', emoji: '🥊' },
  { name: 'Al Qalam kids', game: 'Hajj Simulator 3D', klas: 'Al Qalam School', playable: 'hajj', emoji: '🕋' },
];

// Lichting 4 — Vierde ronde gamemakers (oktober 2026)
export const lichting4 = [
  { name: 'Al Qalam kids', game: 'Mario Party', klas: 'Al Qalam School', playable: 'marioparty', emoji: '⭐' },
];

// Lichtingen met speelkaarten (zonder ranglijst): kaarten + subtitel per tab
export const cardLichtingen = {
  lichting4: { students: lichting4, subtitle: 'De nieuwste lichting — oktober 2026' },
  lichting3: { students: lichting3, subtitle: 'De derde lichting gamemakers' },
};

// Uitgelicht: eerste = brede kaart bovenaan
export const FEATURED = [
  { game: 'marioparty', lichting: 'Lichting 4', maker: 'Al Qalam kids', tags: ['1–2 spelers', 'Toetsenbord'] },
  { game: 'fightnight', maker: 'Amr Jahouhi — Groep 7a' },
  { game: 'hajj', maker: 'Al Qalam kids — Al Qalam School' },
];
