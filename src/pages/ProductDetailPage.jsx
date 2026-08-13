import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingBag, Sparkles, Truck, ShieldCheck, RefreshCw, MessageSquare, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetailPage({ productIdOrSlug, onOpenCustomizer, onProceedToCheckout }) {
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (!productIdOrSlug) return;
    fetch(`/api/products/${productIdOrSlug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        if (data.images?.length > 0) {
          setActiveImage(data.images[0].image_url);
        } else {
          setActiveImage('/images/custom_mug.png');
        }
        if (data.variants?.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      })
      .catch(err => console.error(err));
  }, [productIdOrSlug]);

  if (!product) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 animate-pulse">
        Loading product details...
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const discountPercent = product.price > product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
    : 0;

  const handleAddToCart = () => {
    if (product.is_customizable) {
      if (onOpenCustomizer) onOpenCustomizer(product);
    } else {
      addToCart(product, quantity, selectedVariant);
    }
  };

  const handleBuyNow = () => {
    if (product.is_customizable) {
      if (onOpenCustomizer) onOpenCustomizer(product);
    } else {
      addToCart(product, quantity, selectedVariant);
      if (onProceedToCheckout) onProceedToCheckout();
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    fetch(`/api/reviews/product/${product.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment
      })
    })
      .then(res => res.json())
      .then(() => {
        setReviewSuccess(true);
        setNewReview({ name: '', rating: 5, comment: '' });
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      
      {/* Product Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-md group">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full glass-effect shadow-md transition-transform active:scale-95 ${
                isLiked ? 'text-rose-600 fill-rose-600 bg-white' : 'text-slate-400 bg-white/80'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-600' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image_url)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === img.image_url ? 'border-rose-600 ring-2 ring-rose-500/20' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full uppercase">
                {product.category_name || 'Gifts'}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating || '4.5'}</span>
                <span className="text-slate-400 font-normal">({product.review_count || 1} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            <p className="text-xs text-slate-500 mt-2">
              SKU: <strong className="text-slate-700 dark:text-slate-300">{product.sku}</strong>
            </p>
          </div>

          {/* Price Box */}
          <div className="bg-amber-50/60 dark:bg-slate-800/60 p-4 rounded-2xl border border-amber-200/50 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                  ₹{(product.discount_price || product.price) + (selectedVariant?.extra_price || 0)}
                </span>
                {product.price > product.discount_price && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                Inclusive of all taxes • Free delivery in Ongole on orders above ₹499
              </p>
            </div>

            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
              In Stock
            </span>
          </div>

          {/* Variants Selector */}
          {product.variants?.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Option / Size</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id || v.variant_value}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedVariant?.variant_value === v.variant_value
                        ? 'border-rose-600 bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {v.variant_value} {v.extra_price > 0 ? `(+₹${v.extra_price})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Counter */}
          {!product.is_customizable && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                product.is_customizable
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 shadow-amber-500/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              {product.is_customizable ? (
                <>
                  <Sparkles className="w-4 h-4" /> Personalize & Add to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="py-3.5 px-6 rounded-2xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-all active:scale-95"
            >
              Buy Now
            </button>
          </div>

          {/* Local Service Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-rose-500" />
              <span>Doorstep Delivery in Ongole</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Quality Assurance</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs Section: Description, Specifications, Reviews */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-rose-100 dark:border-slate-700/60 shadow-sm space-y-6">
        <div className="flex border-b border-slate-200 dark:border-slate-700 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'description' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-400'
            }`}
          >
            Description & Details
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'reviews' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-400'
            }`}
          >
            Customer Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>{product.description}</p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-white mb-2">Highlights & Care Instructions</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Non-fading HD sublimated digital print.</li>
                <li>Microwave & dishwasher friendly (for ceramic mugs).</li>
                <li>Made with non-toxic, child-safe material (for plush toys).</li>
                <li>Local artisan verification before packing in Lawyer Pet Extension, Ongole.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            
            {/* Reviews List */}
            <div className="space-y-3">
              {product.reviews?.length > 0 ? (
                product.reviews.map(r => (
                  <div key={r.id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-800 dark:text-white">{r.user_name}</span>
                      <div className="flex items-center text-amber-400 text-xs">
                        {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{r.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No reviews yet for this gift. Be the first to leave a review!</p>
              )}
            </div>

            {/* Write a Review */}
            <form onSubmit={handleReviewSubmit} className="bg-rose-50/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-rose-100 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">Leave a Customer Review</h4>
              {reviewSuccess ? (
                <p className="text-xs text-emerald-600 font-bold">Review submitted successfully! Thank you ❤️</p>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Anjali R.)"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <textarea
                    rows={3}
                    placeholder="Write your review here..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <button type="submit" className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl">
                    Submit Review
                  </button>
                </>
              )}
            </form>

          </div>
        )}
      </div>

    </div>
  );
}
