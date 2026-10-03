import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';
import { AuthContext } from './AuthContext';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cart, setCart] = useState({
    items: [],
    total_items: 0,
    total_amount: '0.00',
  });
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Fetch cart whenever user authentication status becomes true
  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [], total_items: 0, total_amount: '0.00' });
      setAppliedCoupon(null);
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    const updated = await cartService.addToCart(productId, quantity);
    setCart(updated);
    return updated;
  };

  const updateQuantity = async (productId, quantity) => {
    const updated = await cartService.updateQuantity(productId, quantity);
    setCart(updated);
    return updated;
  };

  const removeItem = async (productId) => {
    const updated = await cartService.removeItem(productId);
    setCart(updated);
    return updated;
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart({ items: [], total_items: 0, total_amount: '0.00' });
    setAppliedCoupon(null);
  };

  // Promo Coupon Logic
  const applyCoupon = (code) => {
    const upper = code.trim().toUpperCase();
    const rawTotal = parseFloat(cart.total_amount) || 0;

    if (upper === 'SAVE20') {
      const discount = rawTotal * 0.20;
      setAppliedCoupon({ code: 'SAVE20', discount, description: '20% OFF Everything' });
      return { success: true, message: 'Coupon SAVE20 applied! 20% discount added.' };
    }
    if (upper === 'AMAZON50') {
      if (rawTotal < 150) {
        return { success: false, message: 'AMAZON50 requires a minimum order of $150.' };
      }
      const discount = 50.0;
      setAppliedCoupon({ code: 'AMAZON50', discount, description: 'Flat $50 Super Saver' });
      return { success: true, message: 'Coupon AMAZON50 applied! $50 discount added.' };
    }
    if (upper === 'FESTIVE10') {
      const discount = rawTotal * 0.10;
      setAppliedCoupon({ code: 'FESTIVE10', discount, description: '10% Festive Bonus' });
      return { success: true, message: 'Coupon FESTIVE10 applied! 10% discount added.' };
    }

    return { success: false, message: 'Invalid promo code. Try SAVE20 or FESTIVE10.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculate final total after discount
  const rawSubtotal = parseFloat(cart.total_amount) || 0;
  const discountAmount = appliedCoupon ? Math.min(rawSubtotal, appliedCoupon.discount) : 0;
  const finalPayable = Math.max(0, rawSubtotal - discountAmount);

  const value = {
    cart,
    loading,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    finalPayable,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
