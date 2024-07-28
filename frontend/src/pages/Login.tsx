import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, useAxiosInterceptor } from '../api/axiosInstance';
import { useUserRole } from '../context/UserRoleContext';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './Login.css';

const Login: React.FC = () => {
  const { t } = useTranslation(); // Initialize the translation hook
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUserRole } = useUserRole();

  useAxiosInterceptor(); // Set up the interceptor

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
      setUserRole(role); // Ensure this is called to update the state

      if (locationId) {
        // Fetch the location details
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
        setError(error.response?.data.message || t('An error occurred'));
      } else {
        setError(t('An error occurred'));
      }
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>{t('Al morakochi')}</h2>
        {error && <p className="error">{error}</p>}
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
