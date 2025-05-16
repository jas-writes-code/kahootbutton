const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS to allow frontend sites to connect
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store connected users
let users = new Map();

io.on('connection', (socket) => {
  users.set(socket.id, { id: socket.id });

  // Send all current users to host
  io.emit('update-users', Array.from(users.values()));

  console.log(`User connected: ${socket.id}`);

  // Flash start
  socket.on('flash', () => {
    io.emit('flash', socket.id);
  });

  // Flash end
  socket.on('flash-end', () => {
    io.emit('flash-end', socket.id);
  });

  // On disconnect
  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('update-users', Array.from(users.values()));
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
