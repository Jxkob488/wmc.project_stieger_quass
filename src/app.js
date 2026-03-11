// Simple Express app serving the public directory
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Basic API placeholder
app.get('/api/hello', (req, res) => {
  res.json({message: 'Hello from backend'});
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
