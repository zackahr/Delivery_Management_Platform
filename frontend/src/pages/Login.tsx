import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, useAxiosInterceptor } from '../api/axiosInstance';
import { useUserRole } from '../context/UserRoleContext';
import { useTranslation } from 'react-i18next';
import './Login.css';
import axios from 'axios';


const Login: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupStyle, setPopupStyle] = useState(''); // State for popup style
  const navigate = useNavigate();
  const { setUserRole } = useUserRole();

  useAxiosInterceptor();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await axiosInstance.post('user/login', {
        username,
        password,
      });
  
      const token = response.data.access_token;
      localStorage.setItem('token', token);
  
      setUsername('');
      setPassword('');
      setError(null);
  
      const userResponse = await axiosInstance.get('user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const role = userResponse.data.data.role;
      const locationId = userResponse.data.data.location;
      localStorage.setItem('userRole', role);
      setUserRole(role);
  
      if (locationId) {
        const locationResponse = await axiosInstance.get(`location/${locationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const locationName = locationResponse.data.name;
        localStorage.setItem('userLocation', locationName);
      }
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message;
  
        if (error.response?.status === 401) {
          setPopupStyle('error-popup red-popup'); // Set red style for 401
          if (errorMessage === 'User not found') {
            setError(t('User not found'));
          } else if (errorMessage === 'Invalid password') {
            setError(t('Invalid password'));
          } else {
            setError(errorMessage || t('An error occurred'));
          }
        } else {
          setPopupStyle('error-popup'); // Default error popup style
          setError(errorMessage || t('An error occurred'));
        }
      } else {
        setError(t('An error occurred'));
        setPopupStyle('error-popup'); // Default error popup style
      }
      setShowPopup(true);
      setUsername('');
      setPassword('');
      console.error('Login error:', error);
    }
  };
  
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className="login-container">
      {showPopup && (
        <div className={popupStyle}>
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleLogin}>
        <h2>{t('Al morakochi')}</h2>
        <div className="input-group">
          <label htmlFor="username">{t('Username')}:</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="password">{t('Password')}:</label>
          <div className="input-wrapper">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button className="btn" type="submit">{t('Login')}</button>
      </form>
    </div>
  );
};

export default Login;
