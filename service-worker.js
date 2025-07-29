const CACHE_NAME = 'rotina-cache-v2'; // <-- Altere isso sempre que fizer uma nova versão
const urlsToCache = [
  '/Rotina-Di-ria/',
  '/Rotina-Di-ria/index.html',
  '/Rotina-Di-ria/style.css',
  '/Rotina-Di-ria/js/script.js',
  '/Rotina-Di-ria/manifest.json',
  '/Rotina-Di-ria/icons/icon-192.png',
  '/Rotina-Di-ria/icons/icon-512.png'
];

// Instalando e armazenando arquivos no cache
self.addEventListener('install', event => {
  self.skipWaiting(); // força instalação imediata
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Ativando e removendo caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // remove cache antigo
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Respondendo com cache ou rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
