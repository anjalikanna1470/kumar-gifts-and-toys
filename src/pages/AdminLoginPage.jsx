import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';

export default function AdminLoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.token && data.user && data.user.role === 'ADMIN') {
          login(data.user, data.token);
          onNavigate('admin');
        } else {
          setError(data.message || 'Administrative access denied.');
        }
      })
      .catch(() => {
        setSubmitting(false);
        setError('Network error. Please try again.');
      });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fade-in">
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white font-serif font-black text-2xl flex items-center justify-center mx-auto shadow-lg">
            K
          </div>
          <h1 className="font-serif font-bold text-2xl">Store Owner Admin Portal</h1>
          <p className="text-xs text-slate-400">Kumar Gifts & Toys Administrative Console</p>
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-400 bg-rose-950/60 p-3 rounded-xl border border-rose-800 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter production admin email"
              className="w-full mt-1 p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300">Admin Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter production admin password"
              className="w-full mt-1 p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {submitting ? 'Authenticating...' : 'Enter Admin Console'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="bg-slate-800/80 p-3 rounded-xl text-[11px] text-slate-400 text-center border border-slate-700">
          <p className="font-bold text-amber-400">Secure Production Portal</p>
          <p>Requires valid administrative credentials configured in backend environment.</p>
        </div>

      </div>
    </div>
  );
}
