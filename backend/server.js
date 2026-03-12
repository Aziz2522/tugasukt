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

// ─── Global Middleware ────────────────────────────────────────────────────────

// Allow cross-origin requests from the frontend
app.use(cors());

// Parse incoming JSON request bodies
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
