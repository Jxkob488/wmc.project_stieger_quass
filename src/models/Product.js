const db = require('./db');

class Product {
  // Holt alle Produkte aus der Tabelle products
  static getAll(callback) {
    db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  }

  // Holt ein einzelnes Produkt durch die eindeutige ID
  static getById(id, callback) {
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, row);
    });
  }
}

module.exports = Product;