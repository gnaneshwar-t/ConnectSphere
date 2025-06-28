// server/controllers/suggestionsController.js

import User from '../models/User.js';
import Profile from '../models/Profile.js';
import FriendRequest from '../models/FriendRequest.js';

export const getSuggestions = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentProfile = await Profile.findOne({ userId: currentUserId });
    if (!currentProfile) return res.json([]);

    const currentUser = await User.findById(currentUserId).populate('friends');
    const currentFriends = currentUser?.friends?.map(f => f._id.toString()) || [];

    const sentRequests = await FriendRequest.find({
      fromUser: currentUserId,
      status: 'pending'
    }).select('toUser');
    const sentRequestIds = sentRequests.map(req => req.toUser.toString());

    const allProfiles = await Profile.find({ userId: { $ne: currentUserId } });

    const suggestions = await Promise.all(
      allProfiles.map(async (profile) => {
        const targetUserId = profile.userId?.toString();
        if (!targetUserId) return null;

        // Skip if already friends or request sent
        if (currentFriends.includes(targetUserId)) return null;
        if (sentRequestIds.includes(targetUserId)) return null;

        const commonInterests = profile.interests.filter(interest =>
          currentProfile.interests.includes(interest)
        );

        const user = await User.findById(profile.userId).populate('friends');
        if (!user) return null;

        const targetFriends = user?.friends?.map(f => f._id.toString()) || [];
        const mutualFriendsCount = targetFriends.filter(fid =>
          currentFriends.includes(fid)
        ).length;

        return {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          commonInterests,
          mutualFriendsCount,
          score: commonInterests.length
        };
      })
    );

    const validSuggestions = suggestions.filter(s => s !== null);
    validSuggestions.sort((a, b) => b.score - a.score);

    res.json(validSuggestions);
  } catch (err) {
    console.error('Error in getSuggestions:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
