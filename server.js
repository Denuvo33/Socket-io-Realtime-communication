const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);


let userMessages = {};

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // When a user sends a message
  socket.on('privateMessage', ({ fromUserId, toUserId, imageBytes,message }) => {
    console.log(` message from ${fromUserId} to ${toUserId}: ${message}`);

    // Store the message
    if (!userMessages[toUserId]) {
      userMessages[toUserId] = [];
    }
    userMessages[toUserId].push({
      from: fromUserId,
      message: message,
      timestamp: new Date(),
    });

    // Emit message to the recipient's room (toUserId should be a room ID)
    io.to(toUserId).emit('privateMessage', {
      fromUserId: fromUserId,
      message: message,
      imageBytes: imageBytes,
    });
  });

  // Handle user joining a room based on their UID
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User with ID ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
