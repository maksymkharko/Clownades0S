const CACHE_NAME = 'clownades-v1';
const BASE_PATH = '/Clownades0S';
const ASSETS_TO_CACHE = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/app1.html`,
  `${BASE_PATH}/app2.html`,
  `${BASE_PATH}/app3.html`,
  `${BASE_PATH}/app4.html`,
  `${BASE_PATH}/app5.html`,
  `${BASE_PATH}/app6.html`,
  `${BASE_PATH}/settings.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/src/styles/main.css`,
  `${BASE_PATH}/src/styles/app1.css`,
  `${BASE_PATH}/src/styles/app2.css`,
  `${BASE_PATH}/src/styles/app3.css`,
  `${BASE_PATH}/src/styles/app4.css`,
  `${BASE_PATH}/src/styles/app5.css`,
  `${BASE_PATH}/src/styles/statusbar.css`,
  `${BASE_PATH}/src/styles/navbar.css`,
  `${BASE_PATH}/src/scripts/StatusBar.js`,
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Установка Service Worker и кэширование файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Стратегия кэширования: сначала кэш, потом сеть
self.addEventListener('fetch', (event) => {
  // Добавляем базовый путь к URL, если его нет
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith(BASE_PATH)) {
    url.pathname = BASE_PATH + url.pathname;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
}); 