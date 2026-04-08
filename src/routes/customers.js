const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// POST - Neuen Kunden erstellen
router.post('/customers', (req, res) => {
  const { name, email, address, phone } = req.body;

  // Validierung
  if (!name || !email) {
    return res.status(400).json({ error: 'Name und E-Mail sind erforderlich' });
  }

  // Prüfen ob E-Mail bereits existiert
  Customer.getByEmail(email, (err, existingCustomer) => {
    if (err) {
      return res.status(500).json({ error: 'Datenbankfehler' });
    }

    if (existingCustomer) {
      return res.status(400).json({ error: 'Diese E-Mail existiert bereits' });
    }

    // Neuen Kunden erstellen
    Customer.create(name, email, address, phone, (err, customer) => {
      if (err) {
        return res.status(500).json({ error: 'Fehler beim Erstellen des Kunden' });
      }
      res.status(201).json({ success: true, customer });
    });
  });
});

// GET - Alle Kunden abrufen (nur für Admin)
router.get('/customers', (req, res) => {
  Customer.getAll((err, customers) => {
    if (err) {
      return res.status(500).json({ error: 'Fehler beim Abrufen der Kunden' });
    }
    res.json(customers);
  });
});

// GET - Spezifischen Kunden abrufen
router.get('/customers/:id', (req, res) => {
  const id = req.params.id;
  Customer.getById(id, (err, customer) => {
    if (err) {
      return res.status(500).json({ error: 'Fehler beim Abrufen des Kunden' });
    }
    if (!customer) {
      return res.status(404).json({ error: 'Kunde nicht gefunden' });
    }
    res.json(customer);
  });
});

module.exports = router;
