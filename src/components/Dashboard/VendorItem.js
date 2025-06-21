// src/components/VendorItem.js
import React, { useState } from 'react';
import { fetchPorterQuote, isPorterDeliveryAvailable } from './utils/porterUtils';

const VendorItem = ({ 
  vendor, 
  onVendorClick, 
  enquiry,
  porterQuotes,
  setPorterQuotes,
  loadingPorterQuotes,
  setLoadingPorterQuotes
}) => {
  const [showPorterDropdown, setShowPorterDropdown] = useState(false);
  const [selectedPorterOption, setSelectedPorterOption] = useState(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      default: return 'status-default';
    }
  };

  const handleVendorClick = async (e) => {
    e.stopPropagation();
    onVendorClick(vendor);

    // Fetch Porter quote if porter delivery is available and coordinates exist
    if (isPorterDeliveryAvailable(vendor) && vendor.lat && vendor.lon && enquiry) {
      await fetchPorterQuote(
        vendor._id, 
        vendor, 
        enquiry.id,
        setPorterQuotes,
        setLoadingPorterQuotes
      );
    }
  };

  const handleShowFullDetails = (e) => {
    e.stopPropagation();
    setShowFullDetails(!showFullDetails);
    // Call the original vendor click handler if needed
    if (!showFullDetails) {
      onVendorClick(vendor);
    }
  };

  const handlePorterQuote = async (e) => {
    e.stopPropagation();
    
    if (isPorterDeliveryAvailable(vendor) && vendor.lat && vendor.lon && enquiry) {
      // If quotes don't exist, fetch them first
      if (!quotes) {
        await fetchPorterQuote(
          vendor._id, 
          vendor, 
          enquiry.id,
          setPorterQuotes,
          setLoadingPorterQuotes
        );
      }
      // Toggle dropdown
      setShowPorterDropdown(!showPorterDropdown);
    }
  };

  const handlePorterOptionSelect = (option) => {
    setSelectedPorterOption({
      vendorId: vendor._id,
      vendorName: vendor.name,
      option: option,
      quotes: porterQuotes[vendor._id]
    });
    setShowPorterDropdown(false);
    console.log('Selected Porter Option:', {
      vendorId: vendor._id,
      vendorName: vendor.name,
      option: option,
      quotes: porterQuotes[vendor._id]
    });
  };

  // Updated function to call the FastAPI backend (pickup only)
  const callPorterOrderAPI = async (orderData) => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://faaf-hack-backend.onrender.com';
      const response = await fetch(`${API_BASE_URL}/api/create_porter_order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        return { 
          success: false, 
          error: `HTTP ${response.status}: ${errorText.substring(0, 200)}...` 
        };
      }

      const result = await response.json();
      
      if (result.success) {
        return { success: true, data: result };
      } else {
        return { success: false, error: result.error || result.message || 'Unknown error' };
      }
    } catch (error) {
      console.error('API call failed:', error);
      if (error.message.includes('Unexpected token')) {
        return { 
          success: false, 
          error: 'Server returned HTML instead of JSON. Check if the API URL is correct and the server is running.' 
        };
      }
      return { success: false, error: error.message };
    }
  };
const handlePlaceOrder = async (e) => {
  e.stopPropagation();

  if (!selectedPorterOption || !enquiry) return;

  setPlacingOrder(true);

  try {
    const quotes = selectedPorterOption.quotes;

    console.log('=== DEBUG: Available Data ===');
    console.log('Vendor:', {
      id: vendor._id,
      name: vendor.name,
      address: vendor.address,
      phone: vendor.phone,
      lat: vendor.lat,
      lon: vendor.lon
    });
    console.log('Porter Quotes:', quotes);
    console.log('========================');

    const getValidAddress = (address) => {
      if (!address) return null;
      const cleaned = address.trim();
      return cleaned.length > 0 ? cleaned : null;
    };

    const formatPhoneNumber = (phone) => {
      if (!phone) return "+919876543210";
      const cleaned = phone.replace(/[^\d+]/g, '');
      if (cleaned.startsWith('+91')) return cleaned;
      if (cleaned.startsWith('91') && cleaned.length === 12) return '+' + cleaned;
      if (cleaned.length === 10) return '+91' + cleaned;
      return "+919876543210";
    };

    const pickupAddress = {
      apartment_address: getValidAddress(quotes.pickup_details?.apartment_address) || "",
      street_address1: getValidAddress(quotes.pickup_details?.street_address1) ||
                      getValidAddress(vendor.address) ||
                      "Vendor Location",
      street_address2: getValidAddress(quotes.pickup_details?.street_address2) || "",
      landmark: getValidAddress(quotes.pickup_details?.landmark) || "",
      city: getValidAddress(quotes.pickup_details?.city) || "Nashik",
      state: getValidAddress(quotes.pickup_details?.state) || "Maharashtra",
      pincode: getValidAddress(quotes.pickup_details?.pincode) || "422001",
      country: "India",
      lat: parseFloat(vendor.lat) || 12.9716,
      lng: parseFloat(vendor.lon) || 77.5946
    };

    console.log('Pickup Address:', pickupAddress);

    if (!pickupAddress.street_address1 || pickupAddress.street_address1.length < 3) {
      alert("❌ Invalid pickup address. Please check vendor address information.");
      return;
    }

    // ✅ Include contact_details as required by backend
const orderData = {
  pickup_details: {
    address: {
      ...pickupAddress   // ✅ just address fields: no contact_details
    }
  },
  delivery_instructions: {
    instructions_list: [
      {
        type: "text",
        description: "handle with care"
      }
    ]
  },
  additional_comments: `Order for ${vendor.name}. Vehicle: ${selectedPorterOption.option.type}. Enquiry ID: ${enquiry.id}`,
  vendor_id: selectedPorterOption.vendorId,
  vendor_name: selectedPorterOption.vendorName,
  enquiry_id: enquiry.id
};



    console.log('Sending order to FastAPI backend:', orderData);

    const result = await callPorterOrderAPI(orderData);

    if (result.success) {
      alert(`✅ Porter Order placed successfully!

Order Details:
- Vendor: ${orderData.vendor_name}
- Vehicle: ${selectedPorterOption.option.type}
- Fare: ₹${selectedPorterOption.option.fare?.minor_amount ? (selectedPorterOption.option.fare.minor_amount / 100).toFixed(2) : 'N/A'}
- Request ID: ${result.data.request_id}

Porter Response: ${JSON.stringify(result.data.porter_response, null, 2)}`);

      setSelectedPorterOption(null);
      setShowPorterDropdown(false);

    } else {
      console.error('Porter order failed:', result.error);
      alert(`❌ Failed to place Porter order: ${result.error}`);
    }

  } catch (error) {
    console.error('Error placing order:', error);
    alert(`❌ Failed to place order: ${error.message}`);
  } finally {
    setPlacingOrder(false);
  }
};


  const formatVariants = (variants) => {
    if (!variants || !Array.isArray(variants) || variants.length === 0) return 'N/A';
    return variants.slice(0, 2).map(variant => variant.name || variant).join(', ') + 
           (variants.length > 2 ? `... (+${variants.length - 2} more)` : '');
  };

  const quotes = porterQuotes[vendor._id];
  const loading = loadingPorterQuotes[vendor._id];

  return (
    <div className="vendor-item">
      <div className="vendor-info">
        <div className="vendor-header">
          <h4>{vendor.name}</h4>
          <div className="vendor-actions">
            <div className="vendor-badges">
              <span className={`status-badge ${getStatusColor(vendor.call_status)}`}>
                {vendor.call_status || 'Pending'}
              </span>
              {isPorterDeliveryAvailable(vendor) && (
                <span className="porter-badge">🚚 Porter Available</span>
              )}
            </div>
            <button 
              className="show-details-btn"
              onClick={handleShowFullDetails}
            >
              {showFullDetails ? '🔼 Hide Details' : '🔽 Show Full Details'}
            </button>
          </div>
        </div>
        
        {/* Structured Data Information */}
        <div className="structured-data-info">
          {vendor.structured_data?.Price && (
            <p><strong>💰 Price:</strong> {vendor.structured_data.Price}</p>
          )}
          
          {/* Show availability logic */}
     {(vendor.structured_data?.Availaibility === true || vendor.structured_data?.Availaibility === "true") && (
          <p>
            <strong>📅 Availability:</strong> Available
          </p>
        )}

                  
          {vendor.structured_data?.Variants && (
            <p><strong>🔄 Variants:</strong> {formatVariants(vendor.structured_data.Variants)}</p>
          )}
          
          {vendor.structured_data?.["Porter Delivery possible"] && (
            <p><strong>🚚 Porter Delivery:</strong> {vendor.structured_data["Porter Delivery possible"]}</p>
          )}
        </div>

        {/* Porter Quote Section */}
        {isPorterDeliveryAvailable(vendor) && (
          <div className="porter-quote-section">
            <button 
              className="porter-quote-btn"
              onClick={handlePorterQuote}
              disabled={loading}
            >
              {loading ? '🔄 Loading...' : showPorterDropdown ? '🚚 Hide Porter Quotes' : '🚚 Show Porter Quotes'}
            </button>

            {/* Porter Quote Dropdown */}
            {showPorterDropdown && quotes && !quotes.error && (
              <div className="porter-dropdown">
                <div className="porter-dropdown-header">
                  <span>🚚 Porter Pickup Options</span>
                  <button 
                    className="close-dropdown"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPorterDropdown(false);
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                {quotes.vehicles && quotes.vehicles.length > 0 ? (
                  <div className="porter-options-list">
                    {quotes.vehicles.map((option, index) => (
                      <div 
                        key={index} 
                        className={`porter-option-item ${selectedPorterOption?.option === option ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePorterOptionSelect(option);
                        }}
                      >
                        <div className="porter-option-info">
                          <div className="porter-vehicle-type">
                            {option.type || 'Vehicle'}
                          </div>
                          <div className="porter-details-mini">
                            {option.eta && <span>⏱️ {option.eta.value}</span>}
                            {option.capacity && <span>📦 {option.capacity.value} {option.capacity.unit}</span>}
                          </div>
                        </div>
                        <div className="porter-price-display">
                          ₹{option.fare?.minor_amount ? (option.fare.minor_amount / 100).toFixed(2) : 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-porter-options">
                    No pickup options available for this location.
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {quotes && quotes.error && (
              <div className="porter-error">
                ❌ Error loading Porter quotes: {quotes.error}
              </div>
            )}

            {/* Selected Option Display */}
            {selectedPorterOption && selectedPorterOption.vendorId === vendor._id && (
              <div className="selected-porter-option">
                <div className="selected-option-info">
                  <span className="selected-label">✅ Selected:</span>
                  <span className="selected-vehicle">{selectedPorterOption.option.type}</span>
                  <span className="selected-price">₹{selectedPorterOption.option.fare?.minor_amount ? (selectedPorterOption.option.fare.minor_amount / 100).toFixed(2) : 'N/A'}</span>
                </div>
                <button 
                  className="place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                >
                  {placingOrder ? '🔄 Placing Order...' : '📋 Place Pickup Order'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Full Details Section - Only show when expanded */}
        {showFullDetails && (
          <div className="full-details-section">
            <div className="details-divider"></div>
            <p><strong>📍 Address:</strong> {vendor.address}</p>
            {vendor.phone && <p><strong>📞 Phone:</strong> {vendor.phone}</p>}
            {vendor.email && <p><strong>📧 Email:</strong> {vendor.email}</p>}
            {vendor.notes && <p><strong>📝 Notes:</strong> {vendor.notes}</p>}
            
            {/* Additional structured data details */}
            {vendor.structured_data?.Alternatives && vendor.structured_data.Alternatives.length > 0 && (
              <div className="alternatives-section">
                <p><strong>🔄 Alternatives:</strong></p>
                <ul>
                  {/* {vendor.structured_data.Alternatives.map((alt, index) => (
                    <li key={index}>{typeof alt === 'string' ? alt : alt.name || JSON.stringify(alt)}</li>
                  ))} */}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorItem;