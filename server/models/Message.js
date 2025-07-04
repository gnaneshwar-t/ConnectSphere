// server/models/Message.js

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: String, required: true }, // Identifier for the private chat room
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);
