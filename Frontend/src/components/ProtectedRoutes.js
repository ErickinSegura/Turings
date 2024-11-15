import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function ProtectedRoutes({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    // Si no está autenticado, redirige a la página de login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si el rol del usuario no está permitido, redirige a una página de error o inicio
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoutes;
