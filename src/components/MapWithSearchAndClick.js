import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

const SearchControl = ({ onSelect }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { x, y } = result.location;
      onSelect({ lat: y, lng: x });
    });

    return () => map.removeControl(searchControl);
  }, [map, onSelect]);

  return null;
};

const ClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    }
  });
  return null;
};

const MapWithSearchAndClick = ({ location, setLocation }) => {
  const position = location
    ? { lat: parseFloat(location.split(",")[0]), lng: parseFloat(location.split(",")[1]) }
    : { lat: 19.9975, lng: 73.7898 };

  const [marker, setMarker] = useState(position);

  const handleSelect = (coords) => {
    setMarker(coords);
    setLocation(`${coords.lat},${coords.lng}`);
  };

  return (
    <MapContainer center={position} zoom={13} style={{ height: "300px" }}>
      <TileLayer
        attribution='© OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SearchControl onSelect={handleSelect} />
      <ClickHandler onSelect={handleSelect} />
      <Marker position={marker} />
    </MapContainer>
  );
};

export default MapWithSearchAndClick;
