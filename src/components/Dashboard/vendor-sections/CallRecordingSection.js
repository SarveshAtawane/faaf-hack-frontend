// src/components/vendor-sections/CallRecordingSection.js
import React from 'react';

const CallRecordingSection = ({ vendor, setVendor }) => (
  <div className="vendor-section">
    <h5>🎙️ Call Recording</h5>
    {vendor.call_recording ? (
      <div className="audio-section">
        <audio controls style={{ width: '100%', marginBottom: '10px' }}>
          <source src={vendor.call_recording} type="audio/mpeg" />
          <source src={vendor.call_recording} type="audio/wav" />
          <source src={vendor.call_recording} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    ) : (
      <div className="no-audio">
        <p>No call recording available</p>
        <label><strong>Add Recording URL:</strong></label>
        <input
          type="url"
          value={vendor.call_recording || ''}
          onChange={(e) => setVendor(prev => ({ ...prev, call_recording: e.target.value }))}
          placeholder="Enter audio recording URL"
          style={{ width: '100%' }}
        />
      </div>
    )}
    {vendor.call_duration && (
      <p><strong>Call Duration:</strong> {vendor.call_duration}</p>
    )}
  </div>
);

export default CallRecordingSection;