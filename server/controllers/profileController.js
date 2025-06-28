// server/controllers/profileController.js

import User from '../models/User.js';
import Profile from '../models/Profile.js';

// Create or update a user's profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, interests, profilePic } = req.body;

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      profile = new Profile({ userId, bio, interests, profilePic });
    } else {
      profile.bio = bio;
      profile.interests = interests;
      profile.profilePic = profilePic;
    }

    await profile.save();
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get full user profile by userId
export const getUserProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).select('name email friends');
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const profile = await Profile.findOne({ userId }).select('bio interests profilePic');
    const friends = await User.find({ _id: { $in: user.friends } }).select('name');

    const response = {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: profile?.bio || '',
      interests: profile?.interests || [],
      profilePic: profile?.profilePic || '',
      friends: friends.map(friend => ({ id: friend._id, name: friend.name }))
    };

    res.json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
