// src/components/MapComponent.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Popup } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import './MapComponent.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// Search control component
const SearchControl = ({ onLocationSelect }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
      searchLabel: 'Search for a location...'
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (result) => {
      const { x, y } = result.location;
      // const coordinates = { lat: y, lng: x };
      onLocationSelect(`${y},${x}`);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelect]);

  return null;
};

// Click handler component
const ClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(`${lat},${lng}`);
    }
  });
  return null;
};

const MapComponent = ({ location, setLocation, vendors = [] }) => {
  const defaultPosition = { lat: 19.9975, lng: 73.7898 };
  console.log("vendors:", vendors);
  const currentPosition = location
    ? { lat: parseFloat(location.split(',')[0]), lng: parseFloat(location.split(',')[1]) }
    : defaultPosition;

  const [markerPosition, setMarkerPosition] = useState(currentPosition);

  useEffect(() => {
    if (location) {
      const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
      setMarkerPosition({ lat, lng });
    }
  }, [location]);

  const handleLocationSelect = (locationString) => {
    setLocation(locationString);
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h3>Select Location</h3>
        <p>Click on the map or use the search box to select a location</p>
        {location && (
          <div className="selected-location">
            📍 Selected: {markerPosition.lat.toFixed(4)}, {markerPosition.lng.toFixed(4)}
          </div>
        )}
      </div>

      <MapContainer center={markerPosition} zoom={13} className="leaflet-map">
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <SearchControl onLocationSelect={handleLocationSelect} />
        <ClickHandler onLocationSelect={handleLocationSelect} />

        {/* User-selected location */}
        <Marker position={markerPosition} icon={redIcon}>
          <Popup>Selected Location</Popup>
        </Marker>

        {/* Vendor pins */}
        {vendors.map((vendor, idx) => (
          vendor.lat && vendor.lon && (
            <Marker
            icon={greenIcon}
              key={idx}
              position={{
                lat: parseFloat(vendor.lat),
                lng: parseFloat(vendor.lon)
              }}
            >
              <Popup>
                <strong>{vendor.name}</strong><br />
                📞 {vendor.phone || 'N/A'}
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
