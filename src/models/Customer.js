const db = require('./db');

class Customer {
  // Erstellt einen neuen Kunden in der Tabelle customers
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

  // Holt alle Kunden aus der Tabelle customers
  static getAll(callback) {
    db.all('SELECT * FROM customers', [], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  }

  // Holt einen Kunden anhand der ID
  static getById(id, callback) {
    db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, row);
    });
  }

  // Prüft, ob eine E-Mail bereits vorhanden ist
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