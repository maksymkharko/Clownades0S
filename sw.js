const CACHE_NAME = 'clownades0s-v1';
const urlsToCache = [
    '/Clownades0S/',
    '/Clownades0S/index.html',
    '/Clownades0S/Glawnaja.html',
    '/Clownades0S/settings.html',
    '/Clownades0S/manifest.json',
    '/Clownades0S/icons/icon-192x192.png',
    '/Clownades0S/icons/icon-512x512.png',
    '/Clownades0S/css/main.css',
    '/Clownades0S/css/apps.css',
    '/Clownades0S/js/apps.js',
    '/Clownades0S/js/settings.js',
    '/Clownades0S/js/pwa.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Установка Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Активация Service Worker
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

// Обработка запросов
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Возвращаем кэшированный ответ, если он есть
                if (response) {
                    return response;
                }

                // Иначе делаем сетевой запрос
                return fetch(event.request)
                    .then(response => {
                        // Проверяем валидность ответа
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Клонируем ответ, так как он может быть использован только один раз
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // В случае ошибки сети возвращаем офлайн-страницу
                        if (event.request.mode === 'navigate') {
                            return caches.match('/Clownades0S/offline.html');
                        }
                    });
            })
    );
});

// Обработка push-уведомлений
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/Clownades0S/icons/icon-192x192.png',
        badge: '/Clownades0S/icons/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Открыть'
            },
            {
                action: 'close',
                title: 'Закрыть'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Clownades0S', options)
    );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/Clownades0S/')
        );
    }
}); 