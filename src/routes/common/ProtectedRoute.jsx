import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '@services/AuthService';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: true,
    isChecking: true
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (token && AuthService.isAuthenticated()) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp > currentTime) {
            setAuthState({ isAuthenticated: true, isChecking: false });
            return;
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
      }

      setAuthState({ isAuthenticated: false, isChecking: false });
    };

    checkAuth();
  }, []);

  if (authState.isChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    AuthService.logout();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
