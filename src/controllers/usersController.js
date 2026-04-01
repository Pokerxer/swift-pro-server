const User = require('../models/User');

// GET /api/users — list all users (admin only)
exports.getAll = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users — create a new user (admin only)
exports.create = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, password, role: role || 'editor' });
    await user.save();
    res.status(201).json({ id: user._id, username: user.username, email: user.email, role: user.role, createdAt: user.createdAt });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/users/:id/role — change role (admin only)
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'editor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or editor.' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/users/:id — update username/email (admin only)
exports.update = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const updates = { updatedAt: Date.now() };
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (role && ['admin', 'editor'].includes(role)) updates.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/users/:id — remove user (admin only, cannot delete self)
exports.delete = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
