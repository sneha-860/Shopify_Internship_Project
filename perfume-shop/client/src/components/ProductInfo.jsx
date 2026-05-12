import React, { useState } from 'react';
import StarRating from './StarRating';
import Toast from './Toast';
import { useWishlist } from '../hooks/useWishlist';
import './ProductInfo.css';

// Product details, size selector, and action buttons
const ProductInfo = ({ product }) => {
  const availableSizes = product.sizes?.length
    ? product.sizes
    : [{ size: 'Default', price: product.price }];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [showShare, setShowShare] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Wishlist functionality
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('lumiere_cart') || '[]');
    const existingItemIndex = cart.findIndex(
      item => item.productId === product._id && item.selectedSize === selectedSize.size
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: selectedSize.price,
        selectedSize: selectedSize.size,
        image: product.images?.[0],
        quantity: 1
      });
    }

    localStorage.setItem('lumiere_cart', JSON.stringify(cart));
    
    // Dispatch custom event for Navbar to update badge
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'added' } }));

    setToastMessage('Added to cart! 🛒');
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  const handleWishlistToggle = () => {
    try {
      toggleWishlist(product._id);
      
      const message = wishlisted 
        ? `${product.name} removed from wishlist` 
        : `${product.name} added to wishlist!`;
      
      setToastMessage(message);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      setToastMessage('Error updating wishlist');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }
  };
  const shareText = `Check out ${product.name}`;
  const pageURL = window.location.href;

  return (
    <div className="product-info">
      <p className="pi-brand">{product.brand}</p>
      <h1 className="pi-name">{product.name}</h1>
      
      <div className="pi-rating-row">
        <StarRating rating={product.rating || 0} />
        <span className="pi-review-text">{Number(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reviews)</span>
      </div>
      
      <div className="pi-price">₹{selectedSize.price}</div>
      
      <hr className="pi-divider" />
      
      <p className="pi-size-label">Select Size</p>
      <div className="pi-size-options">
        {availableSizes.map((s, idx) => (
          <button
            key={idx}
            className={`size-btn ${selectedSize.size === s.size ? 'selected' : ''}`}
            onClick={() => setSelectedSize(s)}
          >
            {s.size}
          </button>
        ))}
      </div>
      
      <hr className="pi-divider" />
      
      <p className="pi-desc">{product.description || 'No description available.'}</p>
      
      <div className="pi-actions">
        <button className="btn-add-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
         <button 
          className={`btn-wishlist ${wishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlistToggle}
        >
          {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </button>
      </div>
      
      <div className="pi-share-section">
        <button className="btn-share-toggle" onClick={() => setShowShare(!showShare)}>
          Share this fragrance ↗
        </button>
        
        {showShare && (
          <div className="share-panel">
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageURL)}`} 
              target="_blank" 
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageURL)}&text=${encodeURIComponent(shareText)}`} 
              target="_blank" 
              rel="noreferrer"
            >
              Twitter/X
            </a>
            <button onClick={handleCopyLink} className="btn-copy">
              {linkCopied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        )}
      </div>

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
};

export default ProductInfo;
