// routes/lampsRoutes.js
// Lamp product routes.
//
// GET /api/lamps              → Public
// POST /api/lamps             → Admin only
// PUT /api/lamps/:id          → Admin only
// DELETE /api/lamps/:id       → Admin only

const express = require('express');
const router = express.Router();
const { getAllLamps, createLamp, updateLamp, deleteLamp } = require('../controllers/lampsController');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// Public route — anyone can view all lamps
router.get('/', getAllLamps);

// Admin-only routes — must be authenticated AND have role 'admin'
router.post('/', verifyToken, isAdmin, createLamp);
router.put('/:id', verifyToken, isAdmin, updateLamp);
router.delete('/:id', verifyToken, isAdmin, deleteLamp);

module.exports = router;
