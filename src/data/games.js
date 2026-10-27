// Spellen: sleutel (= deep link #sleutel) → titel, iframe-bron (null = React-component),
// accentkleur, thumbnail in public/thumbs/ en optioneel een stille loop-video.
// `bar` is de stijl van de oude spelbalk (vervalt met de nieuwe spelpagina).
const bar = (border, color, bg, font) => ({ border, color, bg, font });

export const GAMES = {
  marioparty: {
    title: 'Mario Party', src: '/marioparty/index.html', accent: '#e53935', video: '/video/marioparty.mp4',
    blurb: 'Kies je karakter, win de sprint en krijg sterren van Toad. Wie verliest, zakt een trede op de stenen trap. Vijf rondes, met 1 of 2 spelers.',
    controls: [['Speler 1', 'Spatie'], ['Speler 2', 'Pijltje omhoog']],
    howto: 'Vijf rondes. Ram zo snel je kan in de sprint. De winnaar krijgt twee sterren van Toad; wie verliest, zakt een trede op de trap.',
    bar: bar('#e53935', '#ffd43b', 'rgba(21,101,192,0.9)', '"Fredoka", sans-serif'),
  },
  fightnight: {
    title: 'Fight Night', src: '/fightnight.html', accent: '#FAC775', video: '/video/fightnight.mp4',
    blurb: "Een knokspel in een echte boksarena: kies je vechter, doe de warming-up en versla je tegenstander met jabs, combo's en knock-outs.",
    bar: bar('#FAC775', '#FAC775', 'rgba(10,8,6,0.92)', '"Bebas Neue", sans-serif'),
  },
  // Externe deploy (eigen repo: hajj-simulator-3d), via iframe ingeladen
  hajj: {
    title: 'Hajj Simulator 3D', src: 'https://hajj-simulator-3d.vercel.app', accent: '#d4af37', video: '/video/hajj.mp4',
    blurb: 'Beleef de hele bedevaart naar Mekka: van de intentie thuis tot de Tawaf, Arafat, Mina en het bezoek aan Medina. Met fotorealistische 3D-modellen.',
    bar: bar('#d4af37', '#d4af37', 'rgba(26,15,10,0.85)', '"Amiri", serif'),
  },
  fifaultimate: { title: 'Fifa Ultimate', src: '/fifaultimate.html', accent: '#c8960a', bar: bar('#c8960a', '#c8960a', 'rgba(10,18,8,0.9)', '"Arial Black", Arial, sans-serif') },
  sonicultimate: { title: 'Sonic Ultimate', src: '/sonicultimate.html', accent: '#00ccff', bar: bar('#0066ff', '#00ccff', 'rgba(0,0,30,0.9)', '"Press Start 2P", monospace, sans-serif') },
  stuntracer: { title: 'Stunt Racer', src: '/stuntracer.html', accent: '#ff6600', bar: bar('#ff6600', '#ffcc00', 'rgba(10,5,0,0.9)', '"Orbitron", sans-serif') },
  grannyhorrorgame: { title: "Granny's Nightmare", src: '/grannyhorrorgame.html', accent: '#ff2200', bar: bar('#cc0000', '#ff2200', 'rgba(0,0,0,0.95)', '"Creepster", cursive, sans-serif') },
  turborace: { title: 'Turbo Race', src: '/turborace.html', accent: '#ff9933', bar: bar('#ff6600', '#ff9933', 'rgba(8,8,16,0.95)', 'monospace') },
  basketballislam: { title: 'Basketball Islam', src: '/basketballislam.html', accent: '#FDB927', bar: bar('#FDB927', '#FDB927', 'rgba(4,4,12,0.95)', 'monospace') },
  kickoff3d: { title: 'Voetbal Legends', src: '/kickoff3d.html', accent: '#ffd700', bar: bar('#ffd700', '#ffd700', 'rgba(10,10,15,0.9)', '"Bebas Neue", sans-serif') },
  mijncraft: { title: 'MijnCraft', src: '/mijncraft.html', accent: '#6FFFA0', bar: bar('#6FFFA0', '#6FFFA0', 'rgba(7,20,40,0.9)', '"VT323", "Courier New", monospace') },
  bananastorm: { title: 'Banana Storm Survivor', src: '/bananastorm.html', accent: '#8c9eff', bar: bar('#667eea', '#fff', 'rgba(0,0,0,0.8)', 'sans-serif') },
  bananastorm2: { title: 'Banana Storm Survivor V2', src: '/bananastorm2.html', accent: '#8c9eff', thumb: 'bananastorm', bar: bar('#667eea', '#fff', 'rgba(0,0,0,0.8)', 'sans-serif') },
  vicecity: { title: 'Vice City Racing 3D', src: '/vicecity.html', accent: '#ff00ff', bar: bar('#ff00ff', '#ff00ff', 'rgba(0,0,0,0.8)', 'Impact, sans-serif') },
  vicecity2: { title: 'Vice City Racing 3D V2', src: '/vicecity2.html', accent: '#ff00ff', thumb: 'vicecity', bar: bar('#ff00ff', '#ff00ff', 'rgba(0,0,0,0.8)', 'Impact, sans-serif') },
  game: { title: 'سباق السلام', src: null, accent: '#d4af37', bar: bar('#d4af37', '#d4af37', 'rgba(26,15,10,0.8)', '"Amiri", serif') },
  penalty: { title: 'Penalty Shooters Pro', src: '/penalty.html', accent: '#4caf50', bar: bar('#4caf50', '#4caf50', 'rgba(0,0,0,0.8)', 'sans-serif') },
  autospel: { title: 'Auto Spel met Islam Vragen', src: '/autospel.html', accent: '#f5576c', bar: bar('#f5576c', '#fff', 'rgba(0,0,0,0.8)', 'sans-serif') },
  autospel2: { title: 'Auto Spel V2', src: '/autospel2.html', accent: '#f5576c', thumb: 'autospel', bar: bar('#f5576c', '#fff', 'rgba(0,0,0,0.8)', 'sans-serif') },
  turboracer: { title: 'Turbo Racer 3D', src: '/turboracer.html', accent: '#00ff88', bar: bar('#00ff88', '#00ff88', 'rgba(0,0,0,0.8)', 'sans-serif') },
  turboracer2: { title: 'Turbo Racer 3D V2', src: '/turboracer2.html', accent: '#00ff88', thumb: 'turboracer', bar: bar('#00ff88', '#00ff88', 'rgba(0,0,0,0.8)', 'sans-serif') },
  mariospel: { title: 'Mario-achtig Spel', src: '/mariospel.html', accent: '#e52521', bar: bar('#e52521', '#fff', 'rgba(0,0,0,0.8)', 'sans-serif') },
  mariospel2: { title: 'Mario-achtig Spel V2', src: '/mariospel2.html', accent: '#e52521', bar: bar('#e52521', '#fff', 'rgba(0,0,0,0.8)', 'sans-serif') },
};

export const thumbOf = (key) => `/thumbs/${GAMES[key].thumb || key}.webp`;
