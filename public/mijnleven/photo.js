// Foto maken: tekent het meisje op een kaart met een titel en maakt er een PNG van
// die je kunt opslaan. Kan het apparaat delen (tablet, telefoon), dan deelt Opslaan
// de foto; in de app van de school (een WebView) lukt opslaan niet, dan staat er dat
// een grote mens een schermafbeelding kan maken.
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
export async function makePhoto(outfit, makeup) {
  // eerst het lettertype van de titel, anders staat er soms een gewone letter
  await document.fonts?.load('700 52px Fredoka').catch(() => {});
  const svg = dollSvg(outfit, makeup).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="450" height="780" ');
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

const saveEl = document.getElementById('photo-save');
const tipEl = document.getElementById('photo-tip');
const inWebView = navigator.userAgent.includes('; wv)');
let shared = null; // de foto als bestand, als dit apparaat kan delen

saveEl.addEventListener('click', (e) => {
  if (!shared) return;
  e.preventDefault();
  navigator.share({ files: [shared], title: 'Mijn outfit' }).catch(() => {});
});

// zet de foto in het venster en kiest hoe je hem bewaart
export async function preparePhoto(outfit, makeup) {
  const url = await makePhoto(outfit, makeup);
  document.getElementById('photo-img').src = url;
  saveEl.href = url;
  const file = new File([await (await fetch(url)).blob()], 'mijn-outfit.png', { type: 'image/png' });
  shared = navigator.canShare?.({ files: [file] }) ? file : null;
  saveEl.hidden = !shared && inWebView;
  tipEl.hidden = !saveEl.hidden;
}
