// server/controllers/searchUsers.js

import User from '../models/User.js';

// Search users by name (case-insensitive)
export const searchUsers = async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ msg: 'Query missing' });
  }

  try {
    const users = await User.find({
      name: { $regex: query, $options: 'i' }
    }).select('-password'); // Exclude password from response

    res.json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
