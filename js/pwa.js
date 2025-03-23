// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Clownades0S/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Управление установкой PWA
let deferredPrompt;
const installButton = document.getElementById('installPwa');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installButton) {
        installButton.style.display = 'block';
    }
});

window.addEventListener('appinstalled', () => {
    if (installButton) {
        installButton.style.display = 'none';
    }
});

if (installButton) {
    installButton.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
    });
}

// Управление офлайн-режимом
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
});

// Проверка поддержки PWA
function checkPWASupport() {
    const checks = {
        'HTTPS': window.location.protocol === 'https:',
        'Service Worker API': 'serviceWorker' in navigator,
        'Push API': 'PushManager' in window,
        'Notifications API': 'Notification' in window,
        'Manifest': !!document.querySelector('link[rel="manifest"]')
    };

    console.log('PWA Support Check:', checks);
    return Object.values(checks).every(check => check);
}

// Инициализация PWA
function initPWA() {
    if (checkPWASupport()) {
        console.log('PWA features are supported');
    } else {
        console.warn('Some PWA features are not supported');
    }
}

// Запуск инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', initPWA); 