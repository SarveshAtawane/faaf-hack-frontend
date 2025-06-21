// src/components/vendor-sections/StructuredDataSection.js
import React from 'react';

const StructuredDataSection = ({ vendor, setVendor }) => (
  <div className="vendor-section">
    <h5>📦 Structured Data (Editable)</h5>

    <label><strong>Price:</strong></label>
    <input
      type="text"
      value={vendor.structured_data?.Price || ''}
      onChange={(e) => setVendor(prev => ({
        ...prev,
        structured_data: { ...prev.structured_data, Price: e.target.value }
      }))}
    />

    <label><strong>Availability:</strong></label>
    <input
      type="text"
      value={vendor.structured_data?.Availaibility || ''}
      onChange={(e) => setVendor(prev => ({
        ...prev,
        structured_data: { ...prev.structured_data, Availaibility: e.target.value }
      }))}
    />

    <label><strong>Porter Delivery Possible:</strong></label>
    <input
      type="text"
      value={vendor.structured_data?.["Porter Delivery possible"] || ''}
      onChange={(e) => setVendor(prev => ({
        ...prev,
        structured_data: { ...prev.structured_data, "Porter Delivery possible": e.target.value }
      }))}
    />

    <label><strong>Min Time to be Available:</strong></label>
    <input
      type="text"
      value={vendor.structured_data?.["min amount of time to be available"] || ''}
      onChange={(e) => setVendor(prev => ({
        ...prev,
        structured_data: { ...prev.structured_data, "min amount of time to be available": e.target.value }
      }))}
    />

    <label><strong>Variants (JSON):</strong></label>
    <textarea
      rows={4}
      value={JSON.stringify(vendor.structured_data?.Variants || [], null, 2)}
      onChange={(e) => {
        try {
          const parsed = JSON.parse(e.target.value);
          setVendor(prev => ({
            ...prev,
            structured_data: { ...prev.structured_data, Variants: parsed }
          }));
        } catch {}
      }}
    />

    <label><strong>Alternatives (JSON):</strong></label>
    <textarea
      rows={4}
      value={JSON.stringify(vendor.structured_data?.Alternatives || [], null, 2)}
      onChange={(e) => {
        try {
          const parsed = JSON.parse(e.target.value);
          setVendor(prev => ({
            ...prev,
            structured_data: { ...prev.structured_data, Alternatives: parsed }
          }));
        } catch {}
      }}
    />
  </div>
);

export default StructuredDataSection;