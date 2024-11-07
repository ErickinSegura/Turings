import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function ProtectedRoutes({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ProtectedAdminRoutes({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoutes;
