import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('kgt_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('kgt_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, variant = null, customization = null) => {
    setCartItems(prev => {
      // Check if exact item + variant + customization already exists
      const itemIndex = prev.findIndex(item => 
        item.id === product.id &&
        JSON.stringify(item.variant) === JSON.stringify(variant) &&
        JSON.stringify(item.customization) === JSON.stringify(customization)
      );

      if (itemIndex > -1) {
        const updated = [...prev];
        updated[itemIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          ...product,
          cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          quantity,
          variant,
          customization
        }];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'KUMAR10' || cleanCode === 'ONGOLE10') {
      setAppliedCoupon({ code: cleanCode, discountPercent: 10 });
      return { success: true, message: '10% Discount applied! 🎉' };
    } else if (cleanCode === 'GIFT20') {
      setAppliedCoupon({ code: cleanCode, discountPercent: 20 });
      return { success: true, message: '20% Special Gift Discount applied! 🎁' };
    }
    return { success: false, message: 'Invalid coupon code. Try "KUMAR10" or "GIFT20".' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.discount_price || item.price;
    const extraPrice = item.variant?.extra_price || 0;
    return sum + (itemPrice + extraPrice) * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const deliveryCharge = subtotal > 499 || subtotal === 0 ? 0 : 40;
  const finalTotal = subtotal - discountAmount + deliveryCharge;
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      subtotal,
      discountAmount,
      deliveryCharge,
      finalTotal,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      totalItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
