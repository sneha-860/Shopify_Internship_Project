import React, { useState } from 'react';
import api from '../api';
import StarRating from './StarRating';
import Toast from './Toast';
import './AddReviewForm.css';

// Form to submit a new review 
const AddReviewForm = ({ productId, onReviewAdded }) => {
  const [formData, setFormData] = useState({ name: '', title: '', comment: '' });
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (rating === 0) newErrors.rating = 'Please select a star rating';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.comment.trim()) newErrors.comment = 'Comment is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.post(`/products/${productId}/reviews`, {
        author: formData.name,
        rating,
        title: formData.title,
        body: formData.comment
      });
      
      onReviewAdded(response.data);
      
      setFormData({ name: '', title: '', comment: '' });
      setRating(0);
      setErrors({});
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-review-section">
      <h3 className="arf-heading">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="arf-form">
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Your name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className={errors.name ? 'error-input' : ''}
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>
        
        <div className="form-group rating-group">
          <span className="rating-label">Rating:</span>
          <StarRating rating={rating} interactive={true} onRate={setRating} />
          {errors.rating && <span className="error-msg">{errors.rating}</span>}
        </div>
        
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Summarize your experience" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className={errors.title ? 'error-input' : ''}
          />
          {errors.title && <span className="error-msg">{errors.title}</span>}
        </div>
        
        <div className="form-group">
          <textarea 
            placeholder="Tell us more..." 
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            className={errors.comment ? 'error-input' : ''}
          ></textarea>
          {errors.comment && <span className="error-msg">{errors.comment}</span>}
        </div>
        
        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
      
      <Toast message="Review submitted! Thank you ✨" visible={showToast} />
    </div>
  );
};

export default AddReviewForm;
