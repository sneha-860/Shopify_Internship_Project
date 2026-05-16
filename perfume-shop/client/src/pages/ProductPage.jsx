import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import ImageGallery from '../components/ImageGallery';
import ProductInfo from '../components/ProductInfo';
import ReviewsList from '../components/ReviewsList';
import AddReviewForm from '../components/AddReviewForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { demoReviews, findDemoProduct } from '../data/demoCatalog';
import './ProductPage.css';

// Full product detail page
const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [productRes, reviewsRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/products/${id}/reviews`)
      ]);
      const apiProduct = productRes.data && typeof productRes.data === 'object' && !Array.isArray(productRes.data)
        ? productRes.data
        : findDemoProduct(id);
      setProduct(apiProduct || null);
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : demoReviews);
    } catch (error) {
      console.error('Unable to load product details:', error);
      const demoProduct = findDemoProduct(id);
      if (demoProduct) {
        setProduct(demoProduct);
        setReviews(demoReviews);
        setError(null);
      } else {
        setError('Unable to load product details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReviewAdded = (newReview) => {
    setReviews(currentReviews => [newReview, ...currentReviews]);
    
    // Update product rating and count locally for instant UI update
    setProduct(currentProduct => {
      const currentCount = currentProduct.reviewCount || 0;
      const newCount = currentCount + 1;
      const currentTotal = (currentProduct.rating || 0) * currentCount;
      const newRating = (currentTotal + newReview.rating) / newCount;

      return {
        ...currentProduct,
        reviewCount: newCount,
        rating: newRating
      };
    });
  };

  if (loading) return <div className="page-container center"><LoadingSpinner /></div>;
  
  if (error) return (
    <div className="page-container center error-container">
      <p className="error-text">{error}</p>
      <button className="btn-retry" onClick={fetchData}>Retry</button>
    </div>
  );

  if (!product) return <div className="page-container center">Product not found.</div>;

  return (
    <div className="product-page fade-in">
      <div className="product-main-grid">
        <div className="pg-gallery">
          <ImageGallery images={product.images} />
        </div>
        <div className="pg-info">
          <ProductInfo product={product} />
        </div>
      </div>
      
      <div className="product-reviews-container">
        <ReviewsList 
          reviews={reviews} 
          averageRating={product.rating} 
          totalReviews={product.reviewCount} 
        />
        <AddReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />
      </div>
    </div>
  );
};

export default ProductPage;
