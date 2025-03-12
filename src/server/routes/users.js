
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put(
  '/me',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional(),
    body('address').optional()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Build update object
      const updateFields = {};
      if (req.body.name) updateFields.name = req.body.name;
      if (req.body.phone) updateFields.phone = req.body.phone;
      if (req.body.address) updateFields.address = req.body.address;
      updateFields.updatedAt = Date.now();

      // Find and update user
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateFields },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all workers (for distributors only)
router.get('/workers', async (req, res) => {
  try {
    // Check if user is a distributor
    if (req.user.role !== 'distributor') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const workers = await User.find({ role: 'worker' }).select('-password');
    res.json(workers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
