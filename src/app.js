const express = require("express");
const path = require("path");

const app = express();

// Middleware: erlaubt das Lesen von JSON-Body und URL-codierten Formularfeldern
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API-Routen importieren
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');

// Alle Routen aus products.js und customers.js werden unter /api registriert
app.use('/api', productRoutes);
app.use('/api', customerRoutes);

// Root-Route: liefert die Haupt-Shop-Seite aus dem Public-Ordner
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/shop.html"));
});

// Statische Dateien (CSS, JS, Bilder, HTML) ausliefern
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../pages")));

// Server starten auf Port 3000
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});