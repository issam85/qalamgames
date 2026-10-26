// De 7 karakters: naam, accentkleur en afbeelding (img/<key>.png, 512px hoog,
// uitgesneden 3D-render met transparante achtergrond) voor kaarten en Toad.
// Op het speelveld worden de geanimeerde sprites gebruikt (sprites.js).
import { loadImage } from './assets.js';

export const CHARACTERS = [
  { key: 'mario', name: 'Mario', color: '#e52521' },
  { key: 'luigi', name: 'Luigi', color: '#2faf4e' },
  { key: 'peach', name: 'Peach', color: '#ff8ac8' },
  { key: 'daisy', name: 'Daisy', color: '#ff9f1c' },
  { key: 'toad', name: 'Toad', color: '#ffffff' },
  { key: 'yoshi', name: 'Yoshi', color: '#4cc24a' },
  { key: 'bowser', name: 'Bowser', color: '#f7d03c' },
];

function imageUrl(character) {
  return `img/${character.key}.png`;
}

export function loadCharacters() {
  return Promise.all(CHARACTERS.map((character) => loadImage(imageUrl(character))));
}

export function characterImage(character, height) {
  const img = document.createElement('img');
  img.src = imageUrl(character);
  img.alt = character.name;
  img.height = height;
  return img;
}
