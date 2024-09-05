import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../pages/DashboardHeader';
import './LocationList.css'; // Import the CSS file
import { useTranslation } from 'react-i18next';

const ip = import.meta.env.VITE_IP_ADDRESS;

interface Location {
  _id: string;
  name: string;
}

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>('');
  const [userLocation, setUserLocation] = useState<string>('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserAndLocations = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch the current user's data
        const userResponse = await axios.get(`https://${ip}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = userResponse.data;
        const role = userData.data.role;
        const locationId = userData.data.location;
        setUserRole(role);

        // Fetch the location details
        if (locationId) {
          const locationResponse = await axios.get(`https://${ip}/api/location/${locationId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserLocation(locationResponse.data.name);
          console.log("location", locationResponse.data.name)
          localStorage.setItem('location', locationResponse.data.name);
        }

        // Fetch all locations
        const locationsResponse = await axios.get(`https://${ip}/api/location`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLocations(locationsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user and locations:', error);
        setLoading(false);
      }
    };

    fetchUserAndLocations();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
        {t('Loading...')}
      </div>
    );
  }

  // Filter locations based on user role and userLocation
  const displayedLocations = userRole === 'delivery' 
    ? locations.filter(location => location.name === userLocation)
    : locations;

  return (
    <div className="locations">
      <DashboardHeader />
      <main className="locations-content">
        <div className="location-buttons">
          {displayedLocations.map((location) => (
            <div key={location._id} className="location-button">
              <button onClick={() => navigate(`/location/${location.name}`)}>
                <p>{t('Clients:')} </p>
                {location.name}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Locations;
