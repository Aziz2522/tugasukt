import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in -> redirect to login page
    return <Navigate to="/" replace />;
  }

  // Logged in -> render whichever Dashboard is requested
  return children;
};

export default ProtectedRoute;
