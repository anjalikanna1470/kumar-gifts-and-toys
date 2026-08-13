import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Sparkles, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ onProceedToCheckout }) {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    deliveryCharge,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    setCouponMsg(res);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-rose-100 dark:border-slate-800">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-rose-50 to-amber-50 dark:from-slate-800 dark:to-slate-800 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Your Shopping Cart
              </h2>
              <span className="bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItems.length} items
              </span>
            </div>

            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 bg-rose-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-rose-500 animate-bounce">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                    Your cart is waiting for something special 🎁
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Explore personalized mugs, soft pillows, giant teddy bears, and photo frames!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.cartItemId}
                  className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-200/60 dark:border-slate-700/60 flex gap-3 relative group"
                >
                  <img
                    src={item.customization?.uploadedImageUrl || item.primary_image || item.images?.[0]?.image_url || '/images/custom_mug.png'}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant & Custom Specs */}
                      {item.variant && (
                        <span className="text-[10px] text-slate-500 font-medium block">
                          Variant: {item.variant.variant_value}
                        </span>
                      )}

                      {item.customization && (
                        <div className="mt-1 bg-amber-50/80 dark:bg-amber-900/20 p-1.5 rounded-lg text-[10px] border border-amber-200/50 dark:border-amber-800/30">
                          <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Customization Specs:
                          </span>
                          {item.customization.customText && (
                            <p className="text-slate-600 dark:text-slate-300 truncate">
                              "{item.customization.customText}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        ₹{((item.discount_price || item.price) + (item.variant?.extra_price || 0)) * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-3">
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder='Coupon (e.g. KUMAR10)'
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 uppercase focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-rose-600 text-white font-bold text-xs rounded-xl"
                >
                  Apply
                </button>
              </form>

              {couponMsg && (
                <p className={`text-[11px] font-semibold ${couponMsg.success ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {couponMsg.message}
                </p>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                  <span>Coupon {appliedCoupon.code} ({appliedCoupon.discountPercent}% Off)</span>
                  <button onClick={removeCoupon} className="text-xs text-rose-600 font-bold underline">Remove</button>
                </div>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge (Ongole Local)</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {deliveryCharge === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Final Total</span>
                  <span className="text-rose-600 dark:text-rose-400">₹{finalTotal}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  if (onProceedToCheckout) onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Secure Checkout • Same Day Local Dispatch in Ongole</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
