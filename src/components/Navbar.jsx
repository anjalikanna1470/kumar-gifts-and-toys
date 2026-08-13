import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, User, Sun, Moon, Sparkles, MapPin, Phone, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate, activePage, onOpenSearch }) {
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-effect border-b border-rose-100/60 dark:border-slate-800 transition-colors">
      
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white text-xs py-1.5 px-4 font-semibold text-center flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-4 text-[11px] opacity-90">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Lawyer Pet Extension, Ongole
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" /> 099663 27229
          </span>
        </div>

        <div className="mx-auto sm:mx-0 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Special Offer: Use code <strong className="underline">KUMAR10</strong> for 10% OFF! Free Ongole Delivery on orders over ₹499</span>
        </div>

        <div className="hidden md:block text-[11px] font-bold">
          ⭐ 4.5 Rating (36+ Reviews)
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            K
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-tight tracking-tight flex items-center gap-1">
              Kumar <span className="text-rose-600 dark:text-rose-400">Gifts</span> & Toys
            </h1>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Ongole, Andhra Pradesh
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <button 
            onClick={() => onNavigate('home')}
            className={`hover:text-rose-600 transition-colors ${activePage === 'home' ? 'text-rose-600 font-bold' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('shop')}
            className={`hover:text-rose-600 transition-colors ${activePage === 'shop' ? 'text-rose-600 font-bold' : ''}`}
          >
            Shop All
          </button>
          <button 
            onClick={() => onNavigate('customized')}
            className={`hover:text-rose-600 transition-colors flex items-center gap-1 ${activePage === 'customized' ? 'text-rose-600 font-bold' : ''}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Custom Gifts
          </button>
          <button 
            onClick={() => onNavigate('offers')}
            className={`hover:text-rose-600 transition-colors ${activePage === 'offers' ? 'text-rose-600 font-bold' : ''}`}
          >
            Offers
          </button>
          <button 
            onClick={() => onNavigate('track')}
            className={`hover:text-rose-600 transition-colors ${activePage === 'track' ? 'text-rose-600 font-bold' : ''}`}
          >
            Track Order
          </button>
          <button 
            onClick={() => onNavigate('contact')}
            className={`hover:text-rose-600 transition-colors ${activePage === 'contact' ? 'text-rose-600 font-bold' : ''}`}
          >
            Contact
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
            title="Search products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onNavigate('wishlist')}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors hidden sm:block"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemCount > 0 && (
              <span className="bg-amber-400 text-slate-900 text-xs font-black px-1.5 py-0.2 rounded-full">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* Account / User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <User className="w-5 h-5" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-fade-in">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="font-bold text-xs text-slate-800 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="mt-1 inline-block bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                          STORE OWNER ADMIN
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => { setIsUserMenuOpen(false); onNavigate('admin'); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Store Admin Panel
                      </button>
                    )}

                    <button
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('account'); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      My Profile & Orders
                    </button>

                    <button
                      onClick={() => { setIsUserMenuOpen(false); logout(); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('login'); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-800 dark:text-white hover:bg-rose-50 dark:hover:bg-slate-700"
                    >
                      Customer Login / Sign Up
                    </button>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('admin-login'); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 border-t border-slate-100 dark:border-slate-700"
                    >
                      Store Owner Login
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-rose-100 dark:border-slate-800 px-4 py-3 space-y-2 animate-fade-in">
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onNavigate('home'); }}
            className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Home
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onNavigate('shop'); }}
            className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Shop All Products
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onNavigate('customized'); }}
            className="block w-full text-left px-3 py-2 text-sm font-semibold text-rose-600 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4 text-amber-500" /> Create Custom Gift
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onNavigate('track'); }}
            className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Track Order Status
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onNavigate('contact'); }}
            className="block w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Contact & Directions (Ongole)
          </button>
        </div>
      )}
    </header>
  );
}
