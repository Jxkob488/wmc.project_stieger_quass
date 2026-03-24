const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products
router.get('/products', (req, res) => {
  Product.getAll((err, products) => {
    if (err) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Produkte' });
      return;
    }
    res.json(products);
  });
});

// GET /api/products/:id
router.get('/products/:id', (req, res) => {
  const id = req.params.id;
  Product.getById(id, (err, product) => {
    if (err) {
      res.status(500).json({ error: 'Fehler beim Abrufen des Produkts' });
      return;
    }
    if (!product) {
      res.status(404).json({ error: 'Produkt nicht gefunden' });
      return;
    }
    res.json(product);
  });
});

module.exports = router;