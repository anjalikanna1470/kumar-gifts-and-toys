import React from 'react';
import { Heart, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onOpenCustomizer, onClickProduct }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);
  const discountPercent = product.price > product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.is_customizable) {
      if (onOpenCustomizer) onOpenCustomizer(product);
    } else {
      addToCart(product, 1);
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div 
      onClick={() => onClickProduct && onClickProduct(product)}
      className="group relative bg-white dark:bg-slate-800/90 rounded-2xl p-3 sm:p-4 border border-rose-100/60 dark:border-slate-700/60 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Badges */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-amber-50/50 dark:bg-slate-900/50 mb-3">
        <img 
          src={product.primary_image || product.images?.[0]?.image_url || '/images/custom_mug.png'} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount & Personalization Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.is_customizable === 1 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Custom
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full glass-effect shadow-md transition-all duration-200 hover:scale-110 active:scale-95 ${
            isLiked ? 'text-rose-600 fill-rose-600 bg-white' : 'text-slate-400 hover:text-rose-500 bg-white/80'
          }`}
          title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Out of Stock overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium text-rose-600 dark:text-rose-400 truncate max-w-[120px]">
              {product.category_name || 'Gifts'}
            </span>
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.5'}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base line-clamp-2 mb-1.5 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">
            {product.short_description || product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                ₹{product.discount_price || product.price}
              </span>
              {product.price > product.discount_price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
              Local Delivery in Ongole
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              product.is_customizable 
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white' 
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {product.is_customizable ? (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Customize
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
