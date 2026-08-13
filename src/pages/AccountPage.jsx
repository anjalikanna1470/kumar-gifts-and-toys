import React, { useState, useEffect } from 'react';
import { User, Package, Heart, MapPin, LogOut, Lock, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function AccountPage({ onNavigate }) {
  const { user, logout, token } = useAuth();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Edit State
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (token) {
      setLoadingOrders(true);
      fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));
    }
  }, [token]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    })
      .then(res => res.json())
      .then(data => setProfileMsg(data.message || 'Profile updated!'));
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-bold text-lg">Please login to view your account dashboard</h2>
        <button onClick={() => onNavigate('login')} className="px-6 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl">
          Login / Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-amber-500 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-2xl uppercase">
            {user.name?.[0] || 'U'}
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl">{user.name}</h1>
            <p className="text-xs opacity-90">{user.email} • {user.phone || 'Ongole customer'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl backdrop-blur-sm flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Tabs Menu */}
        <div className="space-y-1 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-rose-100 dark:border-slate-700 h-fit shadow-sm">
          {[
            { id: 'orders', label: 'My Orders', icon: Package },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: Heart },
            { id: 'profile', label: 'Profile Settings', icon: User },
          ].map(tb => {
            const Icon = tb.icon;
            return (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold text-left transition-colors ${
                  activeTab === tb.id
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" /> {tb.label}
              </button>
            );
          })}
        </div>

        {/* Right Content */}
        <div className="md:col-span-3">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Order History</h3>
              {loadingOrders ? (
                <p className="text-xs text-slate-400 py-8">Loading your orders...</p>
              ) : orders.length > 0 ? (
                orders.map(o => (
                  <div key={o.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 space-y-3 shadow-sm">
                    <div className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-700 pb-2">
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">{o.order_number}</span>
                        <span className="text-[10px] text-slate-400 block">{new Date(o.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full block">
                          {o.order_status}
                        </span>
                        <span className="font-black text-slate-900 dark:text-white text-sm">₹{o.total_amount}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {o.items?.map(it => (
                        <div key={it.id} className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                          <span>{it.product_title} (x{it.quantity})</span>
                          <span>₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onNavigate('track', { query: o.order_number })}
                        className="px-3.5 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl"
                      >
                        Track Progress
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200">
                  No orders placed yet. Start shopping!
                </p>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Your Saved Wishlist</h3>
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlist.map(p => (
                    <div key={p.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 text-xs text-center space-y-2">
                      <img src={p.primary_image || '/images/custom_mug.png'} alt="" className="w-full aspect-square object-cover rounded-lg" />
                      <p className="font-bold truncate">{p.title}</p>
                      <p className="font-extrabold text-rose-600">₹{p.discount_price || p.price}</p>
                      <button onClick={() => onNavigate('product', { id: p.id })} className="w-full py-1.5 bg-rose-600 text-white font-bold text-[10px] rounded-lg">
                        View Product
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200">
                  Your wishlist is empty.
                </p>
              )}
            </div>
          )}

          {/* PROFILE SETTINGS TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-rose-100 dark:border-slate-700 space-y-4 max-w-md shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Update Profile</h3>
              {profileMsg && <p className="text-xs font-semibold text-emerald-600">{profileMsg}</p>}

              <div className="space-y-1">
                <label className="text-xs font-semibold">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border text-xs dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border text-xs dark:bg-slate-900"
                />
              </div>

              <button type="submit" className="px-5 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl">
                Save Changes
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
