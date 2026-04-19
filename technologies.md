## Frontend

## Backend

The backend is the server-side part of the application that handles logic, data processing, and communication with the database. It runs on the server and is not directly visible to the user.

- **Node.js**: This is a JavaScript runtime environment that allows JavaScript to run outside the browser. Node.js is used to run the server and write server-side scripts.

- **Express.js**: Express is a minimalist web framework for Node.js that simplifies building web servers and APIs. It provides features like routing (e.g., `app.get('/')` for the homepage), middleware for request processing, and static files. In this project, the server starts in `src/app.js`, where Express is used to define routes, parse JSON data, and serve static resources from the `public` folder. Express allows creating API endpoints under `/api`, e.g., for products and customers in `src/routes/products.js` and `src/routes/customers.js`.

The server is started with `npm start` and is then available at `http://localhost:3000`. Express processes requests from the frontend and returns data, often in JSON format.

## Database