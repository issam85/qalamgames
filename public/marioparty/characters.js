// De 7 karakters: naam, accentkleur en afbeelding (img/<key>.png, 512px hoog,
// uitgesneden 3D-render met transparante achtergrond).
export const CHARACTERS = [
  { key: 'mario', name: 'Mario', color: '#e52521' },
  { key: 'luigi', name: 'Luigi', color: '#2faf4e' },
  { key: 'peach', name: 'Peach', color: '#ff8ac8' },
  { key: 'daisy', name: 'Daisy', color: '#ff9f1c' },
  { key: 'toad', name: 'Toad', color: '#ffffff' },
  { key: 'yoshi', name: 'Yoshi', color: '#4cc24a' },
  { key: 'bowser', name: 'Bowser', color: '#f7d03c' },
];

const images = new Map();

function imageUrl(character) {
  return `img/${character.key}.png`;
}

export function loadCharacters() {
  return Promise.all(CHARACTERS.map((character) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      images.set(character.key, img);
      resolve();
    };
    img.onerror = () => reject(new Error(`Kan ${imageUrl(character)} niet laden`));
    img.src = imageUrl(character);
  })));
}

// Tekent het karakter `height` px hoog met de voeten op (cx, footY),
// met een zachte schaduw op de grond.
export function drawCharacter(ctx, character, cx, footY, height) {
  const img = images.get(character.key);
  const width = (img.width * height) / img.height;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(cx, footY - 2, width * 0.38, height * 0.05, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.drawImage(img, cx - width / 2, footY - height, width, height);
}

export function characterImage(character, height) {
  const img = document.createElement('img');
  img.src = imageUrl(character);
  img.alt = character.name;
  img.height = height;
  return img;
}
