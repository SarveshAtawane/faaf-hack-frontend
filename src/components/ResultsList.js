// src/components/ResultsList.js
import React, { useState, useEffect } from 'react';
import VendorCard from './VendorCard';
import './ResultsList.css';

const ResultsList = ({ results, onSelectionChange }) => {
  const [selectedIndices, setSelectedIndices] = useState([]);

  useEffect(() => {
    if (results && results.length > 0) {
      console.log("ResultsList mounted with results:", results);
      const all = results.map((_, i) => i);
      setSelectedIndices(all);
      onSelectionChange(results); // default: all selected
    }
  }, [results, onSelectionChange]);

  useEffect(() => {
    const selectedVendors = selectedIndices.map((i) => results[i]);
    onSelectionChange(selectedVendors);
  }, [selectedIndices, results, onSelectionChange]);

  const toggleSelection = (index) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (selectedIndices.length === results.length) {
      setSelectedIndices([]); // unselect all
    } else {
      setSelectedIndices(results.map((_, i) => i)); // select all
    }
  };

  if (!results || results.length === 0) return null;

  return (
    <div className="results-list">
      <div className="results-header">
        <h3>Search Results</h3>
        <span className="results-count">{results.length} vendor{results.length !== 1 ? 's' : ''} found</span>
        <div style={{ marginLeft: 'auto' }}>
          <button className='toggle-select-button' onClick={toggleAll}>
            {selectedIndices.length === results.length ? 'Unselect All' : 'Select All'}
          </button>
        </div>
      </div>

      <div className="results-grid">
        {results.map((vendor, index) => (
          <VendorCard
            key={index}
            vendor={vendor}
            // console.log("VendorCard rendered for index:", index)
            index={index}
            selected={selectedIndices.includes(index)}
            onToggle={toggleSelection}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
