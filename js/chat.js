// chat.js

const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const imageInput = document.getElementById('image');
const chat = document.getElementById('chat');

let username = localStorage.getItem('username');
if (!username) {
  username = prompt('Masukkan username Anda:') || 'Anonim';
  localStorage.setItem('username', username);
}

socket.emit('join', username);

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const file = imageInput.files[0];
  const text = input.value.trim();

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      socket.emit('chat image', {
        user: username,
        image: reader.result,
        message: text
      });
    };
    reader.readAsDataURL(file);
  } else if (text) {
    socket.emit('chat message', { user: username, message: text });
  }

  input.value = '';
  imageInput.value = '';
});

socket.on('chat message', function (msg) {
  const item = document.createElement('div');
  item.className = "bg-gray-700 p-3 rounded shadow-md";
  item.innerHTML = `<strong class="text-blue-400">${msg.user}</strong>: ${msg.message}`;
  chat.appendChild(item);
  chat.scrollTop = chat.scrollHeight;
});

socket.on('chat image', function (data) {
  const item = document.createElement('div');
  item.className = "bg-gray-700 p-3 rounded shadow-md";
  item.innerHTML = `
    <strong class="text-blue-400">${data.user}</strong>: ${data.message || ''}
    <br>
    <img src="${data.image}" class="mt-2 max-w-xs rounded shadow" />
  `;
  chat.appendChild(item);
  chat.scrollTop = chat.scrollHeight;
});
