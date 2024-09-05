import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from '@react-google-maps/api';
import './MapModal.css';

interface MapModalProps {
  client: {
    clientLocation: {
      latitude: number;
      longitude: number;
    };
  };
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ client, onClose }) => {
  const { latitude, longitude } = client.clientLocation;
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_API;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
  });

  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Function to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const toRad = (value: number) => value * (Math.PI / 180);
    const R = 6371000; // Earth's radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(userLocation);

          // Calculate distance between user location and client location
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            latitude,
            longitude
          );

          // Fetch directions only if distance is more than 100 meters
          if (distance > 100) {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route(
              {
                origin: userLocation,
                destination: { lat: latitude, lng: longitude },
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                  setDirections(result);
                } else {
                  console.error(`Error fetching directions: ${status}`);
                }
              }
            );
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [latitude, longitude]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded || !currentLocation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="map-modal">
      <div className="map-modal-content">
        <button className="map-modal-close" onClick={onClose}>×</button>
        <div className="map-container">
          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '100%' }}
            center={currentLocation}
            zoom={14}
            onLoad={(mapInstance) => setMap(mapInstance)}
          >
            {/* Render directions if available */}
            {directions && (
              <DirectionsRenderer directions={directions} />
            )}
            <Marker position={currentLocation} />
            <Marker position={{ lat: latitude, lng: longitude }} />
          </GoogleMap>
        </div>
        <div className="location-info">
          <p><strong>Client Longitude:</strong> {longitude}</p>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
