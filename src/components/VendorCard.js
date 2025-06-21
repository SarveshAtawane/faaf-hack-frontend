// src/components/VendorCard.js
import React from 'react';
import './VendorCard.css';

const VendorCard = ({ vendor, index, selected, onToggle }) => {
  const formatPhone = (phone) => (!phone || phone === 'N/A' ? 'Phone not available' : phone);

  return (
    <div
      className={`vendor-card ${selected ? 'selected' : ''}`}
      onClick={() => onToggle(index)}
      style={{ border: selected ? '2px solid green' : '1px solid #ccc', cursor: 'pointer' }}
    >
      <div className="vendor-header">
        <h4 className="vendor-name">{vendor.name || 'Name not available'}</h4>
      </div>

      <div className="vendor-details">
        <div className="vendor-address">
          <span className="icon">📍</span>
          <span>{vendor.address || 'Address not available'}</span>
        </div>
        <div className="vendor-phone">
          <span className="icon">📞</span>
          <span>{formatPhone(vendor.phone)}</span>
        </div>
      </div>

      <div className="vendor-actions">
        {vendor.phone && vendor.phone !== 'N/A' && (
          <button className="call-button" onClick={(e) => { e.stopPropagation(); window.open(`tel:${vendor.phone}`); }}>
            Call Now
          </button>
        )}
        {vendor.address && (
          <button className="directions-button" onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/search/${encodeURIComponent(vendor.address)}`); }}>
            Get Directions
          </button>
        )}
      </div>
    </div>
  );
};

export default VendorCard;
