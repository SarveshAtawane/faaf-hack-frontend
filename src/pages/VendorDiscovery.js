// src/pages/VendorDiscovery.js
import React, { useState, useCallback } from 'react';
import SearchForm from '../components/SearchForm';
import MapComponent from '../components/MapComponent';
import ResultsList from '../components/ResultsList';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import './VendorDiscovery.css';

const VendorDiscovery = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [results, setResults] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return setError('Please enter a search query');
    if (!location) return setError('Please select a location on the map');

    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/search', { query, location });
      setResults(res.data.results);
      console.log('Search results:', res.data.results);
    } catch (err) {
      setError('Failed to search vendors. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (locationString) => {
    setLocation(locationString);
    setError('');
  };

  const handleVendorSelectionChange = useCallback((selected) => {
    setSelectedVendors(selected);
  }, []);

  const handleEnquire = async () => {
    if (!selectedVendors.length || !query) return alert('No vendors selected or product not entered.');
    console.log('Selected vendors:', selectedVendors);
    console.log('Enquiring for product:', query, 'at location:', location);
    console.log('Additional details:', additionalDetails);
    
    try {
      const res = await axios.post('http://localhost:8000/enquire', {
        product: query,
        vendors: selectedVendors,
        location: location,
        additional_details: additionalDetails
      });
      alert(res.data.message || 'Enquiry sent!');
    } catch (err) {
      console.error('Enquiry failed:', err);
      alert('Failed to send enquiry');
    }
  };

  return (
    <div className="vendor-discovery">
      <header className="page-header">
        <h1>🔍 Vendor Discovery</h1>
        <p>Find local shops and services near you</p>
      </header>

      <div className="discovery-content">
        <div className="search-section">
          <SearchForm
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
          
          <div className="additional-details-section">
            <label htmlFor="additional-details">Additional Details (Optional):</label>
            <textarea
              id="additional-details"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Specify any additional requirements, preferred brands, quantity, delivery needs, etc."
              rows="3"
              className="additional-details-input"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="map-section">
          <MapComponent
            location={location}
            setLocation={handleLocationSelect}
            vendors={selectedVendors}
          />
        </div>

        <div className="results-section">
          {isLoading && <LoadingSpinner />}
          {!isLoading && results.length > 0 && (
            <>
              <ResultsList results={results} onSelectionChange={handleVendorSelectionChange} />
              <button onClick={handleEnquire} className='enquire-button'>
                Enquire Selected Vendors ({selectedVendors.length})
              </button>
            </>
          )}
          {!isLoading && results.length === 0 && location && (
            <div className="no-results">No vendors found. Try a different search term or location.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDiscovery;