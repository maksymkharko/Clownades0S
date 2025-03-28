# Clownades0S

Многофункциональное веб-приложение с темной темой и скеоморфным дизайном, реализованное как Progressive Web App (PWA).

## Особенности

- 🌙 Темная тема
- 💎 Скеоморфный дизайн
- 📱 PWA с поддержкой офлайн-режима
- 🔄 Синхронизация данных
- 📊 Управление автомобилями
- ⚡ Быстрая работа
- 🎨 Современный интерфейс

## Технологии

- HTML5
- CSS3 (с использованием современных features)
- JavaScript (ES6+)
- Service Workers для PWA
- Local Storage для хранения данных
- Node.js для разработки

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/maksymkharko/Clownades0S.git
```

2. Перейдите в директорию проекта:
```bash
cd Clownades0S
```

3. Установите зависимости:
```bash
npm install
```

4. Для локальной разработки с HTTPS создайте SSL сертификаты:
```bash
mkdir ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/private.key -out ssl/certificate.pem
```

5. Запустите сервер:
```bash
npm start
```

6. Откройте https://localhost:3000 в браузере

## Использование

1. Откройте приложение в браузере
2. Нажмите "Установить" для установки PWA
3. Приложение будет доступно даже без интернета
4. Все данные сохраняются локально

## Разработка

Для разработки:

1. Запустите сервер в режиме разработки:
```bash
npm start
```

2. Откройте DevTools (F12) в браузере
3. Перейдите на вкладку Application для отладки PWA
4. Используйте вкладку Network для тестирования офлайн-режима

## Деплой

1. Создайте репозиторий на GitHub
2. Настройте GitHub Pages в настройках репозитория
3. Выберите ветку main и папку / (root) для публикации
4. Ваше приложение будет доступно по адресу https://maksymkharko.github.io/Clownades0S/

## Лицензия

ISC 