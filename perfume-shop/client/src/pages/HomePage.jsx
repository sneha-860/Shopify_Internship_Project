import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const EMPTY_FILTERS = {
  q: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  minRating: '',
  sort: 'popular'
};

const getFilterValidationMessage = (filters) => {
  const minPrice = filters.minPrice === '' ? null : Number(filters.minPrice);
  const maxPrice = filters.maxPrice === '' ? null : Number(filters.maxPrice);

  if ((minPrice !== null && minPrice < 0) || (maxPrice !== null && maxPrice < 0)) {
    return 'Price filters cannot be negative.';
  }

  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    return 'Minimum price cannot be greater than maximum price.';
  }

  return '';
};

const buildProductParams = (filters) => Object.fromEntries(
  Object.entries(filters)
    .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    .filter(([, value]) => value !== '' && value !== 'all')
);

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });

  const validationMessage = useMemo(() => getFilterValidationMessage(filters), [filters]);

  const fetchProducts = useCallback(async ({ signal } = {}) => {
    if (validationMessage) {
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/products', {
        params: buildProductParams(filters),
        signal
      });
      setProducts(res.data);
    } catch (error) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') return;
      console.error('Unable to load products:', error);
      setError(error.response?.data?.message || 'Unable to load products. Please try again.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [filters, validationMessage]);

  useEffect(() => {
    if (validationMessage) {
      setLoading(false);
      setError(null);
      return undefined;
    }

    const controller = new AbortController();
    const debounceMs = filters.q.trim() ? 350 : 0;
    const timeoutId = window.setTimeout(() => {
      fetchProducts({ signal: controller.signal });
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchProducts, filters.q, validationMessage]);

  useEffect(() => {
    const handleCartUpdated = (e) => {
      if (e.detail?.action === 'added') {
        setToastMessage('Added to cart! \u{1f6d2}');
        setToastVisible(true);
        window.setTimeout(() => setToastVisible(false), 3000);
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => window.removeEventListener('cartUpdated', handleCartUpdated);
  }, []);

  const updateFilter = (key, value) => {
    setFilters(current => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ ...EMPTY_FILTERS });
  };

  const activeFilterCount = Object.entries(filters).filter(([, value]) => {
    const normalizedValue = typeof value === 'string' ? value.trim() : value;
    return normalizedValue !== '' && normalizedValue !== 'all' && normalizedValue !== 'popular';
  }).length;
  const catalogStatus = validationMessage
    ? 'Adjust filters to continue'
    : loading
      ? 'Finding fragrances...'
      : `${products.length} product${products.length === 1 ? '' : 's'} found`;

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
              {catalogStatus}
              {activeFilterCount > 0 && !loading && !validationMessage && ` - ${activeFilterCount} filter${activeFilterCount === 1 ? '' : 's'} active`}
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
              placeholder="Search by fragrance, brand, or description"
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
              inputMode="numeric"
              value={filters.minPrice}
              placeholder={'\u20b9'}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
            />
          </label>

          <label className="control-field compact">
            <span>Max Price</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={filters.maxPrice}
              placeholder={'\u20b9'}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
            />
          </label>

          <label className="control-field">
            <span>Rating</span>
            <select value={filters.minRating} onChange={(e) => updateFilter('minRating', e.target.value)}>
              <option value="">Any Rating</option>
              <option value="4">{'4\u2605 & above'}</option>
              <option value="4.5">{'4.5\u2605 & above'}</option>
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

        {validationMessage ? (
          <div className="filter-message" role="status">
            <p>{validationMessage}</p>
            <button className="btn-retry" onClick={resetFilters}>Clear Filters</button>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-text">{error}</p>
            <button className="btn-retry" onClick={() => fetchProducts()}>Retry</button>
          </div>
        ) : (
          <div className="product-grid" aria-busy={loading}>
            {loading
              ? Array(8).fill(null).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
              : products.length > 0
                ? products.map(product => <ProductCard key={product._id} product={product} />)
                : (
                  <div className="empty-catalog">
                    <h3>No fragrances match these filters</h3>
                    <p>Try widening your price range or clearing one of the filters.</p>
                    <button className="btn-retry" onClick={resetFilters}>Clear Filters</button>
                  </div>
                )
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
