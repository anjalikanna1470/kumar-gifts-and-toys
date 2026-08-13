import React, { useState } from 'react';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Truck, QrCode } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function CheckoutPage({ onOrderCompleted, onNavigate }) {
  const { cartItems, subtotal, discountAmount, deliveryCharge, finalTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    landmark: 'Lawyer Pet Extension',
    city: 'Ongole',
    state: 'Andhra Pradesh',
    pincode: '523001',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street) {
      alert('Please fill out all address fields.');
      return;
    }

    setIsSubmitting(true);

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.id || null,
        items: cartItems,
        deliveryAddress: address,
        paymentMethod,
        totalAmount: finalTotal,
        discountAmount,
        deliveryCharge,
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsSubmitting(false);
        if (data.orderNumber) {
          setCompletedOrder(data);
          clearCart();
          // Trigger Celebration Confetti
          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } catch (e) {}
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        alert('Failed to place order. Please try again.');
      });
  };

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="font-serif font-bold text-3xl text-slate-900 dark:text-white">
          Your Gift is on its Way! 🎉
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Thank you for shopping at Kumar Gifts & Toys in Ongole! We have received your order and our local artisans are processing it.
        </p>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-rose-100 dark:border-slate-700 text-left space-y-3 shadow-md max-w-lg mx-auto">
          <div className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-700 pb-2">
            <span className="text-slate-400">Order Number:</span>
            <span className="font-extrabold text-rose-600 dark:text-rose-400">{completedOrder.orderNumber}</span>
          </div>

          <div className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-700 pb-2">
            <span className="text-slate-400">Tracking Code:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{completedOrder.trackingNumber}</span>
          </div>

          <div className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-700 pb-2">
            <span className="text-slate-400">Expected Local Delivery:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{completedOrder.expectedDelivery}</span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Payment Status:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {paymentMethod === 'COD' ? 'Cash on Delivery (Pending)' : 'Paid Online'}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('track', { query: completedOrder.orderNumber })}
            className="px-6 py-3 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-rose-700"
          >
            Track Order Progress
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500">
          Fast doorstep local delivery across Lawyer Pet Extension & Ongole
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Step 1: Address */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-rose-100 dark:border-slate-700 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" /> 1. Delivery Address (Ongole)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="Recipient Name"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="10-digit mobile"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-600 dark:text-slate-300">House No., Street Address</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="e.g. D.No 4-12, Mangamuru Road"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">Landmark</label>
                <input
                  type="text"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  placeholder="e.g. Near Lawyer Pet Ext."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-300">PIN Code</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  placeholder="523001"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-rose-100 dark:border-slate-700 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" /> 2. Payment Options
            </h3>

            <div className="space-y-2">
              {[
                { id: 'COD', title: 'Cash on Delivery (Pay at Doorstep)', desc: 'Pay cash or UPI when gift is delivered in Ongole.' },
                { id: 'UPI', title: 'Instant UPI (GooglePay / PhonePe / Paytm)', desc: 'Pay via UPI QR Code simulation.' },
                { id: 'CARD', title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay.' }
              ].map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === pm.id
                      ? 'border-rose-600 bg-rose-50/50 dark:bg-rose-950/40'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.id}
                    checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id)}
                    className="mt-1 accent-rose-600"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-800 dark:text-white block">{pm.title}</span>
                    <span className="text-[10px] text-slate-400">{pm.desc}</span>
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod === 'UPI' && (
              <div className="bg-amber-50 dark:bg-slate-900 p-4 rounded-2xl text-center space-y-2 border border-amber-200">
                <QrCode className="w-16 h-16 mx-auto text-slate-800 dark:text-amber-400" />
                <p className="text-xs font-bold">Scan to Pay ₹{finalTotal} via UPI</p>
                <p className="text-[10px] text-slate-500">UPI ID: kumargifts@upi</p>
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-rose-100 dark:border-slate-700 space-y-4 h-fit shadow-md">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
            Order Summary ({cartItems.length} items)
          </h3>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cartItems.map(item => (
              <div key={item.cartItemId} className="flex gap-2 text-xs">
                <img src={item.customization?.uploadedImageUrl || item.primary_image || '/images/custom_mug.png'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{item.title}</p>
                  <p className="text-[10px] text-slate-400">Qty: {item.quantity} x ₹{item.discount_price || item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t">
              <span>Total Payable</span>
              <span className="text-rose-600">₹{finalTotal}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || cartItems.length === 0}
            className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order 🎉'}
          </button>
        </div>

      </div>
    </div>
  );
}
