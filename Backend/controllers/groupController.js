const Group = require('../models/Group');

// create new group
exports.createGroup = async (req, res) => {
  const { name, memberIds } = req.body;
  try {
    const group = await Group.create({ name, members: memberIds });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group' });
  }
};

// get all groups where current user is a member
exports.getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate('members', 'name');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load groups' });
  }
};

// send message in group
exports.sendGroupMessage = async (req, res) => {
  const { groupId } = req.params;
  const { text } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const message = { sender: req.user.id, text };
    group.messages.push(message);
    await group.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
