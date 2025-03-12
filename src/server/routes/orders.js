
import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get all orders (filtering based on user role)
router.get('/', async (req, res) => {
  try {
    let orders;
    
    // Filter orders based on user role
    if (req.user.role === 'customer') {
      // Customers can only see their own orders
      orders = await Order.find({ user: req.user.id })
        .populate('user', 'name email')
        .populate('products.product', 'name price image');
    } else {
      // Distributors and workers can see all orders
      orders = await Order.find()
        .populate('user', 'name email phone address')
        .populate('products.product', 'name price image');
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('products.product', 'name price image');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (req.user.role === 'customer' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const { products, deliveryAddress, paymentMethod } = req.body;

  // Validate required fields
  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: 'Products are required' });
  }
  
  if (!deliveryAddress) {
    return res.status(400).json({ message: 'Delivery address is required' });
  }
  
  if (!paymentMethod) {
    return res.status(400).json({ message: 'Payment method is required' });
  }

  try {
    // Calculate total and verify products
    let totalAmount = 0;
    const orderProducts = [];
    
    for (const item of products) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found` });
      }
      
      if (!product.inStock) {
        return res.status(400).json({ message: `${product.name} is out of stock` });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderProducts.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    // Create new order
    const newOrder = new Order({
      user: req.user.id,
      products: orderProducts,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'completed'
    });
    
    const order = await newOrder.save();
    
    // Populate the response
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('products.product', 'name price image');
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (workers and distributors only)
router.put('/:id/status', async (req, res) => {
  // Check if user is authorized
  if (req.user.role === 'customer') {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  const { status } = req.body;
  
  // Validate status
  if (!['pending', 'processing', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    
    // If order is delivered, set delivery date
    if (status === 'delivered') {
      order.deliveryDate = new Date();
    }
    
    await order.save();
    
    const updatedOrder = await Order.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('products.product', 'name price image');
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel an order (customer can only cancel their own orders)
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only allow customers to cancel their own orders
    if (req.user.role === 'customer' && order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Only pending orders can be cancelled
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    const updatedOrder = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'name price image');
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error cancelling order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
