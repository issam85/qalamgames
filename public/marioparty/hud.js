// Spelerskaarten: karakter, speler/CPU, sterren en punten.
// Gebruikt onder de trap en op het Toad-scherm.
import { characterImage } from './characters.js';

// geeft de kaarten terug in de volgorde van players
export function renderHud(container, players) {
  container.innerHTML = '';
  return players.map((player) => {
    const card = document.createElement('div');
    card.className = 'hud-card';
    card.style.borderColor = player.character.color;
    card.appendChild(characterImage(player.character, 56));
    const info = document.createElement('div');
    info.innerHTML = `<b>${player.character.name}</b><small>${player.control}</small>`
      + `<span class="stars">⭐ ${player.stars}</span><span class="points">🍄 ${player.points}</span>`;
    card.appendChild(info);
    container.appendChild(card);
    return card;
  });
}
