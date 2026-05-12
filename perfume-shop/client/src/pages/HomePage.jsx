import React, { useCallback, useState, useEffect } from 'react';
import api from '../api';
import HeroBanner from '../components/HeroBanner';
import OffersStrip from '../components/OffersStrip';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import Toast from '../components/Toast';
import AboutSection from '../components/AboutSection';
import './HomePage.css';

const CATEGORIES = ['all', 'Oriental', 'Floral', 'Amber', 'Fresh'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Popularity' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'priceLow', label: 'Price: Low to High' },
  { value: 'priceHigh', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' }
];

// Renders homepage sections in order
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [filters, setFilters] = useState({
    q: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sort: 'popular'
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== 'all')
      );
      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch (error) {
      console.error('Unable to load products:', error);
      setError('Unable to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    
    const handleCartUpdated = (e) => {
      if (e.detail?.action === 'added') {
        setToastMessage('Added to cart! 🛒');
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => window.removeEventListener('cartUpdated', handleCartUpdated);
  }, []);

  const updateFilter = (key, value) => {
    setFilters(current => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      q: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sort: 'popular'
    });
  };

  return (
    <div className="home-page fade-in">
      <HeroBanner />
      <OffersStrip />
      
      <section className="product-grid-section" id="collection">
        <div className="catalog-header">
          <div>
            <p className="catalog-eyebrow">Marketplace</p>
            <h2 className="section-heading">Our Collection</h2>
            <p className="catalog-count">
              {loading ? 'Finding fragrances...' : `${products.length} products found`}
            </p>
          </div>
          <button className="btn-reset-filters" onClick={resetFilters}>Reset Filters</button>
        </div>

        <div className="marketplace-controls">
          <label className="control-field search-field">
            <span>Search</span>
            <input
              type="search"
              value={filters.q}
              placeholder="Search by perfume, brand, notes"
              onChange={(e) => updateFilter('q', e.target.value)}
            />
          </label>

          <label className="control-field">
            <span>Category</span>
            <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </label>

          <label className="control-field compact">
            <span>Min Price</span>
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              placeholder="₹"
              onChange={(e) => updateFilter('minPrice', e.target.value)}
            />
          </label>

          <label className="control-field compact">
            <span>Max Price</span>
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              placeholder="₹"
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
            />
          </label>

          <label className="control-field">
            <span>Rating</span>
            <select value={filters.minRating} onChange={(e) => updateFilter('minRating', e.target.value)}>
              <option value="">Any Rating</option>
              <option value="4">4★ & above</option>
              <option value="4.5">4.5★ & above</option>
            </select>
          </label>

          <label className="control-field">
            <span>Sort By</span>
            <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
        
        {error ? (
          <div className="error-container">
            <p className="error-text">{error}</p>
            <button className="btn-retry" onClick={fetchProducts}>Retry</button>
          </div>
        ) : (
          <div className="product-grid">
            {loading 
              ? Array(8).fill(null).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
              : products.map(product => <ProductCard key={product._id} product={product} />)
            }
          </div>
        )}
      </section>
      
      <AboutSection />
      
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
};

export default HomePage;
