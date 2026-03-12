import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';

const LampCard = ({ lamp, onBuy, isBuying }) => {
  return (
    <div className="group relative bg-zinc-800/40 border border-zinc-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[var(--shadow-glow-amber)]">
      
      {/* Image Container */}
      <div className="aspect-square bg-zinc-900/80 p-6 flex items-center justify-center relative overflow-hidden">
        {/* Glow backdrop behind lamp */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {lamp.image_url ? (
          <img 
            src={lamp.image_url} 
            alt={lamp.name} 
            className="w-full h-full object-contain relative z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-zinc-800 flex flex-col items-center justify-center relative z-10 ring-4 ring-zinc-800/50">
             <Zap className="w-10 h-10 text-amber-500/30" />
             <span className="text-xs text-zinc-500 mt-2 font-medium">No Image</span>
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-zinc-300 border border-white/5">
          {lamp.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-zinc-100 truncate pr-4">{lamp.name}</h3>
          <span className="text-xs font-medium text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded-md whitespace-nowrap">
            {lamp.wattage}W
          </span>
        </div>
        
        <p className="text-2xl font-bold text-amber-400 mb-6 drop-shadow-md">
           ${Number(lamp.price).toFixed(2)}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-medium text-zinc-500">
            Stock: <span className={lamp.stock > 0 ? "text-zinc-300" : "text-red-400"}>{lamp.stock}</span>
          </span>
          
          <button
            onClick={() => onBuy(lamp.id)}
            disabled={lamp.stock <= 0 || isBuying}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300
              ${lamp.stock > 0 
                ? 'bg-amber-500 text-amber-950 hover:bg-amber-400 hover:shadow-[var(--shadow-glow-amber)] active:scale-95' 
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'}
            `}
          >
            <ShoppingCart className="w-4 h-4" />
            {isBuying ? 'Membeli...' : lamp.stock > 0 ? 'Beli' : 'Habis'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LampCard;
