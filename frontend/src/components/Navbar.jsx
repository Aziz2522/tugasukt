import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Lightbulb } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-400 drop-shadow-[var(--shadow-glow-amber)]" />
            <span className="font-bold text-xl tracking-wide text-zinc-100 uppercase">
              Lumina<span className="text-amber-500">Store</span>
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <span className="text-sm text-zinc-400 hidden sm:block">
              Welcome, <span className="text-amber-400 font-medium">{user?.username}</span>
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
