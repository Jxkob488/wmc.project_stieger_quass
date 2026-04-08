const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const db = new sqlite3.Database(process.env.DB_FILE, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

const fs = require('fs');
const path = require('path');
const sqlFile = path.join(__dirname, '../../database/shop.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

function initializeDatabase() {
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='products'", (err, row) => {
    if (err) {
      console.error('Error checking database:', err.message);
      return;
    }

    if (!row) {
      db.exec(sql, (err) => {
        if (err) {
          console.error('Error executing SQL:', err.message);
        } else {
          console.log('Database initialized');
        }
      });
      return;
    }

    db.get('SELECT COUNT(*) AS count FROM products', (err, result) => {
      if (err) {
        console.error('Error checking product count:', err.message);
        return;
      }
      if (result.count === 0) {
        db.exec(sql, (err) => {
          if (err) {
            console.error('Error executing SQL:', err.message);
          } else {
            console.log('Database initialized');
          }
        });
      } else {
        db.run("UPDATE products SET image = '/images/watch.jpg' WHERE name = 'Watch'", (err) => {
          if (err) {
            console.error('Error updating Watch image path:', err.message);
          } else {
            console.log('Watch image path updated in existing database');
          }
        });
        console.log('Database already initialized, SQL execution skipped');
      }
    });
  });
}

db.serialize(initializeDatabase);

module.exports = db;