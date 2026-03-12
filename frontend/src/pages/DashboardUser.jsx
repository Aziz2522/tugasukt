import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LampCard from '../components/LampCard';
import { PackageOpen, Clock, CheckCircle2, Truck } from 'lucide-react';

const DashboardUser = () => {
  const [lamps, setLamps] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lampsRes, ordersRes] = await Promise.all([
        api.get('/lamps'),
        api.get('/orders')
      ]);
      setLamps(lampsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to fetch user data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (lampId) => {
    try {
      setBuyingId(lampId);
      await api.post('/orders', { lamp_id: lampId, quantity: 1 });
      // Refresh to get updated stock and new order
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to place order.');
    } finally {
      setBuyingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'paid': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-zinc-500" />;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* === Store Section === */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Koleksi Lampu</h2>
            <div className="h-px bg-gradient-to-r from-amber-500/50 to-transparent flex-1 ml-4" />
          </div>

          {lamps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lamps.map(lamp => (
                <LampCard 
                  key={lamp.id} 
                  lamp={lamp} 
                  onBuy={handleBuy} 
                  isBuying={buyingId === lamp.id} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
              <PackageOpen className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-xl font-medium text-zinc-500">Belum ada lampu tersedia.</p>
            </div>
          )}
        </section>


        {/* === Order History Section === */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Pesanan Saya</h2>
            <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent flex-1 ml-4" />
          </div>

          <div className="glass-card overflow-hidden">
            {orders.length > 0 ? (
              <div className="divide-y divide-zinc-800/50">
                {orders.map(order => (
                  <div key={order.id} className="p-6 flex flex-col sm:flex-row gap-6 items-center hover:bg-zinc-800/30 transition-colors">
                    
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-700/50 shrink-0">
                      {order.lamps?.image_url ? (
                        <img src={order.lamps.image_url} alt="lamp" className="w-16 h-16 object-contain" />
                      ) : (
                        <PackageOpen className="w-8 h-8 text-zinc-600" />
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 w-full text-center sm:text-left">
                      <h4 className="font-bold text-lg text-zinc-100">{order.lamps?.name}</h4>
                      <p className="text-sm text-zinc-400 mt-1">
                        {order.quantity} x <span className="text-amber-400/90">${Number(order.lamps?.price).toFixed(2)}</span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-2">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Order Status Badge */}
                    <div className="shrink-0 flex flex-col items-center sm:items-end gap-2">
                      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 rounded-full border border-zinc-700 shadow-sm">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-semibold capitalize text-zinc-300">
                          {order.status}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-amber-500">
                        ${(Number(order.lamps?.price) * order.quantity).toFixed(2)}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
               <div className="text-center py-16">
                 <p className="text-zinc-500 font-medium">Belum ada pesanan.</p>
               </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default DashboardUser;
