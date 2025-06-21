// src/components/SearchForm.js
import React from 'react';
import './SearchForm.css';

const SearchForm = ({ query, radius, onQueryChange, onRadiusChange, onSearch, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="search-input"
          placeholder="What are you looking for? (e.g., laptop repair, restaurant, pharmacy)"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          disabled={isLoading}
        />

        <input
          type="number"
          className="radius-input"
          placeholder="Radius (km)"
          value={radius}
          onChange={(e) => onRadiusChange(e.target.value)}
          disabled={isLoading}
          min="1"
        />

        <button 
          type="submit" 
          className="search-button"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search Vendors'}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
