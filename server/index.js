import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import Message from './models/Message.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import userRoutes from './routes/userRoutes.js';
import suggestionsRoutes from './routes/suggestionsRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/user", userRoutes);
app.use("/api/suggestions", suggestionsRoutes);
app.use("/api/messages", messageRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Socket.io setup
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log("A user connected");

  // Join chat room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle private messages
  socket.on('private-message', async ({ senderId, receiverId, message }) => {
    const roomId = [senderId, receiverId].sort().join('-');
    console.log(`Message from ${senderId} to ${receiverId} in room ${roomId}: ${message}`);

    // Save message to database
    await Message.create({
      senderId,
      receiverId,
      roomId,
      message,
      timestamp: new Date()
    });

    // Emit message to both users
    io.to(roomId).emit('receive-private-message', { senderId, message });
  });

  socket.on('disconnect', () => {
    console.log("A user disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
