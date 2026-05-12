import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import api from '../api';
import './WishlistDrawer.css';

const WishlistDrawer = ({ isOpen, onClose, onToast }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch product details for wishlisted IDs
  useEffect(() => {
    if (!isOpen || wishlist.length === 0) return;

    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.filter(p => wishlist.includes(p._id)));
      } catch (error) {
        console.error('Unable to load wishlist products:', error);
      }
    };
    fetchProducts();
  }, [isOpen, wishlist]);

  const visibleProducts = wishlist.length === 0
    ? []
    : products.filter(product => wishlist.includes(product._id));

  const handleAddToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('lumiere_cart') || '[]');
      const firstSize = product.sizes?.[0] ?? { size: 'Default', price: product.price };
      const idx = cart.findIndex(
        i => i.productId === product._id && i.selectedSize === firstSize.size
      );
      if (idx > -1) {
        cart[idx].quantity += 1;
      } else {
        cart.push({
          productId: product._id,
          name: product.name,
          price: firstSize.price,
          selectedSize: firstSize.size,
          image: product.images?.[0],
          quantity: 1,
        });
      }
      localStorage.setItem('lumiere_cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'added' } }));
      onToast('Added to cart! 🛒');
    } catch (error) {
      console.error('Unable to add wishlist item to cart:', error);
    }
  };

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`wishlist-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">Your Wishlist</h2>
          <button className="drawer-close" onClick={onClose} aria-label="Close wishlist">✕</button>
        </div>

        <div className="drawer-body">
          {wishlist.length === 0 ? (
            <div className="drawer-empty">
              <p>Your wishlist is empty.<br />Start exploring!</p>
            </div>
          ) : (
            <ul className="wishlist-items-list">
              {visibleProducts.map(product => (
                <li key={product._id} className="wishlist-item">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="wishlist-item-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600';
                    }}
                    onClick={() => { navigate(`/product/${product._id}`); onClose(); }}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="wishlist-item-info">
                    <p className="wishlist-item-name">{product.name}</p>
                    <p className="wishlist-item-brand">{product.brand}</p>
                    <p className="wishlist-item-price">₹{product.price}</p>
                    <button
                      className="wishlist-add-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                  <button
                    className="wishlist-remove-btn"
                    onClick={() => removeFromWishlist(product._id)}
                    aria-label="Remove from wishlist"
                  >✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};

export default WishlistDrawer;
