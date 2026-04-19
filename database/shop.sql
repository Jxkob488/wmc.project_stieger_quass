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
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  address TEXT,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO customers (name, email, address, phone) VALUES
('John Doe', 'john@example.com', '123 Main St', '123-456-7890'),
('Jane Smith', 'jane@example.com', '456 Elm St', '098-765-4321');

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

INSERT INTO orders (customer_id, total, status) VALUES
(1, 69.98, 'completed'),
(2, 99.99, 'pending');

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 19.99),
(1, 4, 1, 14.99),
(2, 6, 1, 99.99);