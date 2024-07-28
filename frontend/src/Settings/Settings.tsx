import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Settings.css';
import DashboardHeader from '../pages/DashboardHeader';

const ip = import.meta.env.VITE_IP_ADDRESS;

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<{ name: string; password: string; _id: string } | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get(`https://${ip}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          const userData = response.data;
          setUser(userData);
          setName(userData.name);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user data', error);
          setLoading(false);
        });
    } else {
      navigate('/login');
    }
  }, [navigate, token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      axios.patch(`https://${ip}/api/user/${user._id}`, { name, password }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          alert(t('User updated successfully!'));
        })
        .catch(error => {
          console.error('Error updating user data', error);
        });
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
        {t('Loading...')}
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader />
      <div className="settings">
        <h3>{t('Settings')}</h3>
        {user ? (
          <form onSubmit={handleSubmit}>
            <div>
              <label>{t('name')}</label>
              <input
                type="text"
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>{t('Password')}</label>
              <input
                type="password"
                value={password || ''}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">{t('Modify')}</button>
          </form>
        ) : (
          <p>{t('Error loading user data')}</p>
        )}
      </div>
    </div>
  );
};

export default Settings;
