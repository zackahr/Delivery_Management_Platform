import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, useAxiosInterceptor } from '../api/axiosInstance';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import DashboardHeader from '../pages/DashboardHeader';
import './AddLocationAndUser.css';

const ip = import.meta.env.VITE_IP_ADDRESS;

const AddLocationAndUser: React.FC = () => {
  const [locationName, setLocationName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('delivery'); // Default to 'delivery'
  const [locations, setLocations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize the translation hook

  useAxiosInterceptor(); // Set up the interceptor

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`https://${ip}/api/location`);
        setLocations(response.data.map((loc: { name: string }) => loc.name));
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');

      // Add location
      await axiosInstance.post('location', { name: locationName }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Create user
      await axios.post(`https://${ip}/api/user`, {
        name: userName,
        password,
        role,
        locationName
      });

      setLocationName('');
      setUserName('');
      setPassword('');
      setRole('delivery');
      setError(null);

      navigate('/dashboard'); // Redirect to dashboard after successful creation
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || t('An error occurred')); // Set error message with translation
      } else {
        setError(t('An error occurred'));
      }
      console.error('Error adding location and creating user:', error);
    }
  };

  return (
    <div>
      <DashboardHeader />
      <div className="add-location-and-user-container">
        <h2>{t('Create User')}</h2> {/* Use translation for heading */}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="locationName">{t('Location Name')}</label> {/* Use translation for labels */}
            <input
              type="text"
              id="locationName"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="userName">{t('name')}</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">{t('Password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="role">{t('Role')}</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">{t('Admin')}</option>
              <option value="delivery">{t('Delivery')}</option>
            </select>
          </div>
          <button className="btn" type="submit">{t('Save')}</button> {/* Use translation for button */}
        </form>
      </div>
    </div>
  );
};

export default AddLocationAndUser;
