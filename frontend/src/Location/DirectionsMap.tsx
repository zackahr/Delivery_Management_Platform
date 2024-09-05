import React, { useState, useEffect } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

interface DirectionsMapProps {
  origin: { lat: number, lng: number };
  destination: { lat: number, lng: number };
  onClose: () => void;
}

const DirectionsMap: React.FC<DirectionsMapProps> = ({ origin, destination, onClose }) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_API;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
    libraries: ['places'],
  });

  useEffect(() => {
    if (isLoaded) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isLoaded, origin, destination]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="map-modal">
      <div className="map-modal-content">
        <button className="map-modal-close" onClick={onClose}>×</button>
        <div className="map-container">
          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '100%' }}
            center={origin}
            zoom={10}
          >
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: '#0000FF',
                    strokeOpacity: 0.7,
                    strokeWeight: 5,
                  },
                }}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default DirectionsMap;
