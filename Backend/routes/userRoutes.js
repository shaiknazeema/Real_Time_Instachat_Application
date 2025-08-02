const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMe } = require('../controllers/userController');
const User = require('../models/User');

router.get('/me', auth, getMe);

// Get all users except self and friends
router.get('/all', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const excludeIds = [me._id, ...me.friends, ...me.friendRequests];
    const users = await User.find({ _id: { $nin: excludeIds } }, 'name email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;