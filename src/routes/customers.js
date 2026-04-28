const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// POST /api/customers
// Erstellt einen neuen Kunden in der Datenbank
router.post('/customers', (req, res) => {
  const { name, email, address, phone } = req.body;

  // Pflichtfelder prüfen
  if (!name || !email) {
    return res.status(400).json({ error: 'Name und E-Mail sind erforderlich' });
  }

  // Prüfen, ob die E-Mail bereits in der DB existiert
  Customer.getByEmail(email, (err, existingCustomer) => {
    if (err) {
      return res.status(500).json({ error: 'Datenbankfehler' });
    }

    if (existingCustomer) {
      return res.status(400).json({ error: 'Diese E-Mail existiert bereits' });
    }

    // Neuen Kunden in der Tabelle customers speichern
    Customer.create(name, email, address, phone, (err, customer) => {
      if (err) {
        return res.status(500).json({ error: 'Fehler beim Erstellen des Kunden' });
      }
      res.status(201).json({ success: true, customer });
    });
  });
});

// GET /api/customers
// Abrufen aller Kunden (z. B. für Admin-Ansicht)
router.get('/customers', (req, res) => {
  Customer.getAll((err, customers) => {
    if (err) {
      return res.status(500).json({ error: 'Fehler beim Abrufen der Kunden' });
    }
    res.json(customers);
  });
});

// GET /api/customers/:id
// Liefert einen Kunden basierend auf der ID zurück
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
