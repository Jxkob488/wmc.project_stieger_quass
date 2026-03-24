const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const productRoutes = require('./routes/products');
app.use('/api', productRoutes);

// Static Files
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../pages")));

// Server starten
app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});