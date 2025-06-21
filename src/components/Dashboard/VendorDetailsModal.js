// src/components/VendorDetailsModal.js
import React from 'react';
import ContactSection from './vendor-sections/ContactSection';
import CallRecordingSection from './vendor-sections/CallRecordingSection';
import StructuredDataSection from './vendor-sections/StructuredDataSection';
import NotesSection from './vendor-sections/NotesSection';
import MetadataSection from './vendor-sections/MetadataSection';
import PorterQuotesSection from './PorterQuotesSection';
import { isPorterDeliveryAvailable } from './utils/porterUtils';

const VendorDetailsModal = ({ 
  vendor, 
  setVendor, 
  onClose, 
  onSave,
  porterQuotes,
  loadingPorterQuotes
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content vendor-details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{vendor.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <ContactSection vendor={vendor} />
          
          {isPorterDeliveryAvailable(vendor) && (
            <div className="vendor-section">
              <PorterQuotesSection 
                vendorId={vendor._id}
                porterQuotes={porterQuotes}
                loadingPorterQuotes={loadingPorterQuotes}
              />
            </div>
          )}

          <CallRecordingSection vendor={vendor} setVendor={setVendor} />
          <StructuredDataSection vendor={vendor} setVendor={setVendor} />
          <NotesSection vendor={vendor} setVendor={setVendor} />
          <MetadataSection vendor={vendor} />
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={onSave}>Save Changes</button>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;