import { useState, useEffect, useCallback } from 'react';

const WISHLIST_KEY = 'lumiere_wishlist';

const getWishlistFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (list) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  } catch (error) {
    console.error('Unable to save wishlist:', error);
  }
};

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(getWishlistFromStorage);

  useEffect(() => {
    const sync = () => setWishlist(getWishlistFromStorage());
    window.addEventListener('wishlistUpdated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('wishlistUpdated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isWishlisted = useCallback((productId) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const toggleWishlist = useCallback((productId) => {
    const current = getWishlistFromStorage();
    const updated = current.includes(productId)
      ? current.filter(id => id !== productId)
      : [...current, productId];
    setWishlist(updated);
    saveWishlistToStorage(updated);
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    const updated = getWishlistFromStorage().filter(id => id !== productId);
    setWishlist(updated);
    saveWishlistToStorage(updated);
  }, []);

  return { wishlist, isWishlisted, toggleWishlist, removeFromWishlist };
};
