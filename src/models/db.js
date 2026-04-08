const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const dbFile = process.env.DB_FILE || require('path').join(__dirname, '../../database/shop.db');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbFile);
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
        db.serialize(() => {
          // Synchronize all product descriptions from SQL file
          const updates = [
            { name: 'Basic T-Shirt', description: 'A comfortable basic t-shirt' },
            { name: 'Hoodie', description: 'Warm hoodie for cold days' },
            { name: 'Sneaker', description: 'Stylish sneakers' },
            { name: 'Cap', description: 'Cool cap' },
            { name: 'Backpack', description: 'Practical backpack' },
            { name: 'Watch', description: 'Elegant watch' }
          ];

          updates.forEach(product => {
            db.run(
              'UPDATE products SET description = ? WHERE name = ?',
              [product.description, product.name],
              (err) => {
                if (err) {
                  console.error(`Error updating ${product.name} description:`, err.message);
                } else {
                  console.log(`✓ ${product.name} description synchronized`);
                }
              }
            );
          });

          db.run("UPDATE products SET image = '/images/watch.jpg' WHERE name = 'Watch'", (err) => {
            if (err) {
              console.error('Error updating Watch image path:', err.message);
            }
          });
        });
        console.log('Database synchronized with SQL definitions');
      }
    });
  });
}

db.serialize(initializeDatabase);

module.exports = db;