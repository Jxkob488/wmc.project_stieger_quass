const db = require('./db');

class Product {
  static getAll(callback) {
    db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  }

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