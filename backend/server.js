// server.js
// Main entry point for the Lamp Store backend API.
// Initializes Express, mounts all route modules, and starts the server.

require('dotenv').config(); // Load .env variables first

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const lampsRoutes = require('./routes/lampsRoutes');
const ordersRoutes = require('./routes/ordersRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CORS Middleware (must come BEFORE all routes) ────────────────────────────
// Manually set CORS headers on EVERY response and immediately end OPTIONS (preflight) with 200
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

  // Intercept the preflight OPTIONS request and return 200 immediately
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Parse incoming JSON request bodies (CRITICAL for req.body to work)
app.use(express.json());


// ─── API Routes ───────────────────────────────────────────────────────────────

// Health-check endpoint
app.get('/', (req, res) => {
  res.json({ message: '✅ Lamp Store API is running.' });
});

// Authentication: /api/auth/register, /api/auth/login
app.use('/api/auth', authRoutes);

// Lamp products: /api/lamps (CRUD)
app.use('/api/lamps', lampsRoutes);

// Orders: /api/orders (CRUD)
app.use('/api/orders', ordersRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// ─── Start Server (Locally) / Export (Vercel) ─────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Lamp Store API running on http://localhost:${PORT}`);
  });
}

// Export the Express API so Vercel can handle it as a serverless function
module.exports = app;
