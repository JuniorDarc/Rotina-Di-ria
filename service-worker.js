const CACHE_NAME = 'rotina-cache-v1';
const urlsToCache = [
  '/Rotina-Di-ria/',
  '/Rotina-Di-ria/index.html',
  '/Rotina-Di-ria/style.css',
  '/Rotina-Di-ria/js/script.js',
  '/Rotina-Di-ria/manifest.json',
  '/Rotina-Di-ria/icons/icon-192.png',
  '/Rotina-Di-ria/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
