// src/components/vendor-sections/MetadataSection.js
import React from 'react';

const MetadataSection = ({ vendor }) => (
  <div className="vendor-section metadata">
    <h5>ℹ️ Additional Info</h5>
    <p><strong>Is Retry:</strong> {vendor.is_retry ? 'Yes' : 'No'}</p>
    <p><strong>Added:</strong> {new Date(vendor.timestamp).toLocaleString()}</p>
  </div>
);

export default MetadataSection;