// src/components/vendor-sections/ContactSection.js
import React from 'react';

const ContactSection = ({ vendor }) => (
  <div className="vendor-section">
    <h5>📍 Contact Information</h5>
    <p><strong>Address:</strong> {vendor.address}</p>
    {vendor.phone && <p><strong>Phone:</strong> 📞 {vendor.phone}</p>}
    {vendor.lat && vendor.lon && (
      <p><strong>Coordinates:</strong> {vendor.lat}, {vendor.lon}</p>
    )}
  </div>
);

export default ContactSection;