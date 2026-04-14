## Frontend

## Backend

- The backend runs with **Node.js**. That is JavaScript, but not in the browser—it runs on the computer/server.
- We use **Express** as the web server. This means when the browser requests a page or data, Express answers that request.
- The server starts in `src/app.js`:
  - `app.use(express.json())` lets the server read JSON data.
  - `app.use(express.urlencoded({ extended: true }))` lets the server read form data.
  - `app.get('/', ...)` says: when someone opens `http://localhost:3000`, send them the `shop.html` file.
  - `app.use(express.static(...))` makes files from the `public` folder available to the browser.
- The API endpoints are under `/api`. For example, product and customer data come from `src/routes/products.js` and `src/routes/customers.js`.
- `npm start` starts the server. Then the site is available at `http://localhost:3000`.

## Database