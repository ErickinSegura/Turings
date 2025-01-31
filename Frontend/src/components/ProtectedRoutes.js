import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function ProtectedRoutes({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'teacher') {
      return <Navigate to="/profesor" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoutes;