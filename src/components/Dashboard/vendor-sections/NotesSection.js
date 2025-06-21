// src/components/vendor-sections/NotesSection.js
import React from 'react';

const NotesSection = ({ vendor, setVendor }) => (
  <div className="vendor-section">
    <h5>📝 Notes & Summary</h5>
    <label><strong>Call Summary:</strong></label>
    <textarea
      value={vendor.call_summary || ''}
      onChange={(e) => setVendor(prev => ({ ...prev, call_summary: e.target.value }))}
    />
    <label><strong>Remarks:</strong></label>
    <textarea
      value={vendor.remarks || ''}
      onChange={(e) => setVendor(prev => ({ ...prev, remarks: e.target.value }))}
    />
    <label><strong>Transcription:</strong></label>
    <textarea
      value={vendor.call_transcription || ''}
      onChange={(e) => setVendor(prev => ({ ...prev, call_transcription: e.target.value }))}
    />
  </div>
);

export default NotesSection;