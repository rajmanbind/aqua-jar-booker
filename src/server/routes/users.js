
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/me', async (req, res) => {
  const { name, email, phone, address } = req.body;
  const updateFields = {};
  
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (phone) updateFields.phone = phone;
  if (address) updateFields.address = address;

  try {
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes (restricted to distributor role)
// Get all users
router.get('/', async (req, res) => {
  try {
    // Check if user is a distributor
    if (req.user.role !== 'distributor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
