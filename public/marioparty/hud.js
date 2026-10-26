// Spelerskaarten onder de trap: karakter, speler/CPU, sterren en punten.
import { characterImage } from './characters.js';

export function renderHud(container, players) {
  container.innerHTML = '';
  players.forEach((player) => {
    const card = document.createElement('div');
    card.className = 'hud-card';
    card.style.borderColor = player.character.color;
    card.appendChild(characterImage(player.character, 56));
    const info = document.createElement('div');
    info.innerHTML = `<b>${player.character.name}</b><small>${player.control}</small>`
      + `<span>⭐ ${player.stars}</span><span>🍄 ${player.points}</span>`;
    card.appendChild(info);
    container.appendChild(card);
  });
}
