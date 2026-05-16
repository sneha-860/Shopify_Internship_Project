import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { useWishlist } from '../hooks/useWishlist';
import './ProductCard.css';

function getCardVisual(category) {
  const visuals = {
    Oriental: {
      bg: 'linear-gradient(135deg, #1a0800 0%, #3d1a00 50%, #1a0800 100%)',
      symbol: '\u2726'
    },
    Floral: {
      bg: 'linear-gradient(135deg, #0d0010 0%, #2a0035 50%, #0d0010 100%)',
      symbol: '\u274b'
    },
    Amber: {
      bg: 'linear-gradient(135deg, #1a0e00 0%, #3d2600 50%, #1a0e00 100%)',
      symbol: '\u25ce'
    },
    Fresh: {
      bg: 'linear-gradient(135deg, #001008 0%, #002818 50%, #001008 100%)',
      symbol: '\u2742'
    },
  };
  return visuals[category] || visuals.Oriental;
}

const ProductCard = ({ product }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const visual = getCardVisual(product.category);

  const primaryImage = !imageFailed && product.images?.[0]
    ? product.images[0]
    : null;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      toggleWishlist(product._id);
    } catch (error) {
      console.error('Unable to update wishlist:', error);
    }
  };

  return (
    <article className="product-card">
      <Link className="product-card-link" to={`/product/${product._id}`} aria-label={`View ${product.name}`}>
        <div className="card-image-area">
          {primaryImage && (
            <img
              src={primaryImage}
              alt={product.name}
              className="card-image"
              onError={() => setImageFailed(true)}
            />
          )}
          <div
            className="card-image-fallback"
            style={{
              display: primaryImage ? 'none' : 'flex',
              background: visual.bg
            }}
          >
            <span className="card-image-symbol">{visual.symbol}</span>
            <span className="card-image-name">{product.name}</span>
          </div>
          {product.badge && <span className="badge">{product.badge}</span>}
        </div>

        <div className="card-body">
          <p className="product-brand">{product.brand}</p>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-tagline">{product.tagline}</p>

          <div className="rating-row">
            <StarRating rating={product.rating} />
            <span className="review-count">({product.reviewCount})</span>
          </div>

          <p className="product-price">&#8377;{product.price}</p>
          <div className="marketplace-card-meta">
            <span>Free delivery</span>
            <span>Assured</span>
          </div>
          <p className="product-offer">Bank offer available</p>
        </div>
      </Link>

      <button
        className={`heart-btn ${wishlisted ? 'wishlisted' : ''}`}
        onClick={handleWishlistToggle}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {wishlisted ? '\u2665' : '\u2661'}
      </button>
    </article>
  );
};

export default ProductCard;
