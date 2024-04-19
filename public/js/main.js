const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});
const roomName = document.getElementById('room-name');
const roomUsers = document.getElementById('users');

const socket = io();

socket.emit('joinRoom', {
	username,
	room,
});

socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room);
	outputRoomUsers(users);
});

socket.on('message', (message) => {
	console.log(message);
	outPutMessage(message);

	chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const msg = e.target.elements.msg.value;
	socket.emit('chatMessage', msg);
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

const outPutMessage = (message) => {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p>
						<p class="text">
                        ${message.txtMsg}
						</p>`;
	document.querySelector('.chat-messages').appendChild(div);
};

const outputRoomName = (name) => {
	roomName.textContent = name;
};

const outputRoomUsers = (users) => {
	roomUsers.innerHTML = `
	${users.map((user) => `<li>${user.username}</li>`).join('')}
	`;
};
