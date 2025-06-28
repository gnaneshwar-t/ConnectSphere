// server/models/FriendRequest.js

import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true }); // Includes createdAt and updatedAt fields

export default mongoose.model('FriendRequest', friendRequestSchema);
