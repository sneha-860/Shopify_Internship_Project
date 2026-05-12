import { useState, useEffect, useCallback } from 'react';

const CART_KEY = 'lumiere_cart';

const getCartFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'updated' } }));
  } catch (error) {
    console.error('Unable to save cart:', error);
  }
};

export const useCart = () => {
  const [cart, setCart] = useState(getCartFromStorage);

  // Sync from storage when other tabs or components update it
  useEffect(() => {
    const sync = () => setCart(getCartFromStorage());
    window.addEventListener('cartUpdated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cartUpdated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const updateCart = useCallback((newCart) => {
    setCart(newCart);
    saveCartToStorage(newCart);
  }, []);

  const increaseQty = useCallback((productId, selectedSize) => {
    const updated = getCartFromStorage().map(item =>
      item.productId === productId && item.selectedSize === selectedSize
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCart(updated);
  }, [updateCart]);

  const decreaseQty = useCallback((productId, selectedSize) => {
    const current = getCartFromStorage();
    const updated = current
      .map(item =>
        item.productId === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);
    updateCart(updated);
  }, [updateCart]);

  const removeItem = useCallback((productId, selectedSize) => {
    const updated = getCartFromStorage().filter(
      item => !(item.productId === productId && item.selectedSize === selectedSize)
    );
    updateCart(updated);
  }, [updateCart]);

  const clearCart = useCallback(() => {
    updateCart([]);
  }, [updateCart]);

  return { cart, totalCount, increaseQty, decreaseQty, removeItem, clearCart };
};
