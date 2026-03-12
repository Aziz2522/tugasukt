// controllers/lampsController.js
// Handles all CRUD operations for the 'lamps' product table.
//
// Public:   getAllLamps
// Admin:    createLamp, updateLamp, deleteLamp

const supabase = require('../config/supabase');

// ─── GET /api/lamps (Public) ──────────────────────────────────────────────────
const getAllLamps = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lamps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    console.error('[getAllLamps]', err);
    return res.status(500).json({ error: 'Failed to fetch lamps.' });
  }
};

// ─── POST /api/lamps (Admin) ─────────────────────────────────────────────────
const createLamp = async (req, res) => {
  try {
    const { name, category, wattage, price, stock, image_url } = req.body;

    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'name, category, price, and stock are required.' });
    }

    const { data, error } = await supabase
      .from('lamps')
      .insert([{ name, category, wattage, price, stock, image_url }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ message: 'Lamp created successfully.', lamp: data });
  } catch (err) {
    console.error('[createLamp]', err);
    return res.status(500).json({ error: 'Failed to create lamp.' });
  }
};

// ─── PUT /api/lamps/:id (Admin) ───────────────────────────────────────────────
const updateLamp = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Only pass fields you want to change

    // Prevent accidentally changing the id
    delete updates.id;

    const { data, error } = await supabase
      .from('lamps')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Lamp not found.' });

    return res.status(200).json({ message: 'Lamp updated successfully.', lamp: data });
  } catch (err) {
    console.error('[updateLamp]', err);
    return res.status(500).json({ error: 'Failed to update lamp.' });
  }
};

// ─── DELETE /api/lamps/:id (Admin) ───────────────────────────────────────────
const deleteLamp = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('lamps')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({ message: 'Lamp deleted successfully.' });
  } catch (err) {
    console.error('[deleteLamp]', err);
    return res.status(500).json({ error: 'Failed to delete lamp.' });
  }
};

module.exports = { getAllLamps, createLamp, updateLamp, deleteLamp };
