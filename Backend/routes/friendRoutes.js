const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = require('../controllers/friendController');

router.post('/send', auth, sendFriendRequest);
router.post('/accept', auth, acceptFriendRequest);
router.post('/reject', auth, rejectFriendRequest);

module.exports = router;