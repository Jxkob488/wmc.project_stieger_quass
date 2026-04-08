const db = require('./db');

class Customer {
  static create(name, email, address, phone, callback) {
    const query = 'INSERT INTO customers (name, email, address, phone) VALUES (?, ?, ?, ?)';
    db.run(query, [name, email, address, phone], function(err) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id: this.lastID, name, email, address, phone });
    });
  }

  static getAll(callback) {
    db.all('SELECT * FROM customers', [], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  }

  static getById(id, callback) {
    db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, row);
    });
  }

  static getByEmail(email, callback) {
    db.get('SELECT * FROM customers WHERE email = ?', [email], (err, row) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, row);
    });
  }
}

module.exports = Customer;
