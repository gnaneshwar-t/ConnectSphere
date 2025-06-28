// server/controllers/friendController.js

import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';

// Send a friend request
export const sendRequest = async (req, res) => {
  const { toUserId } = req.body;
  const fromUserId = req.user.id;

  try {
    if (fromUserId === toUserId) {
      return res.status(400).json({ msg: "Cannot send request to yourself!" });
    }

    const existing = await FriendRequest.findOne({
      fromUser: fromUserId,
      toUser: toUserId,
      status: 'pending'
    });
    if (existing) {
      return res.status(400).json({ msg: "Request already sent." });
    }

    const sender = await User.findById(fromUserId).select('friends');
    if (sender?.friends?.includes(toUserId)) {
      return res.status(400).json({ msg: "You are already friends!" });
    }

    const newRequest = new FriendRequest({
      fromUser: fromUserId,
      toUser: toUserId
    });
    await newRequest.save();

    res.json({ msg: "Friend request sent!" });
  } catch (err) {
    console.error("Error sending request:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Accept a friend request
export const acceptRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await FriendRequest.findById(requestId);
    if (!request || request.status !== 'pending') {
      return res.status(400).json({ msg: "Invalid request" });
    }

    request.status = 'accepted';
    await request.save();

    await User.findByIdAndUpdate(request.fromUser, {
      $addToSet: { friends: request.toUser }
    });
    await User.findByIdAndUpdate(request.toUser, {
      $addToSet: { friends: request.fromUser }
    });

    res.json({ msg: "Friend request accepted!" });
  } catch (err) {
    console.error("Error accepting request:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Reject a friend request
export const rejectRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await FriendRequest.findById(requestId);
    if (!request || request.status !== 'pending') {
      return res.status(400).json({ msg: "Invalid request" });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ msg: "Friend request rejected!" });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get all pending friend requests received by the current user
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      toUser: req.user.id,
      status: 'pending'
    }).populate('fromUser', 'name email');

    res.json(requests);
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};
