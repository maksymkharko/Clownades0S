const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
    key: fs.readFileSync('ssl/private.key'),
    cert: fs.readFileSync('ssl/certificate.pem')
};

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

const server = https.createServer(options, (req, res) => {
    // Получаем путь к файлу
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Получаем расширение файла
    const extname = path.extname(filePath);
    let contentType = mimeTypes[extname] || 'application/octet-stream';

    // Читаем файл
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Файл не найден
                fs.readFile('./404.html', (error, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                // Серверная ошибка
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code);
            }
        } else {
            // Успешно
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Service-Worker-Allowed': '/'
            });
            res.end(content, 'utf-8');
        }
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at https://localhost:${port}/`);
    console.log('To test PWA:');
    console.log('1. Open Chrome/Safari');
    console.log('2. Navigate to https://localhost:3000');
    console.log('3. Accept the self-signed certificate warning');
    console.log('4. Open DevTools (F12) and go to Application tab');
    console.log('5. Check Manifest and Service Worker sections');
}); 