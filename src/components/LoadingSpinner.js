// src/components/LoadingSpinner.js
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Searching for vendors...</p>
    </div>
  );
};

export default LoadingSpinner;