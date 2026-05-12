import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import { useWishlist } from '../hooks/useWishlist';
import './ProductCard.css';

function getCardVisual(category) {
  const visuals = {
    'Oriental': { 
      bg: 'linear-gradient(135deg, #1a0800 0%, #3d1a00 50%, #1a0800 100%)',
      symbol: '✦'
    },
    'Floral': { 
      bg: 'linear-gradient(135deg, #0d0010 0%, #2a0035 50%, #0d0010 100%)',
      symbol: '❋'
    },
    'Amber': { 
      bg: 'linear-gradient(135deg, #1a0e00 0%, #3d2600 50%, #1a0e00 100%)',
      symbol: '◉'
    },
    'Fresh': { 
      bg: 'linear-gradient(135deg, #001008 0%, #002818 50%, #001008 100%)',
      symbol: '❂'
    },
  };
  return visuals[category] || visuals['Oriental'];
}

// Fetches and displays all products in a responsive grid
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  const primaryImage = product.images && product.images[0]
    ? product.images[0]
    : null;

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    try {
      toggleWishlist(product._id);
    } catch (error) {
      console.error('Unable to update wishlist:', error);
    }
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
      <div className="card-image-area">
        {primaryImage && (
          <img
            src={primaryImage}
            alt={product.name}
            className="card-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        )}
        <div
          className="card-image-fallback"
          style={{
            display: primaryImage ? 'none' : 'flex',
            background: getCardVisual(product.category).bg
          }}
        >
          <span className="card-image-symbol">
            {getCardVisual(product.category).symbol}
          </span>
          <span className="card-image-name">{product.name}</span>
        </div>
        {product.badge && <span className="badge">{product.badge}</span>}
        <button
          className={`heart-btn ${wishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>

      <div className="card-body">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-tagline">{product.tagline}</p>

        <div className="rating-row">
          <StarRating rating={product.rating} />
          <span className="review-count">({product.reviewCount})</span>
        </div>

        <p className="product-price">₹{product.price}</p>
        <div className="marketplace-card-meta">
          <span>Free delivery</span>
          <span>Assured</span>
        </div>
        <p className="product-offer">Bank offer available</p>
      </div>
    </div>
  );
};

export default ProductCard;
