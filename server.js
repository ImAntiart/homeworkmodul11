const WebSocket = require('ws');

// Создаем новый экземпляр WebSocket-сервера
const wss = new WebSocket.Server({ port: 8080 });

// Массив для хранения всех активных соединений
let clients = [];

// Обработчик события 'connection' при новом соединении
wss.on('connection', function connection(ws) {
    // Добавляем новое соединение в массив клиентов
    clients.push(ws);
    
    console.log('Новое соединение установлено.');
    
    // Отправляем приветственное сообщение новому клиенту
    ws.send('Добро пожаловать на WebSocket-сервер!');

    // Обрабатываем получение сообщения от клиента
    ws.on('message', function incoming(message) {
        console.log(`Получено сообщение: ${message}`);
        
        // Пересылаем сообщение всем подключенным клиентам
        broadcastMessage(message);
    });

    // Обрабатываем событие закрытия соединения
    ws.on('close', () => {
        console.log('Клиент отключился.');
        
        // Удаляем клиента из массива активных соединений
        clients = clients.filter(client => client !== ws);
    });
});

// Функция для отправки сообщения всем активным клиентам
function broadcastMessage(message) {
    clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

console.log('WebSocket сервер запущен на localhost:8080');