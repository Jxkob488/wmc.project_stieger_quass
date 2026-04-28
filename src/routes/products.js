const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products
// Liefert alle Produkte aus der Datenbank zurück
router.get('/products', (req, res) => {
  Product.getAll((err, products) => {
    if (err) {
      // Bei einem Datenbankfehler senden wir 500 zurück
      res.status(500).json({ error: 'Error retrieving products' });
      return;
    }
    res.json(products);
  });
});

// GET /api/products/:id
// Liefert ein einzelnes Produkt anhand der ID zurück
router.get('/products/:id', (req, res) => {
  const id = req.params.id;
  Product.getById(id, (err, product) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving product' });
      return;
    }
    if (!product) {
      // Wenn kein Produkt gefunden wurde, 404 senden
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  });
});

module.exports = router; 