
const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// Create a new order (customer only)
router.post(
  '/',
  [
    body('distributorId').notEmpty().withMessage('Distributor ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('scheduledDelivery').isISO8601().withMessage('Valid delivery date is required')
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user is a customer
      if (req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Only customers can create orders' });
      }

      // Verify distributor exists
      const distributor = await User.findOne({ 
        _id: req.body.distributorId,
        role: 'distributor'
      });
      
      if (!distributor) {
        return res.status(404).json({ message: 'Distributor not found' });
      }

      // Create new order
      const order = new Order({
        customerId: req.user.id,
        distributorId: req.body.distributorId,
        quantity: req.body.quantity,
        scheduledDelivery: new Date(req.body.scheduledDelivery)
      });

      await order.save();

      // Populate customer and distributor info
      const populatedOrder = await Order.findById(order._id)
        .populate('customerId', 'name email phone address')
        .populate('distributorId', 'name email phone');

      res.status(201).json(populatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all orders for current user based on role
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // Filter orders based on user role
    if (req.user.role === 'customer') {
      query.customerId = req.user.id;
    } else if (req.user.role === 'distributor') {
      query.distributorId = req.user.id;
    } else if (req.user.role === 'worker') {
      query.workerId = req.user.id;
    }
    
    const orders = await Order.find(query)
      .populate('customerId', 'name email phone address')
      .populate('distributorId', 'name')
      .populate('workerId', 'name')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone address')
      .populate('distributorId', 'name email phone')
      .populate('workerId', 'name phone');
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify user has permission to access this order
    if (
      req.user.role === 'customer' && order.customerId._id.toString() !== req.user.id ||
      req.user.role === 'distributor' && order.distributorId._id.toString() !== req.user.id ||
      req.user.role === 'worker' && (!order.workerId || order.workerId._id.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (distributors can assign workers, workers can update delivery status)
router.put(
  '/:id/status',
  [
    body('status').isIn(['pending', 'confirmed', 'in-transit', 'delivered', 'cancelled'])
      .withMessage('Invalid status'),
    body('workerId').optional()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Verify user has permission to update this order
      if (
        (req.user.role === 'distributor' && order.distributorId.toString() !== req.user.id) ||
        (req.user.role === 'worker' && (!order.workerId || order.workerId.toString() !== req.user.id))
      ) {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }
      
      // Different update logic based on role
      if (req.user.role === 'distributor') {
        // Distributors can assign workers and confirm orders
        if (req.body.status === 'confirmed' && req.body.workerId) {
          // Verify worker exists
          const worker = await User.findOne({ 
            _id: req.body.workerId,
            role: 'worker'
          });
          
          if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
          }
          
          order.workerId = req.body.workerId;
        }
        
        if (['pending', 'confirmed', 'cancelled'].includes(req.body.status)) {
          order.status = req.body.status;
        } else {
          return res.status(400).json({ 
            message: 'Distributors can only set status to pending, confirmed, or cancelled' 
          });
        }
      } else if (req.user.role === 'worker') {
        // Workers can update delivery status
        if (['confirmed', 'in-transit', 'delivered'].includes(req.body.status)) {
          order.status = req.body.status;
          
          // Add delivery date if status is delivered
          if (req.body.status === 'delivered') {
            order.deliveredAt = new Date();
          }
        } else {
          return res.status(400).json({ 
            message: 'Workers can only set status to confirmed, in-transit, or delivered' 
          });
        }
      }
      
      await order.save();
      
      // Return updated order with populated fields
      const updatedOrder = await Order.findById(order._id)
        .populate('customerId', 'name email phone address')
        .populate('distributorId', 'name')
        .populate('workerId', 'name');
        
      res.json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
