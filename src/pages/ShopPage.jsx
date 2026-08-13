import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Search, Sparkles, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getApiUrl } from '../config/api';

export default function ShopPage({ initialCategory, initialOccasion, onOpenCustomizer, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion || '');
  const [priceRange, setPriceRange] = useState(2000);
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(getApiUrl('/api/categories'))
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedOccasion, priceRange, customizableOnly, sortBy, searchQuery]);

  const fetchProducts = () => {
    setLoading(true);
    let path = `/api/products?max_price=${priceRange}&sort=${sortBy}`;
    if (selectedCategory) path += `&category=${encodeURIComponent(selectedCategory)}`;
    if (selectedOccasion) path += `&occasion=${encodeURIComponent(selectedOccasion)}`;
    if (customizableOnly) path += `&is_customizable=1`;
    if (searchQuery) path += `&search=${encodeURIComponent(searchQuery)}`;

    fetch(getApiUrl(path))
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedOccasion('');
    setPriceRange(2000);
    setCustomizableOnly(false);
    setSortBy('popular');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Shop Gifts & Toys in Ongole
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} products with fast local delivery in Lawyer Pet Extension & Ongole
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            <option value="popular">Popularity & Rating</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filter Sidebar */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700/60 shadow-sm space-y-6 h-fit">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-rose-500" /> Filter Gifts
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset All
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Keyword Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mugs, teddy, lamps..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === '' ? 'bg-rose-50 text-rose-600 font-bold dark:bg-rose-900/40' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    selectedCategory === cat.slug ? 'bg-rose-50 text-rose-600 font-bold dark:bg-rose-900/40' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] opacity-60">({cat.product_count || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Max Price</span>
              <span className="text-rose-600">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>

          {/* Customizable Only Checkbox */}
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pt-2 border-t border-slate-100 dark:border-slate-700">
            <input
              type="checkbox"
              checked={customizableOnly}
              onChange={(e) => setCustomizableOnly(e.target.checked)}
              className="w-4 h-4 accent-rose-600 rounded"
            />
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Customizable Gifts Only
            </span>
          </label>

        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
              Loading products from Kumar Gifts & Toys...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpenCustomizer={onOpenCustomizer}
                  onClickProduct={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 bg-white dark:bg-slate-800 rounded-3xl text-center space-y-3 p-6 border border-slate-200/60 dark:border-slate-700">
              <p className="font-bold text-slate-700 dark:text-slate-200 text-base">
                No matching gifts found for your selected filters 🎁
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your price range or clearing category filters to view all products.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
