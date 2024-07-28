import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import './Dashboard.css';
import { useTranslation } from 'react-i18next';

const ip = import.meta.env.VITE_IP_ADDRESS;

interface Location {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
  location: string; // This is the location ID
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Record<string, Location>>({});
  const [allUsers, setAllUsers] = useState<User[]>([]); // Store all users here
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userRole = localStorage.getItem('userRole'); // Get user role from local storage
  const userLocationName = localStorage.getItem('userLocation'); // Get user location name from local storage

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all locations
        const locationResponse = await axios.get(`https://${ip}/api/location`, { headers });
        const fetchedLocations = locationResponse.data;
        
        // Create a map of location ID to name
        const locationMap: Record<string, Location> = {};
        fetchedLocations.forEach((loc: Location) => {
          locationMap[loc._id] = loc;
        });

        setLocations(locationMap);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all users
        const userResponse = await axios.get(`https://${ip}/api/user/`, { headers });
        const fetchedUsers = userResponse.data;

        setAllUsers(fetchedUsers); // Store all users
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (userRole === 'delivery' && userLocationName) {
      // Find the ID corresponding to the user location name
      const userLocationId = Object.keys(locations).find(
        locationId => locations[locationId].name === userLocationName
      );

      if (userLocationId) {
        const filteredUsers = allUsers.filter(user => user.location === userLocationId);
        setUsers(filteredUsers);
      }
    } else {
      // If admin or no specific location, show all users
      setUsers(allUsers);
    }
  }, [userRole, userLocationName, locations, allUsers]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
        {t('Loading...')}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <DashboardHeader />
      <main className="dashboard-content">
        <div className="user-container">
          {users.map((user) => (
            <div key={user._id} className="user-button">
              <button onClick={() => navigate(`/user/${user._id}/commands`)}>
                {user.name}
                <br />
                {locations[user.location]?.name || 'Location not found'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
