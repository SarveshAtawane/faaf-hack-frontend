// src/utils/porterUtils.js

// Function to extract drop location from collection name
export const extractDropLocationFromCollection = (collectionName) => {
  try {
    // Collection name format: product_name_lat,lon
    const parts = collectionName.split('_');
    const locationPart = parts[parts.length - 1]; // Get the last part
    
    if (locationPart && locationPart.includes(',')) {
      const [lat, lon] = locationPart.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lon)) {
        return { lat, lon };
      }
    }
    
    // If parsing fails, return null
    return null;
  } catch (error) {
    console.error('Error parsing collection name for coordinates:', error);
    return null;
  }
};

// Function to fetch Porter delivery quotes
export const fetchPorterQuote = async (
  vendorId, 
  vendor, 
  collectionName, 
  setPorterQuotes, 
  setLoadingPorterQuotes
) => {
  try {
    setLoadingPorterQuotes(prev => ({ ...prev, [vendorId]: true }));
    
    // Use vendor location as pickup
    const pickupLat = vendor.lat;
    const pickupLng = vendor.lon;
    
    // Extract drop location from collection name
    const dropLocation = extractDropLocationFromCollection(collectionName);
    
    if (!pickupLat || !pickupLng) {
      throw new Error('Vendor coordinates not available');
    }
    
    if (!dropLocation) {
      throw new Error('Drop location could not be extracted from collection name');
    }
    
    // Use POST method instead of GET
    const response = await fetch('http://localhost:8000/api/get-quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pickup_details: {
          lat: pickupLat,
          lng: pickupLng
        },
        drop_details: {
          lat: dropLocation.lat,
          lng: dropLocation.lon
        },
        customer: {
          name: 'Rahul',
          phone: '9527699807',
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Porter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Porter quote data:', data);
    setPorterQuotes(prev => ({
      ...prev,
      [vendorId]: data
    }));
    
    return data;
  } catch (error) {
    console.error('Error fetching Porter quote:', error);
    setPorterQuotes(prev => ({
      ...prev,
      [vendorId]: { error: error.message }
    }));
  } finally {
    setLoadingPorterQuotes(prev => ({ ...prev, [vendorId]: false }));
  }
};

// Function to check if porter delivery is available for a vendor
export const isPorterDeliveryAvailable = (vendor) => {
  const porterAvailable = vendor.structured_data?.["Porter Delivery possible"];
  return porterAvailable === 'true' || porterAvailable === true || porterAvailable === 'yes';
};