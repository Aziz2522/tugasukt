// routes/authRoutes.js
// Maps authentication endpoints to their controller functions.

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register — Creates a new user account
router.post('/register', register);

// POST /api/auth/login — Returns a JWT token on success
router.post('/login', login);

module.exports = router;
