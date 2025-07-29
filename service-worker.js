const CACHE_NAME = 'rotina-cache-v3'; // Mude a versão sempre que atualizar
const urlsToCache = [
  '/Rotina-Di-ria/',
  '/Rotina-Di-ria/index.html',
  '/Rotina-Di-ria/style.css',
  '/Rotina-Di-ria/js/script.js',
  '/Rotina-Di-ria/manifest.json',
  '/Rotina-Di-ria/icons/icon-192.png',
  '/Rotina-Di-ria/icons/icon-512.png'
];

// Cache dos arquivos
self.addEventListener('install', event => {
  self.skipWaiting(); // Ativa o novo SW imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim(); // Aplica o SW imediatamente
});

// Estratégia de cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Detecta novo SW e avisa o cliente
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
