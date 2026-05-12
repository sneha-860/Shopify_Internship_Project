import React from 'react';
import ReviewCard from './ReviewCard';
import './ReviewsList.css';

// ReviewsList — displays all reviews for a product
const ReviewsList = ({ reviews, averageRating, totalReviews }) => {
  return (
    <div className="reviews-list-section">
      <h2 className="rl-heading">Customer Reviews</h2>
      
      <div className="rl-summary">
        {totalReviews > 0 ? (
          <>
            <span className="rl-avg">{averageRating.toFixed(1)}</span>
            <span className="rl-total">out of 5 based on {totalReviews} reviews</span>
          </>
        ) : (
          <p className="rl-empty">No reviews yet. Be the first to write one!</p>
        )}
      </div>

      <div className="rl-cards">
        {reviews.map((review, index) => (
          <ReviewCard key={review._id || `${review.author}-${review.date}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
