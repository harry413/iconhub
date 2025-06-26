import express from "express"
const router = express.Router();
import  { authenticate, adminOnly } from '../middleware/auth.js';
import User from '../models/user.js';
import Icon from '../models/icon.js';


// Get all users
router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('username');
    res.json(users);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: err.message });
  }
});

// Get all icons
router.get('/icons', authenticate, adminOnly, async (req, res) => {
  try {
    const icons = await Icon.find().populate('createdBy', 'username');
    res.json(icons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete icon
router.delete('/icons/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const icon = await Icon.findByIdAndDelete(req.params.id);
    if (!icon) {
      return res.status(404).json({ message: 'Icon not found' });
    }
    res.json({ message: 'Icon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle user admin status
router.patch('/users/:id/toggle-admin', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isAdmin = !user.isAdmin;
    await user.save();
    
    res.json({ 
      message: `User admin status updated to ${user.isAdmin}`,
      user: { _id: user._id, username: user.username, isAdmin: user.isAdmin }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router