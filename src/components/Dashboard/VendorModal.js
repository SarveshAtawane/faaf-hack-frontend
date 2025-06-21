import React from 'react';
import VendorItem from './VendorItem';

const VendorModal = ({ 
  enquiry, 
  onClose, 
  onVendorClick, 
  onDeleteEnquiry,
  porterQuotes,
  setPorterQuotes,
  loadingPorterQuotes,
  setLoadingPorterQuotes
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Vendors for "{enquiry.product}"</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {enquiry.vendors.map((vendor, i) => (
            <VendorItem 
              key={vendor._id || i} 
              vendor={vendor}
              onVendorClick={onVendorClick}
              enquiry={enquiry}
              porterQuotes={porterQuotes}
              setPorterQuotes={setPorterQuotes}
              loadingPorterQuotes={loadingPorterQuotes}
              setLoadingPorterQuotes={setLoadingPorterQuotes}
            />
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-danger" onClick={() => onDeleteEnquiry(enquiry.id)}>
            Delete Enquiry
          </button>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default VendorModal;