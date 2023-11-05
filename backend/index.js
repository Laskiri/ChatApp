// Filename - index.js

const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { addUser, removeUser, getUser,
	getUsersInRoom } = require("./users");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});
io.on("connection", (socket) => {
	socket.on('join', ({ name, room }, callback) => {
        console.log("join")
        console.log(name)
		const { error, user } = addUser(
			{ id: socket.id, name, room });
        

		if (error) return callback(error);

		// Emit will send message to the user
		// who had joined
		socket.emit('message', {
			user: 'admin', text:
				`${user.name}, 
			welcome to room ${user.room}.`
		});

		// Broadcast will send message to everyone
		// in the room except the joined user
		socket.broadcast.to(user.room)
			.emit('message', {
				user: "admin",
				text: `${user.name}, has joined`
			});

		socket.join(user.room);

		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room)
		});
		callback();
	})

	socket.on('sendMessage', (message, callback) => {

		const user = getUser(socket.id);
		io.to(user.room).emit('message',
			{ user: user.name, text: message });

		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room)
		});
		callback();
	})

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
		if (user) {
			io.to(user.room).emit('message',
				{
					user: 'admin', text:
						`${user.name} had left`
				});
		}
	})

})

server.listen(process.env.PORT || 5000,
	() => console.log(`Server has started.`));
