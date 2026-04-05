const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const db = new sqlite3.Database(process.env.DB_FILE, (err) => {
  if (err) {
    console.error('Fehler bei der Datenbankverbindung:', err.message);
  } else {
    console.log('Verbunden mit SQLite Datenbank');
  }
});

const fs = require('fs');
const path = require('path');
const sqlFile = path.join(__dirname, '../../database/shop.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

function initializeDatabase() {
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='products'", (err, row) => {
    if (err) {
      console.error('Fehler beim Überprüfen der Datenbank:', err.message);
      return;
    }

    if (!row) {
      db.exec(sql, (err) => {
        if (err) {
          console.error('Fehler beim Ausführen der SQL:', err.message);
        } else {
          console.log('Datenbank initialisiert');
        }
      });
      return;
    }

    db.get('SELECT COUNT(*) AS count FROM products', (err, result) => {
      if (err) {
        console.error('Fehler beim Überprüfen der Produktanzahl:', err.message);
        return;
      }
      if (result.count === 0) {
        db.exec(sql, (err) => {
          if (err) {
            console.error('Fehler beim Ausführen der SQL:', err.message);
          } else {
            console.log('Datenbank initialisiert');
          }
        });
      } else {
        console.log('Datenbank bereits initialisiert, SQL-Ausführung übersprungen');
      }
    });
  });
}

db.serialize(initializeDatabase);

module.exports = db;