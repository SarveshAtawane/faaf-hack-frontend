// src/components/PorterQuotesSection.js
import React from 'react';

const PorterQuotesSection = ({ vendorId, porterQuotes, loadingPorterQuotes }) => {
  const quotes = porterQuotes[vendorId];
  const loading = loadingPorterQuotes[vendorId];

  if (loading) {
    return (
      <div className="porter-quotes-loading">
        <p>🚚 Loading Porter delivery quotes...</p>
      </div>
    );
  }

  if (!quotes) {
    return null;
  }

  if (quotes.error) {
    return (
      <div className="porter-quotes-error">
        <p>❌ Error loading Porter quotes: {quotes.error}</p>
      </div>
    );
  }

  return (
    <div className="porter-quotes-section">
      <h5>🚚 Porter Delivery Options</h5>
      
      {quotes.vehicles && quotes.vehicles.length > 0 ? (
        <div className="porter-options">
          {quotes.vehicles.map((option, index) => (
            <div key={index} className="porter-option">
              <div className="porter-option-header">
                <div className="porter-option-details">{option.type || 'Vehicle'}</div>
                <span className="porter-price">
                  ₹{option.fare?.minor_amount ? (option.fare.minor_amount / 100).toFixed(2) : 'N/A'}
                </span>
              </div>
              <div className="porter-option-details">
                {option.eta && (
                  <p><strong>Estimated Time:</strong> {option.eta.value}</p>
                )}
                {option.capacity && (
                  <p><strong>Capacity:</strong> {option.capacity.value} {option.capacity.unit}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No delivery options available for this location.</p>
      )}
      
      {quotes.pickup_details && (
        <div className="porter-details">
          <h6>📍 Pickup Details (Vendor Location)</h6>
          <p>{quotes.pickup_details.address || `Lat: ${quotes.pickup_details.lat}, Lng: ${quotes.pickup_details.lng}`}</p>
        </div>
      )}
      
      {quotes.drop_details && (
        <div className="porter-details">
          <h6>📍 Drop Details (Customer Location)</h6>
          <p>{quotes.drop_details.address || `Lat: ${quotes.drop_details.lat}, Lng: ${quotes.drop_details.lng}`}</p>
        </div>
      )}
    </div>
  );
};

export default PorterQuotesSection;