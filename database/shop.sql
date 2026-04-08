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
('Basic T-Shirt', 19.99, 'clothing', '/images/tshirt.png', 'A comfortable basic t-shirt', 1),
('Hoodie', 49.99, 'clothing', '/images/hoodie.png', 'Warm hoodie for cold days', 1),
('Sneaker', 79.99, 'shoes', '/images/sneaker.png', 'Stylish sneakers', 1),
('Cap', 14.99, 'accessories', '/images/cap.png', 'Cool cap', 1),
('Backpack', 39.99, 'bags', '/images/backpack.png', 'Practical backpack', 1),
('Watch', 99.99, 'accessories', '/images/watch.jpg', 'Elegant watch', 1);


CREATE TABLE IF NOT EXISTS customers (
  id INT AUTOINCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  address TEXT,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);