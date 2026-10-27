// Spellen: sleutel (= deep link #sleutel) → titel, iframe-bron (null = React-component),
// accentkleur, thumbnail in public/thumbs/ en optioneel een stille loop-video.

export const GAMES = {
  marioparty: {
    title: 'Mario Party', src: '/marioparty/index.html', accent: '#e53935', video: '/video/marioparty.mp4',
    blurb: 'Kies je karakter, win de sprint en krijg sterren van Toad. Wie verliest, zakt een trede op de stenen trap. Vijf rondes, met 1 of 2 spelers.',
    controls: [['Speler 1', 'Spatie'], ['Speler 2', 'Pijltje omhoog']],
    howto: 'Vijf rondes. Ram zo snel je kan in de sprint. De winnaar krijgt twee sterren van Toad; wie verliest, zakt een trede op de trap.',
  },
  fightnight: {
    title: 'Fight Night', src: '/fightnight.html', accent: '#FAC775', video: '/video/fightnight.mp4',
    blurb: "Een knokspel in een echte boksarena: kies je vechter, doe de warming-up en versla je tegenstander met jabs, combo's en knock-outs.",
  },
  // Externe deploy (eigen repo: hajj-simulator-3d), via iframe ingeladen
  hajj: {
    title: 'Hajj Simulator 3D', src: 'https://hajj-simulator-3d.vercel.app', accent: '#d4af37', video: '/video/hajj.mp4',
    blurb: 'Beleef de hele bedevaart naar Mekka: van de intentie thuis tot de Tawaf, Arafat, Mina en het bezoek aan Medina. Met fotorealistische 3D-modellen.',
  },
  fifaultimate: { title: 'Fifa Ultimate', src: '/fifaultimate.html', accent: '#c8960a' },
  sonicultimate: { title: 'Sonic Ultimate', src: '/sonicultimate.html', accent: '#00ccff' },
  stuntracer: { title: 'Stunt Racer', src: '/stuntracer.html', accent: '#ff6600' },
  grannyhorrorgame: { title: "Granny's Nightmare", src: '/grannyhorrorgame.html', accent: '#ff2200' },
  turborace: { title: 'Turbo Race', src: '/turborace.html', accent: '#ff9933' },
  basketballislam: { title: 'Basketball Islam', src: '/basketballislam.html', accent: '#FDB927' },
  kickoff3d: { title: 'Voetbal Legends', src: '/kickoff3d.html', accent: '#ffd700' },
  mijncraft: { title: 'MijnCraft', src: '/mijncraft.html', accent: '#6FFFA0' },
  bananastorm: { title: 'Banana Storm Survivor', src: '/bananastorm.html', accent: '#8c9eff' },
  bananastorm2: { title: 'Banana Storm Survivor V2', src: '/bananastorm2.html', accent: '#8c9eff', thumb: 'bananastorm' },
  vicecity: { title: 'Vice City Racing 3D', src: '/vicecity.html', accent: '#ff00ff' },
  vicecity2: { title: 'Vice City Racing 3D V2', src: '/vicecity2.html', accent: '#ff00ff', thumb: 'vicecity' },
  game: { title: 'سباق السلام', src: null, accent: '#d4af37' },
  penalty: { title: 'Penalty Shooters Pro', src: '/penalty.html', accent: '#4caf50' },
  autospel: { title: 'Auto Spel met Islam Vragen', src: '/autospel.html', accent: '#f5576c' },
  autospel2: { title: 'Auto Spel V2', src: '/autospel2.html', accent: '#f5576c', thumb: 'autospel' },
  turboracer: { title: 'Turbo Racer 3D', src: '/turboracer.html', accent: '#00ff88' },
  turboracer2: { title: 'Turbo Racer 3D V2', src: '/turboracer2.html', accent: '#00ff88', thumb: 'turboracer' },
  mariospel: { title: 'Mario-achtig Spel', src: '/mariospel.html', accent: '#e52521' },
  mariospel2: { title: 'Mario-achtig Spel V2', src: '/mariospel2.html', accent: '#e52521' },
};

export const thumbOf = (key) => `/thumbs/${GAMES[key].thumb || key}.webp`;
