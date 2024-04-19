const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const port = 3000;
const socketio = require('socket.io');
const formateMessage = require('./utils/messages');
const {
	userJoin,
	getCurrentUser,
	userLeavesChat,
	getRoomUsers,
} = require('./utils/users');

const server = http.createServer(app);
const io = socketio(server);
const botName = 'Chat Bot';

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room);

		socket.join(user.room);

		socket.emit(
			'message',
			formateMessage(botName, 'welcome to chart room'),
		);

		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formateMessage(botName, `${user.username} joined the chat`),
			);

		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	socket.on('chatMessage', (msg) => {
		const user = getCurrentUser(socket.id);
		io.to(user.room).emit('message', formateMessage(user.username, msg));
	});

	socket.on('disconnect', () => {
		const user = userLeavesChat(socket.id);
		if (user) {
			io.to(user.room).emit(
				'message',
				formateMessage(botName, `${user.username} left the chat`),
			);
		}

		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});
});

server.listen(port, () => {
	console.log(`Example server listening on port ${port}`);
});
