const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/products', (req, res) => {
  Product.getAll((err, products) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving products' });
      return;
    }
    res.json(products);
  });
});

router.get('/products/:id', (req, res) => {
  const id = req.params.id;
  Product.getById(id, (err, product) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving product' });
      return;
    }
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  });
});

module.exports = router;