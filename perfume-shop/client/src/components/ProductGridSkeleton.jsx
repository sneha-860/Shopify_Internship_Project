import React from 'react';
import SkeletonCard from './SkeletonCard';

const ProductGridSkeleton = ({ count = 8 }) => (
  <>
    {Array(count).fill(null).map((_, index) => (
      <SkeletonCard key={`skeleton-${index}`} />
    ))}
  </>
);

export default ProductGridSkeleton;
