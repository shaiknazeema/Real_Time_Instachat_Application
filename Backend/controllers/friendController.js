const User = require('../models/User');

// Send Friend Request
exports.sendFriendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ msg: 'User not found' });
    if (currentUser.friends.includes(targetUserId)) return res.status(400).json({ msg: 'Already friends' });
    if (targetUser.friendRequests.includes(currentUser._id)) return res.status(400).json({ msg: 'Request already sent' });

    targetUser.friendRequests.push(currentUser._id);
    await targetUser.save();

    res.json({ msg: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Accept Friend Request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const currentUser = await User.findById(req.user.id);
    const requester = await User.findById(requesterId);

    if (!currentUser.friendRequests.includes(requesterId)) {
      return res.status(400).json({ msg: 'No such friend request' });
    }

    currentUser.friends.push(requesterId);
    requester.friends.push(currentUser._id);

    currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== requesterId);

    await currentUser.save();
    await requester.save();

    res.json({ msg: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Reject Friend Request
exports.rejectFriendRequest = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const requesterId = req.body.requesterId;

    if (!currentUser.friendRequests.includes(requesterId)) {
      return res.status(400).json({ msg: 'No such friend request' });
    }

    currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== requesterId);
    await currentUser.save();

    res.json({ msg: 'Friend request rejected' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};