import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '@services/AuthService';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: true, // Iniciar asumiendo autenticación para evitar parpadeos
    isChecking: true
  });
  
  useEffect(() => {
    // Verificar autenticación cuando el componente se monta
    let timeoutId; 
    const tryRefresh = async () => {
      try {
        const newToken = await AuthService.refreshToken();
        setAuthState({ isAuthenticated: !!newToken, isChecking: false });
      } catch (error) {
        console.error('Error en refresh token:', error);
        setAuthState({ isAuthenticated: false, isChecking: false });
      }
    };

    const checkAuth = async () => {
    
      try {
        const token = localStorage.getItem('accessToken');
        if (token && AuthService.isAuthenticated()) {
          setAuthState({ isAuthenticated: true, isChecking: false });
        } else {
          await tryRefresh();
          return; // No seguir si el refresh fue necesario
        } 

        // Si el token existe y está cerca de expirar, programar un refresco
        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          // Refrescar el token silenciosamente 5 minutos antes de la expiración
          if (decodedToken.exp && decodedToken.exp - currentTime < 300) await AuthService.refreshToken();

          // Calcular el tiempo restante hasta la expiración y configurar un timeout para refrescar el token
          const timeToExpire = decodedToken.exp * 1000 - currentTime * 1000 - 300000;
          timeToExpire > 0 ? timeoutId = setTimeout(checkAuth, timeToExpire) :await tryRefresh();
        }
      } catch (error) {
        console.error('Error en checkAuth:', error);
        await tryRefresh();
      }
    };
    
    checkAuth();
    
    return () => {if (timeoutId) clearTimeout(timeoutId);}
  }, []);
  
  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (authState.isChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando autenticación...</span>
        </div>
      </div>
    );
  }
  
  // Si el usuario no está autenticado después de la verificación, redirigir al login
  if (!authState.isAuthenticated) return <Navigate to="/login" replace />;

  // Si está autenticado, renderizar los componentes hijos
  return <Outlet />;
};

export default ProtectedRoute;