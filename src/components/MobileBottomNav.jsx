import React from 'react';
import { Home, Grid, Sparkles, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function MobileBottomNav({ activePage, onNavigate }) {
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-rose-100 dark:border-slate-800 py-1.5 px-3 flex items-center justify-around shadow-lg">
      
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
          activePage === 'home' ? 'text-rose-600 font-bold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => onNavigate('shop')}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
          activePage === 'shop' ? 'text-rose-600 font-bold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px]">Shop</span>
      </button>

      {/* Central Highlight Button for Customize */}
      <button
        onClick={() => onNavigate('customized')}
        className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-rose-600 to-amber-500 text-white p-3 rounded-full shadow-lg shadow-rose-500/30 active:scale-95 transition-transform"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="sr-only">Customize</span>
      </button>

      <button
        onClick={() => onNavigate('wishlist')}
        className={`relative flex flex-col items-center gap-0.5 p-1 transition-colors ${
          activePage === 'wishlist' ? 'text-rose-600 font-bold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Heart className="w-5 h-5" />
        <span className="text-[10px]">Saved</span>
        {wishlist.length > 0 && (
          <span className="absolute top-0 right-2 bg-rose-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-0.5 p-1 text-slate-500 dark:text-slate-400"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px]">Cart</span>
        {totalItemCount > 0 && (
          <span className="absolute top-0 right-2 bg-amber-500 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
            {totalItemCount}
          </span>
        )}
      </button>

    </div>
  );
}
