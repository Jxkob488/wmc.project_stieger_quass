CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT,
  image TEXT,
  description TEXT,
  inStock INTEGER DEFAULT 1
);

INSERT INTO products (name, price, category, image, description, inStock) VALUES
('Basic T-Shirt', 19.99, 'clothing', '/images/tshirt.png', 'Ein bequemes Basic T-Shirt', 1),
('Hoodie', 49.99, 'clothing', '/images/hoodie.png', 'Warmer Hoodie für kalte Tage', 1),
('Sneaker', 79.99, 'shoes', '/images/sneaker.png', 'Stylische Sneaker', 1),
('Cap', 14.99, 'accessories', '/images/cap.png', 'Coole Cap', 1),
('Backpack', 39.99, 'bags', '/images/backpack.png', 'Praktischer Rucksack', 1),
('Watch', 99.99, 'accessories', '/images/watch.png', 'Elegante Uhr', 1);
('Hallo', 19.99, 'test', '/images/test.png', 'dasIstEineTest', 1);
