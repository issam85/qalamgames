// Service worker voor de app-versie van Qalam Games (installeren op een tablet of telefoon).
// Bewaart bewust niets van de spellen: alles komt altijd vers van de site, zodat een nieuwe
// versie meteen te zien is. Alleen zonder internet krijg je een vriendelijke melding.
const CACHE = 'qalam-offline-1';
const OFFLINE = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([OFFLINE, '/icons/icon-192.png'])));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE)));
});
