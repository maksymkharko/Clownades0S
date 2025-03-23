const CACHE_NAME = 'clownades0s-v1';
const urlsToCache = [
  '.',
  'index.html',
  'Glawnaja.html',
  'settings.html',
  'menu.html',
  'main.css',
  'js/apps.js',
  'js/pwa.js',
  'js/settings.js',
  'manifest.json',
  'offline.html',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];

// Установка Service Worker и кэширование файлов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Стратегия кэширования: сначала кэш, потом сеть
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match('offline.html');
            }
          });
      })
  );
}); 