// Toad deelt na elke minigame de sterren en punten uit.
import { CHARACTERS, characterImage } from './characters.js';
import { AWARDS } from './board.js';

const TOAD = CHARACTERS.find((ch) => ch.key === 'toad');

function stars(n) {
  return `${n} ${n === 1 ? 'ster' : 'sterren'}`;
}

function awardLine(player, award) {
  return `${player.character.name}: ${stars(award.stars)} en ${award.points} punten!`;
}

export function renderToad(container, ranking) {
  container.innerHTML = '';
  container.appendChild(characterImage(TOAD, 240));
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  const losers = ranking.slice(2).map((p) => p.character.name).join(' en ');
  [
    `Goed gedaan, ${ranking[0].character.name}!`,
    awardLine(ranking[0], AWARDS.first),
    awardLine(ranking[1], AWARDS.second),
    `${losers} gaan een trede omlaag.`,
  ].forEach((text) => {
    const line = document.createElement('p');
    line.textContent = text;
    bubble.appendChild(line);
  });
  container.appendChild(bubble);
}
