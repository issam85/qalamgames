// Foto maken: tekent het meisje op een kaart met een titel en maakt er een PNG van
// die je kunt opslaan.
import { dollSvg } from './doll.js';

const W = 720;
const H = 960;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// geeft een data-URL (PNG) van de foto terug
export async function makePhoto(outfit) {
  const svg = dollSvg(outfit).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="450" height="780" ');
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const doll = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#f6e9ff');
    bg.addColorStop(0.55, '#ffe6f3');
    bg.addColorStop(1, '#e6fff4');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.roundRect(60, 110, W - 120, H - 170, 36);
    ctx.fill();
    ctx.drawImage(doll, (W - 450) / 2, 140, 450, 780);
    ctx.fillStyle = '#c2419a';
    ctx.textAlign = 'center';
    ctx.font = '700 52px Fredoka, sans-serif';
    ctx.fillText('Mijn outfit', W / 2, 78);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
}
