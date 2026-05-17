import React from 'react';
import './CartSkeleton.css';

const CartSkeleton = ({ count = 3 }) => (
  <div className="cart-skeleton" aria-label="Loading cart">
    {Array(count).fill(null).map((_, index) => (
      <div className="cart-skeleton-item" key={`cart-skeleton-${index}`}>
        <div className="cart-skeleton-img" />
        <div className="cart-skeleton-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
    ))}
  </div>
);

export default CartSkeleton;
