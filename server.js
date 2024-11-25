const WebSocket = require('ws');

// Порт, на котором будет работать сервер
const PORT = 8080;

// Массив для хранения всех активных соединений
let clients = [];

// Создание WebSocket-сервера
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', function connection(ws) {
    clients.push(ws);
    console.log(`Новый клиент подключился! Всего клиентов: ${clients.length}`);
    ws.send('Приветствуем вас в нашем чате!');
    ws.on('message', function incoming(message) {
        console.log('Получено сообщение:', message);
        broadcastMessage(message);
    });

    // Обработка закрытия соединения
    ws.on('close', () => {
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1); // Удаляем закрытое соединение из массива
        }
        console.log("Клиент отключился. Осталось клиентов:", clients.length);
    });
});

// Функция для рассылки сообщения всем подключённым клиентам
function broadcastMessage(msg) {
    clients.forEach(client => {
        client.send(msg);
    })
}

console.log(`WebSocket-сервер запущен на порту ${PORT}.`);