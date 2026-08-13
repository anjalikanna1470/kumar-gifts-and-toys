import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onNavigate }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegistering ? { name, email, phone, password } : { email, password };

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.token && data.user) {
          login(data.user, data.token);
          onNavigate('account');
        } else {
          setError(data.message || 'Authentication failed.');
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Network error. Please try again.');
      });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-rose-100 dark:border-slate-700 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-serif font-black text-2xl flex items-center justify-center mx-auto shadow-md">
            K
          </div>
          <h1 className="font-serif font-bold text-2xl text-slate-900 dark:text-white">
            {isRegistering ? 'Create Customer Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-400">
            {isRegistering ? 'Sign up to track custom orders & fast checkout in Ongole' : 'Login to manage your gift orders & wishlist'}
          </p>
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegistering && (
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anjali Rao"
                className="w-full mt-1 p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@gmail.com"
              className="w-full mt-1 p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          {isRegistering && (
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0987654321"
                className="w-full mt-1 p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : isRegistering ? 'Register Account' : 'Login Now'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
          >
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
}
