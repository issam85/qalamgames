// Laadt afbeeldingen één keer en houdt ze in een cache voor canvas-tekenen.
const cache = new Map();

export function loadImage(url) {
  if (cache.has(url)) return Promise.resolve(cache.get(url));
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      cache.set(url, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Kan ${url} niet laden`));
    img.src = url;
  });
}

export function getImage(url) {
  return cache.get(url);
}
