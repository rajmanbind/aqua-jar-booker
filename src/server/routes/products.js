
import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new product (distributor only)
router.post('/', async (req, res) => {
  // Check if user is a distributor
  if (req.user && req.user.role !== 'distributor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { name, description, price, image, category, inStock } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      image: image || '/placeholder.svg',
      category,
      inStock: inStock !== undefined ? inStock : true,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a product (distributor only)
router.put('/:id', async (req, res) => {
  // Check if user is a distributor
  if (req.user && req.user.role !== 'distributor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { name, description, price, image, category, inStock } = req.body;
  const updateFields = {};
  
  if (name) updateFields.name = name;
  if (description) updateFields.description = description;
  if (price) updateFields.price = price;
  if (image) updateFields.image = image;
  if (category) updateFields.category = category;
  if (inStock !== undefined) updateFields.inStock = inStock;

  try {
    let product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a product (distributor only)
router.delete('/:id', async (req, res) => {
  // Check if user is a distributor
  if (req.user && req.user.role !== 'distributor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
