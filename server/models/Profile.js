// server/models/Profile.js

import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  interests: {
    type: [String], // List of user's interests
    default: []
  },
  profilePic: {
    type: String, // URL of profile picture
    default: ''
  }
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);
