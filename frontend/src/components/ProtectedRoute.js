import React from 'react';
import { Navigate } from 'react-router-dom';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {

    return <Navigate to="/login" replace />;
  }
  
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const isExpired = tokenData.exp * 1000 < Date.now();
    
    if (isExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
    
    return children;
  } catch (error) {
    // Invalid token format
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;