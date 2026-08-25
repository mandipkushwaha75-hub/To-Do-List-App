import React from 'react';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton-checkbox shimmer"></div>
      <div className="skeleton-title shimmer"></div>
    </div>
    <div className="skeleton-body shimmer"></div>
    <div className="skeleton-footer">
      <div className="skeleton-date shimmer"></div>
      <div className="skeleton-actions shimmer"></div>
    </div>
  </div>
);

const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
