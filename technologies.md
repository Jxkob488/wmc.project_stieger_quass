## Frontend

## Backend

The backend is the server-side part of the application that handles logic, data processing, and communication with the database. It runs on the server and is not directly visible to the user.

- **Node.js**: This is a JavaScript runtime environment that allows JavaScript to run outside the browser. Node.js is used to run the server and write server-side scripts.

- **Express.js**: Express is a minimalist web framework for Node.js that simplifies building web servers and APIs. It provides features like routing (e.g., `app.get('/')` for the homepage), middleware for request processing, and static files. In this project, the server starts in `src/app.js`, where Express is used to define routes, parse JSON data, and serve static resources from the `public` folder. Express allows creating API endpoints under `/api`, e.g., for products and customers in `src/routes/products.js` and `src/routes/customers.js`.

The server is started with `npm start` and is then available at `http://localhost:3000`. Express processes requests from the frontend and returns data, often in JSON format.

### Backend File Overview

- **`src/app.js`**: Main server file. It creates the Express app, enables JSON and form data handling, connects the API routes, serves static frontend files, and starts the server on port `3000`.

- **`src/routes/products.js`**: Contains the product API routes. It provides endpoints to get all products and to get one product by its ID.

- **`src/routes/customers.js`**: Contains the customer API routes. It allows creating a new customer, getting all customers, and getting one customer by ID.

- **`src/models/db.js`**: Connects the backend to the SQLite database. It also initializes the database with `shop.sql` if the needed tables or product data are missing.

- **`src/models/Product.js`**: Contains database functions for products, for example loading all products or loading one product by ID.

- **`src/models/Customer.js`**: Contains database functions for customers, for example creating a customer, loading customers, and checking if an email already exists.

- **`database/shop.sql`**: Defines the database structure and inserts example data for products, customers, orders, and order items.

- **`database/shop.db`**: The SQLite database file where the application data is stored.

## Database
