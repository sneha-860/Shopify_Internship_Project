import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './SearchOverlay.css';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const trimmedQuery = query.trim().toLowerCase();
  const results = trimmedQuery
    ? allProducts
        .filter(p => p.name.toLowerCase().includes(trimmedQuery) || p.brand.toLowerCase().includes(trimmedQuery))
        .slice(0, 8)
    : [];

  // Fetch products once when overlay opens
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputRef.current?.focus(), 80);

    if (allProducts.length > 0) return;
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setAllProducts(res.data);
      } catch (error) {
        console.error('Unable to load search products:', error);
      }
    };
    fetchProducts();
  }, [isOpen, allProducts.length]);

  // Escape key closes overlay
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleResultClick = useCallback((id) => {
    navigate(`/product/${id}`);
    onClose();
  }, [navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true">
      <div className="search-overlay-backdrop" />

      {/* Top-right X close button */}
      <button className="search-close-btn" onClick={onClose} aria-label="Close search">✕</button>

      <div className="search-overlay-inner">
        <p className="search-label">Search Fragrances</p>

        <div className={`search-input-wrapper ${focused ? 'focused' : ''}`}>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Type to search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search fragrances"
          />
          <span className="search-input-underline" />
        </div>

        {results.length > 0 && (
          <ul className="search-results">
            {results.map(product => (
              <li
                key={product._id}
                className="search-result-item"
                onClick={() => handleResultClick(product._id)}
              >
                {/* CSS gradient thumbnail instead of broken image */}
                <div
                  className="search-result-thumb"
                  style={{
                    background: getCategoryGradient(product.category),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: 'rgba(201,168,76,0.8)',
                  }}
                >
                  {getCategorySymbol(product.category)}
                </div>
                <div className="search-result-text">
                  <span className="search-result-name">{product.name}</span>
                  <span className="search-result-brand">{product.brand}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {trimmedQuery && results.length === 0 && (
          <p className="search-no-results">No fragrances found for "{query}"</p>
        )}
      </div>
    </div>
  );
};

// Helpers for CSS gradient placeholders
const getCategoryGradient = (category = '') => {
  const c = category.toLowerCase();
  if (c.includes('floral')) return 'linear-gradient(135deg, #0d0010, #2d0030)';
  if (c.includes('amber'))  return 'linear-gradient(135deg, #1a0f00, #3d2800)';
  if (c.includes('fresh'))  return 'linear-gradient(135deg, #00100a, #003020)';
  return 'linear-gradient(135deg, #1a0a00, #3d1f00)'; // Oriental / default
};

const getCategorySymbol = (category = '') => {
  const c = category.toLowerCase();
  if (c.includes('floral')) return '❋';
  if (c.includes('amber'))  return '◉';
  if (c.includes('fresh'))  return '❂';
  return '✦'; // Oriental / default
};

export default SearchOverlay;
