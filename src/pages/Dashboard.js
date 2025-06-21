// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnquiryCard from '../components/Dashboard/EnquiryCard';
import VendorModal from '../components/Dashboard/VendorModal';
import VendorDetailsModal from '../components/Dashboard/VendorDetailsModal';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showVendors, setShowVendors] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [editableVendor, setEditableVendor] = useState(null);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [porterQuotes, setPorterQuotes] = useState({});
  const [loadingPorterQuotes, setLoadingPorterQuotes] = useState({});

  // Helper function to process enquiries data
  const processEnquiriesData = (data) => {
    const enquiriesMap = {};
    data.enquiries.forEach(vendor => {
      const collectionName = vendor.__collection__;
      if (!enquiriesMap[collectionName]) {
        const parts = collectionName.split('_');
        const location = parts.pop();
        const product = parts.join('_');
        enquiriesMap[collectionName] = {
          id: collectionName,
          product,
          location,
          vendors: [],
          date: vendor.timestamp || new Date().toISOString(),
          status: 'Active'
        };
      }
      enquiriesMap[collectionName].vendors.push({
        _id: vendor._id,
        name: vendor.name,
        address: vendor.address,
        phone: vendor.phone,
        lat: vendor.location?.lat,
        lon: vendor.location?.lon,
        availability: vendor.availability,
        price: vendor.price,
        variants: vendor.variants || [],
        alternatives: vendor.alternatives || [],
        min_availability_time: vendor.min_availability_time,
        call_status: vendor.call_status,
        call_attempts: vendor.call_attempts,
        call_summary: vendor.call_summary,
        call_duration: vendor.call_duration,
        call_recording: vendor.call_recording,
        call_transcription: vendor.call_transcription,
        is_retry: vendor.is_retry,
        remarks: vendor.remarks,
        timestamp: vendor.timestamp,
        structured_data: vendor.structured_data || {}
      });
    });

    return Object.values(enquiriesMap).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  };

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://faaf-hack-backend.onrender.com/enquiries');
      if (!response.ok) throw new Error('Failed to fetch enquiries');
      const data = await response.json();

      const enquiriesArray = processEnquiriesData(data);
      setEnquiries(enquiriesArray);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleEnquiryClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowVendors(true);
  };

  const closeVendorModal = () => {
    setShowVendors(false);
    setSelectedEnquiry(null);
  };

  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    setEditableVendor({ ...vendor });
    setShowVendorDetails(true);
  };

  const closeVendorDetails = () => {
    setShowVendorDetails(false);
    setSelectedVendor(null);
    setEditableVendor(null);
  };

  const deleteEnquiry = (enquiryId) => {
    const updated = enquiries.filter(e => e.id !== enquiryId);
    setEnquiries(updated);
    closeVendorModal();
    alert('Note: Deletion must be implemented in the backend too.');
  };

  const saveVendorChanges = async () => {
    try {
      const res = await fetch('https://faaf-hack-backend.onrender.com/patch_vendor_data', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collection_name: selectedEnquiry.id,
          vendor_id: selectedVendor._id,
          updates: {
            structured_data: editableVendor.structured_data,
            call_summary: editableVendor.call_summary,
            remarks: editableVendor.remarks,
            call_transcription: editableVendor.call_transcription,
            call_recording: editableVendor.call_recording
          }
        })
      });

      if (res.ok) {
        alert('Vendor data updated successfully!');
        fetchEnquiries();
        closeVendorDetails();
      } else {
        const errData = await res.json();
        alert('Error saving changes: ' + errData.message);
      }
    } catch (e) {
      console.error(e);
      alert('Error saving changes: ' + e.message);
    }
  };

  if (loading) return <div className="dashboard"><p>Loading enquiries...</p></div>;
  if (error) return (
    <div className="dashboard">
      <p>Error: {error}</p>
      <button onClick={fetchEnquiries}>Retry</button>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏠 Dashboard</h1>
        <p>Welcome back! Here's your vendor enquiry overview.</p>
      </header>

      <div className="dashboard-content">
        <div className="quick-actions">
          {/* <button className="action-btn primary" onClick={() => navigate('/vendor-discovery')}>
            🔍 New Vendor Search
          </button> */}
          <button className="action-btn secondary" onClick={fetchEnquiries}>🔄 Refresh</button>
        </div>

        <div className="enquiries-section">
          <h2>Your Enquiries ({enquiries.length})</h2>
          {enquiries.length === 0 ? (
            <div className="no-enquiries">
              <p>No enquiries yet. Start by searching for vendors!</p>
              <button className="action-btn primary" onClick={() => navigate('/vendor-discovery')}>
                Start Your First Search
              </button>
            </div>
          ) : (
            <div className="enquiries-grid">
              {enquiries.map(enquiry => (
                <EnquiryCard 
                  key={enquiry.id} 
                  enquiry={enquiry} 
                  onEnquiryClick={handleEnquiryClick} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showVendors && selectedEnquiry && (
        <VendorModal 
          enquiry={selectedEnquiry}
          onClose={closeVendorModal}
          onVendorClick={handleVendorClick}
          onDeleteEnquiry={deleteEnquiry}
          porterQuotes={porterQuotes}
          setPorterQuotes={setPorterQuotes}
          loadingPorterQuotes={loadingPorterQuotes}
          setLoadingPorterQuotes={setLoadingPorterQuotes}
        />
      )}

      {showVendorDetails && editableVendor && (
        <VendorDetailsModal 
          vendor={editableVendor}
          setVendor={setEditableVendor}
          onClose={closeVendorDetails}
          onSave={saveVendorChanges}
          porterQuotes={porterQuotes}
          loadingPorterQuotes={loadingPorterQuotes}
        />
      )}
    </div>
  );
};

export default Dashboard;