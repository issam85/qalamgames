// De minigames en de keuze per ronde: willekeurig, zonder herhaling tot alle
// minigames aan de beurt zijn geweest. Vult ook de titelkaart vóór een minigame.
import { startSprint, stopSprint, KEY_LABELS } from './minigame-sprint.js';
import { startMijnkar, stopMijnkar } from './minigame-mijnkar.js';
import { startSterren, stopSterren, MOVE_LABELS } from './minigame-sterren.js';
import { TOUCH } from './sprint-input.js';

// three: gebruikt het 3D-canvas · clip: filmpje vooraf (alleen in ronde 1)
export const MINIGAMES = [
  {
    key: 'sprint',
    title: 'Sprint',
    blurb: 'Ram op je knop om vaart te maken en hou het tempo vast voor turbo. Wie het eerst over de finish is, wint!',
    keys: KEY_LABELS,
    three: true,
    clip: 'race-start',
    start: startSprint,
    stop: stopSprint,
  },
  {
    key: 'mijnkar',
    title: 'Mijnkar',
    blurb: 'Je karretje rijdt vanzelf door de grot. Spring op tijd over de rotsen, kristallen en gaten. Wie het eerst bij de finish is, wint!',
    keys: KEY_LABELS,
    three: false,
    clip: null,
    start: startMijnkar,
    stop: stopMijnkar,
  },
  {
    key: 'sterrenjacht',
    title: 'Sterrenjacht',
    blurb: 'Het is nacht en er vallen sterren! Loop links en rechts om ze te vangen. Een grote ster is 3 punten. Wie na 30 seconden de meeste heeft, wint!',
    keys: MOVE_LABELS,
    three: false,
    clip: null,
    start: startSterren,
    stop: stopSterren,
  },
];

let deck = [];

function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// bij een nieuw spel begint de stapel opnieuw
export function resetDeck() {
  deck = [];
}

export function pickMinigame() {
  if (deck.length === 0) deck = shuffle(MINIGAMES);
  return deck.pop();
}

// toetsen van de spelers, voor de titelkaart en boven het speelveld
export function keyHint(minigame, players) {
  const parts = players
    .filter((p) => p.control !== 'CPU')
    .map((p) => `${p.control}: ${minigame.keys[p.control]}`);
  if (TOUCH) parts.push('of tik op het scherm');
  return parts.join('   ');
}

export function fillCard(minigame, players) {
  document.getElementById('card-title').textContent = minigame.title;
  document.getElementById('card-img').src = `img/cards/${minigame.key}.webp`;
  document.getElementById('card-blurb').textContent = minigame.blurb;
  document.getElementById('card-keys').textContent = keyHint(minigame, players);
}
