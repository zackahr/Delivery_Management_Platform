import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ip = import.meta.env.VITE_IP_ADDRESS;

const axiosInstance = axios.create({
  baseURL: `https://${ip}/api/`,
  withCredentials: true, // Ensure cookies are sent with requests
});

const useAxiosInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Handle token expiration
          localStorage.removeItem('token');
          navigate('/'); // Use navigate instead of window.location.href
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [navigate]);
  useEffect(() => {
    axiosInstance.defaults.withCredentials = true;
  }, []);
};

export { axiosInstance, useAxiosInterceptor };
