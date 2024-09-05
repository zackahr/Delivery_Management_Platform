// api/useAxiosInterceptor.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from './axiosInstance';

const useAxiosInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Handle token expiration or authentication error
          localStorage.removeItem('token');
          localStorage.removeItem('location');  
          navigate('/login'); // Redirect to login
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [navigate]);
};

export { useAxiosInterceptor };
