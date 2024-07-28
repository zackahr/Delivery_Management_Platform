import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to import axios if it's used for error handling
import { axiosInstance, useAxiosInterceptor } from '../api/axiosInstance';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './AddClient.css';
import DashboardHeader from '../pages/DashboardHeader';

const AddClient: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // Add success state
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize the translation hook

  useAxiosInterceptor(); // Set up the interceptor

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post('client', { name, phone }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setName('');
      setPhone('');
      setError(null);
      setSuccess(t('Client successfully added!')); // Set success message with translation

      setTimeout(() => {
        setSuccess(null); // Hide success message after 5 seconds
        navigate('/locations'); // Redirect to the clients page or any other page
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || t('An error occurred')); // Set error message with translation
      } else {
        setError(t('An error occurred'));
      }
      console.error('Error adding client:', error);
    }
  };

  return (
    <div>
      <DashboardHeader />
      <div className="add-client-container">
        <h3>{t('Add Client')}</h3>
        {error && <p className="error">{error}</p>}
        {success && <div className="success-popup">{success}</div>} {/* Display success message */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">{t('name')}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">{t('phone number')}</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button className="btn" type="submit">{t('Add Client')}</button>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
