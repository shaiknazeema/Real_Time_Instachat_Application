const express = require('express');
const router = express.Router();   // ✅ you forgot this line
const auth = require('../middleware/auth');
const Message = require('../models/message');
const multer = require('multer');
const path = require('path');

// Configure multer to store uploads in 'uploads/' folder
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload media route
router.post('/:otherUserId/media', auth, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;
    const fileUrl = `/uploads/${req.file.filename}`;  // this is the URL you save

    const message = await Message.create({
      from: userId,
      to: otherUserId,
      fileUrl
    });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// existing get & post routes for messages (if you had them)
router.get('/:otherUserId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;

    const messages = await Message.find({
      $or: [
        { from: userId, to: otherUserId },
        { from: otherUserId, to: userId }
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/:otherUserId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;
    const { text } = req.body;

    const message = await Message.create({
      from: userId,
      to: otherUserId,
      text
    });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
