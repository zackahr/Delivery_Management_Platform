import React from 'react';
import { RouteProps, Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC<RouteProps> = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');

  // Check if token exists and is valid (you can adjust this check based on your authentication logic)
  const isAuth = !!token;

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
