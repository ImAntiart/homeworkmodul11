document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы DOM
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const form = document.querySelector('form');

    // Создаем экземпляр WebSocket и подключаемся к серверу
    const socket = new WebSocket('ws://localhost:8080'); // Убедитесь, что адрес совпадает с вашим сервером

    // Обрабатываем событие открытия соединения
    socket.onopen = function(event) {
        console.log('Соединение установлено.');
    };

// Обрабатываем получение сообщений от сервера
socket.onmessage = function(event) {
    // Преобразуем Blob в текст
    const reader = new FileReader();
    reader.onloadend = function() {
        addMessageToChat(reader.result);
    };
    reader.readAsText(event.data);
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
        const messageDiv = document.createElement('div');
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