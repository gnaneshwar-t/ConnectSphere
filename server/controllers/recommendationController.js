// server/controllers/recommendationController.js

import User from '../models/User.js';
import Profile from '../models/Profile.js';

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await Profile.findOne({ userId });
    const userData = await User.findById(userId);
    const allUsers = await User.find({ _id: { $ne: userId } });

    let recommendations = [];

    for (const user of allUsers) {
      const otherProfile = await Profile.findOne({ userId: user._id });
      if (!otherProfile) continue;

      // Calculate common interests
      const myInterests = new Set(userProfile.interests);
      const theirInterests = new Set(otherProfile.interests);
      const commonInterests = [...myInterests].filter(x => theirInterests.has(x));
      const interestScore = commonInterests.length;

      // Calculate mutual friends
      const myFriends = new Set((userData.friends || []).map(id => id.toString()));
      const theirFriends = new Set((user.friends || []).map(id => id.toString()));
      const mutualFriends = [...myFriends].filter(x => theirFriends.has(x));
      const mutualScore = mutualFriends.length;

      // Weighted score: interests count more than mutual friends
      const totalScore = interestScore * 2 + mutualScore;

      recommendations.push({
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        commonInterests,
        mutualFriendsCount: mutualScore,
        score: totalScore
      });
    }

    // Return top 10 matches sorted by score
    recommendations.sort((a, b) => b.score - a.score);
    res.status(200).json(recommendations.slice(0, 10));
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
