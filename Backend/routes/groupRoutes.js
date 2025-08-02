const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const groupController = require('../controllers/groupController');

router.post('/create', auth, groupController.createGroup);
router.get('/my', auth, groupController.getMyGroups);
router.post('/:groupId/message', auth, groupController.sendGroupMessage);

module.exports = router;
