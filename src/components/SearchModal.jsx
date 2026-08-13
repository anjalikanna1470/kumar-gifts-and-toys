import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function SearchModal({ isOpen, onClose, onSelectProduct, onOpenCustomizer }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setProducts([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setProducts(Array.isArray(data) ? data : []);
        })
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-rose-100 dark:border-slate-700 max-h-[80vh] flex flex-col">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
          <Search className="w-5 h-5 text-rose-500" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customized mugs, pillows, plush toys, frames, birthday hampers..."
            className="w-full text-sm sm:text-base bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
            Esc
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="p-6 text-center space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Popular Gift Searches</span>
            <div className="flex flex-wrap justify-center gap-2">
              {['Customized Mug', 'Photo Pillow', 'Teddy Bear', '3D Acrylic Lamp', 'Birthday Hamper', 'Anniversary Gift', 'Toys'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-slate-700/60 text-rose-600 dark:text-rose-300 hover:bg-rose-100 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" /> {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Area */}
        {query && (
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                Searching gift inventory in Ongole...
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenCustomizer={(prod) => { onClose(); onOpenCustomizer(prod); }}
                    onClickProduct={(prod) => { onClose(); onSelectProduct(prod); }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  "We couldn't find that exact gift, but here are some alternatives in Ongole!"
                </p>
                <p className="text-xs text-slate-400">
                  Try searching for "mug", "pillow", "teddy", "frame", or "hamper".
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
