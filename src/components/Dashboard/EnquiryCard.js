import React from 'react';

const EnquiryCard = ({ enquiry, onEnquiryClick }) => {
  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      default: return 'status-default';
    }
  };

  return (
    <div className="enquiry-card" onClick={() => onEnquiryClick(enquiry)}>
      <div className="enquiry-header">
        <h3>{enquiry.product}</h3>
        <span className={`status ${getStatusColor(enquiry.status)}`}>
          {enquiry.status}
        </span>
      </div>
      <div className="enquiry-details">
        <p><strong>Location:</strong> {enquiry.location}</p>
        <p><strong>Vendors:</strong> {enquiry.vendors.length}</p>
        <p><strong>Date:</strong> {new Date(enquiry.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default EnquiryCard;