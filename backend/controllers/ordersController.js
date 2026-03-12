// controllers/ordersController.js
// Handles all order transactions.
//
// User:   createOrder, getOrders (own orders only)
// Admin:  getOrders (all orders), updateOrder, deleteOrder

const supabase = require('../config/supabase');

// ─── POST /api/orders (User) ──────────────────────────────────────────────────
// Creates an order and decrements the lamp's stock atomically via a transaction.
const createOrder = async (req, res) => {
  try {
    const { lamp_id, quantity } = req.body;
    const user_id = req.user.id; // From JWT via verifyToken

    if (!lamp_id || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'lamp_id and a valid quantity are required.' });
    }

    // 1. Fetch the lamp to check stock availability
    const { data: lamp, error: lampError } = await supabase
      .from('lamps')
      .select('id, stock, price')
      .eq('id', lamp_id)
      .single();

    if (lampError || !lamp) {
      return res.status(404).json({ error: 'Lamp not found.' });
    }

    if (lamp.stock < quantity) {
      return res.status(400).json({
        error: `Insufficient stock. Only ${lamp.stock} unit(s) available.`,
      });
    }

    // 2. Decrement stock on the lamp
    const { error: stockError } = await supabase
      .from('lamps')
      .update({ stock: lamp.stock - quantity })
      .eq('id', lamp_id);

    if (stockError) throw stockError;

    // 3. Create the order record with status 'pending'
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id, lamp_id, quantity, status: 'pending' }])
      .select()
      .single();

    if (orderError) {
      // If the order insert fails, roll back the stock decrement
      await supabase
        .from('lamps')
        .update({ stock: lamp.stock })
        .eq('id', lamp_id);
      throw orderError;
    }

    return res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (err) {
    console.error('[createOrder]', err);
    return res.status(500).json({ error: 'Failed to create order.' });
  }
};

// ─── GET /api/orders ──────────────────────────────────────────────────────────
// Admin  → returns ALL orders with user and lamp details
// User   → returns ONLY their own orders
const getOrders = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    let query = supabase
      .from('orders')
      .select(`
        id,
        quantity,
        status,
        created_at,
        users ( id, username ),
        lamps ( id, name, category, price, image_url )
      `)
      .order('created_at', { ascending: false });

    // Non-admin users only see their own orders
    if (role !== 'admin') {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    console.error('[getOrders]', err);
    return res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

// ─── PUT /api/orders/:id (Admin) ─────────────────────────────────────────────
// Update order status: 'pending' → 'paid' → 'shipped'
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'shipped'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}.`,
      });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Order not found.' });

    return res.status(200).json({ message: 'Order status updated.', order: data });
  } catch (err) {
    console.error('[updateOrder]', err);
    return res.status(500).json({ error: 'Failed to update order.' });
  }
};

// ─── DELETE /api/orders/:id (Admin) ──────────────────────────────────────────
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({ message: 'Order deleted successfully.' });
  } catch (err) {
    console.error('[deleteOrder]', err);
    return res.status(500).json({ error: 'Failed to delete order.' });
  }
};

module.exports = { createOrder, getOrders, updateOrder, deleteOrder };
