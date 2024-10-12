const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // When a user sends a message
  socket.on('privateMessage', ({ fromUserId, toUserId, imageBytes,message }) => {
    console.log(` message from ${fromUserId} to ${toUserId}: ${message}`);


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
  });

  socket.on('disconnect', () => {
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



