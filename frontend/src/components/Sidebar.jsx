import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Lightbulb } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { id: 'lamps', label: 'Kelola Lampu', icon: Package },
    { id: 'orders', label: 'Kelola Pesanan', icon: ShoppingBag },
  ];

  return (
    <div className="w-64 min-h-screen glass-card rounded-none border-y-0 border-l-0 flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-800/50">
        <Lightbulb className="w-6 h-6 text-amber-400 drop-shadow-[var(--shadow-glow-amber)]" />
        <span className="font-bold text-lg tracking-wide text-zinc-100 uppercase">Admin Hub</span>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-zinc-800/50">
        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Logged in as</p>
        <p className="text-amber-400 font-medium">{user?.username}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 shadow-[var(--shadow-glow-amber)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-zinc-800/50">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
