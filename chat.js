document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы DOM
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const form = document.querySelector('form');

    // Создаем экземпляр WebSocket и подключаемся к серверу
    const socket = new WebSocket('ws://localhost:8080'); 

    // Обрабатываем событие открытия соединения
    socket.onopen = function(event) {
        console.log('Соединение установлено.');
    };

// Обрабатываем получение сообщений от сервера

socket.onmessage = function(event) {
    let message;

    ////  И ТУТ МЫ ТАКИЕ проверяем тип данных, кто перед нами
    if (typeof event.data === 'string') {
        message = event.data;
    } else if (event.data instanceof Blob) {
        // Внезапно, если нашли этого блоба, берем и преобразуем этого амогуса в текст
        const reader = new FileReader();
        reader.onloadend = function() {
            message = reader.result;
            addMessageToChat(message);
        };
        reader.readAsText(event.data);
    }
    
    if (!message) return;
    addMessageToChat(message);
};
    // Обрабатываем ошибку соединения
    socket.onerror = function(error) {
        console.error('Ошибка WebSocket:', error);
    };

    // Обрабатываем закрытие соединения
    socket.onclose = function(event) {
        console.log('Соединение закрыто.', event);
    };

    // Функция для добавления сообщения в область чата
    function addMessageToChat(message) {
        const messageDiv = document.createElement('p');
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);

        // Автопрокрутка области чата вниз
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Обработка отправки формы
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const message = messageInput.value.trim(); // Убираем лишние пробелы

        if (message) {
            socket.send(message);
            messageInput.value = ''; // Очищаем поле ввода после отправки
        }
    });

    // Отправка сообщения при нажатии клавиши Enter
    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });
});
