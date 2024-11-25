document.addEventListener('DOMContentLoaded', function() {
    const socket = new WebSocket('ws://localhost:8080');

    // Обработчик получения сообщения от сервера
    socket.onmessage = function(event) {
        let messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML += `<p>${event.data}</p>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Прокручиваем вниз
    };

    // Отправка сообщения
    function sendMessage() {
        let messageInput = document.getElementById('messageInput');
        if (messageInput.value.trim() !== '') {
            socket.send(messageInput.value); // Отправляем сообщение на сервер
            messageInput.value = ''; // Очищаем поле ввода
        }
    }

    // Подписка на событие отправки формы
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        sendMessage();
    });
});