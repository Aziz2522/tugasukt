// routes/ordersRoutes.js
// Order routes — all routes require authentication.
//
// POST /api/orders            → Any logged-in user (creates their own order)
// GET /api/orders             → User sees own; Admin sees all
// PUT /api/orders/:id         → Admin only (update status)
// DELETE /api/orders/:id      → Admin only

const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrder, deleteOrder } = require('../controllers/ordersController');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// All order routes require a valid JWT
router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);       // role-based logic is inside the controller

// Admin-only order management
router.put('/:id', verifyToken, isAdmin, updateOrder);
router.delete('/:id', verifyToken, isAdmin, deleteOrder);

module.exports = router;
