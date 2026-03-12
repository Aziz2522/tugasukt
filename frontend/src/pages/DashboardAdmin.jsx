import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { Plus, Trash2, Edit, Save } from 'lucide-react';

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState('lamps'); // 'lamps' or 'orders'
  const [lamps, setLamps] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Lamp form state
  const [lampForm, setLampForm] = useState({ name: '', category: '', wattage: '', price: '', stock: '', image_url: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lRes, oRes] = await Promise.all([api.get('/lamps'), api.get('/orders')]);
      setLamps(lRes.data);
      setOrders(oRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Lamp Handlers ---
  const handleOpenAddForm = () => {
    setLampForm({ name: '', category: '', wattage: '', price: '', stock: '', image_url: '' });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (lamp) => {
    setLampForm({
      name: lamp.name,
      category: lamp.category,
      wattage: lamp.wattage || '',
      price: lamp.price,
      stock: lamp.stock,
      image_url: lamp.image_url || ''
    });
    setEditingId(lamp.id);
    setIsFormOpen(true);
  };

  const handleSubmitLamp = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/lamps/${editingId}`, lampForm);
      } else {
        await api.post('/lamps', lampForm);
      }
      setIsFormOpen(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || `Failed to ${editingId ? 'update' : 'add'} lamp`);
    }
  };

  const handleDeleteLamp = async (id) => {
    if(!confirm('Hapus lampu ini?')) return;
    try {
      await api.delete(`/lamps/${id}`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  // --- Order Handlers ---
  const handleUpdateOrderStatus = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-8 overflow-auto">
        
        {activeTab === 'lamps' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Kelola Lampu</h1>
                <p className="text-sm text-zinc-400 mt-1">Manage database products.</p>
              </div>
              <button 
                onClick={() => {
                  if (isFormOpen) {
                    setIsFormOpen(false);
                    setEditingId(null);
                  } else {
                    handleOpenAddForm();
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 font-bold rounded-xl transition-all ${
                  isFormOpen 
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                    : 'bg-amber-500 text-amber-950 hover:bg-amber-400 hover:shadow-[var(--shadow-glow-amber)]'
                }`}
              >
                {isFormOpen ? 'Batal' : <><Plus className="w-5 h-5"/> Tambah</>}
              </button>
            </div>

            {/* Add / Edit Form */}
            {isFormOpen && (
              <form onSubmit={handleSubmitLamp} className="glass-card p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-amber-500/20 shadow-[var(--shadow-glow-amber)]">
                <input required type="text" placeholder="Name" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={lampForm.name} onChange={e => setLampForm({...lampForm, name: e.target.value})} />
                <input required type="text" placeholder="Category" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={lampForm.category} onChange={e => setLampForm({...lampForm, category: e.target.value})} />
                <input type="number" placeholder="Wattage (W)" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={lampForm.wattage} onChange={e => setLampForm({...lampForm, wattage: e.target.value})} />
                <input required type="number" step="0.01" placeholder="Price ($)" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={lampForm.price} onChange={e => setLampForm({...lampForm, price: e.target.value})} />
                <input required type="number" placeholder="Stock" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={lampForm.stock} onChange={e => setLampForm({...lampForm, stock: e.target.value})} />
                <input type="text" placeholder="Image URL (optional)" className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" value={lampForm.image_url} onChange={e => setLampForm({...lampForm, image_url: e.target.value})} />
                
                <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                  <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-amber-950 font-bold rounded-lg hover:bg-amber-400 transition-colors">
                    <Save className="w-4 h-4"/> {editingId ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            )}

            {/* Lamps Table */}
            <div className="glass-card overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/80 border-b border-zinc-700/50">
                    <th className="p-4 text-zinc-400 font-semibold text-sm">Image</th>
                    <th className="p-4 text-zinc-400 font-semibold text-sm">Name</th>
                    <th className="p-4 text-zinc-400 font-semibold text-sm">Price</th>
                    <th className="p-4 text-zinc-400 font-semibold text-sm">Stock</th>
                    <th className="p-4 text-zinc-400 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {lamps.map(l => (
                    <tr key={l.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 bg-zinc-900 rounded border border-zinc-700 flex items-center justify-center p-1">
                          {l.image_url ? <img src={l.image_url} alt="" className="max-h-full max-w-full rounded"/> : '-'}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-zinc-200">{l.name}</td>
                      <td className="p-4 text-amber-400 font-bold">${Number(l.price).toFixed(2)}</td>
                      <td className="p-4 text-zinc-300">{l.stock}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleOpenEditForm(l)} className="text-amber-400 hover:text-amber-300 p-2 hover:bg-amber-500/10 rounded-lg transition-colors">
                            <Edit className="w-5 h-5"/>
                          </button>
                          <button onClick={() => handleDeleteLamp(l.id)} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5"/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- Orders View --- */}
        {activeTab === 'orders' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
              <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Kelola Pesanan</h1>
            </div>

            <div className="glass-card overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/80 border-b border-zinc-700/50">
                    <th className="p-4 text-zinc-400 font-semibold text-sm">Order ID</th>
                    <th className="p-4 text-zinc-400 font-semibold text-sm">User</th>
                    <th className="p-4 text-zinc-400 font-semibold text-sm">Product</th>
                    <th className="p-4 text-zinc-400 font-semibold text-sm">Date</th>
                    <th className="p-4 text-zinc-400 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 text-xs font-mono text-zinc-500">{o.id.split('-')[0]}...</td>
                      <td className="p-4 text-sm font-medium text-zinc-300">
                        {o.users?.username || 'Unknown'}
                      </td>
                      <td className="p-4 text-sm text-zinc-300">
                        {o.quantity}x {o.lamps?.name}
                      </td>
                      <td className="p-4 text-xs text-zinc-500">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <select 
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className={`text-sm font-semibold p-2 rounded-lg border focus:outline-none focus:ring-1 
                            ${o.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 focus:ring-amber-500' : 
                              o.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 focus:ring-emerald-500' : 
                              'bg-blue-500/10 text-blue-500 border-blue-500/30 focus:ring-blue-500'}`}
                        >
                          <option value="pending" className="bg-zinc-900 text-amber-500">Pending</option>
                          <option value="paid" className="bg-zinc-900 text-emerald-500">Paid</option>
                          <option value="shipped" className="bg-zinc-900 text-blue-500">Shipped</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardAdmin;
