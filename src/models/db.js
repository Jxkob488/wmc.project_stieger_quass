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

db.exec(sql, (err) => {
  if (err) {
    console.error('Fehler beim Ausführen der SQL:', err.message);
  } else {
    console.log('Datenbank initialisiert');
  }
});

module.exports = db;