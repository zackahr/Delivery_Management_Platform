import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType;
  role: string;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, role, allowedRoles }) => {
  return allowedRoles.includes(role) ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
