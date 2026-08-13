import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, Truck, Package, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function OrderTrackingPage({ initialQuery }) {
  const [query, setQuery] = useState(initialQuery || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const statuses = [
    'Placed',
    'Confirmed',
    'Processing',
    'Customized',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  useEffect(() => {
    if (initialQuery) {
      handleTrack(initialQuery);
    }
  }, [initialQuery]);

  const handleTrack = (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setError('');
    fetch(getApiUrl(`/api/orders/track/${encodeURIComponent(q.trim())}`))
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setOrder(data);
        } else {
          setError(data.message || 'Order not found.');
          setOrder(null);
        }
      })
      .catch(() => {
        setError('Error retrieving order details.');
        setOrder(null);
      })
      .finally(() => setLoading(false));
  };

  const getStatusIndex = (currentStatus) => {
    const idx = statuses.indexOf(currentStatus);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      <div className="text-center space-y-2">
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Track Your Gift Order
        </h1>
        <p className="text-xs text-slate-500">
          Enter your Order ID (e.g. KG-94812) or Tracking Code to see real-time progress
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleTrack(); }} className="flex gap-2 max-w-md mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Order ID (e.g. KG-94812)"
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" /> Track
        </button>
      </form>

      {loading && (
        <p className="text-center text-xs text-slate-400 animate-pulse py-8">Fetching live tracking information...</p>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 p-4 rounded-2xl text-center text-xs text-rose-600 font-bold border border-rose-200">
          <AlertCircle className="w-5 h-5 mx-auto mb-1" />
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-rose-100 dark:border-slate-700 space-y-8 shadow-md">
          
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Order Number</span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{order.order_number}</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-xs font-black px-3 py-1 rounded-full inline-block">
                {order.order_status}
              </span>
            </div>
          </div>

          {/* Visual Step Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Delivery Status Timeline</h4>

            <div className="relative flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 pt-2">
              {statuses.map((st, idx) => {
                const currentIdx = getStatusIndex(order.order_status);
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={st} className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1 relative text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                      isCurrent
                        ? 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900 animate-pulse'
                        : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <span className={`text-[11px] font-semibold ${
                      isPassed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'
                    }`}>
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Ordered Items</h4>
            <div className="space-y-2">
              {order.items?.map(it => (
                <div key={it.id} className="flex justify-between items-center text-xs p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{it.product_title}</p>
                    <p className="text-[10px] text-slate-400">Qty: {it.quantity}</p>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white">₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support Link */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-200">
            <span>Need help with your local Ongole delivery?</span>
            <a
              href={`https://wa.me/919966327229?text=${encodeURIComponent(`Hi Kumar Gifts & Toys, I have a query regarding Order ${order.order_number}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Store
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
