import { useState, useEffect } from 'react';
import AuthService from '@services/AuthService';

export default function useAuth() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = AuthService.isAuthenticated();
        const user = AuthService.getCurrentUser();
        
        setAuthState({
          isAuthenticated: isAuth,
          loading: false,
          user: isAuth ? user : null
        });
      } catch (error) {
        console.error("Error verifying auth:", error);
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null
        });
      }
    };

    checkAuth();

    // Opcional: Configurar intervalo para verificación periódica
    const interval = setInterval(checkAuth, 30000); // 30 segundos
    return () => clearInterval(interval);
  }, []);

  return {
    ...authState,
    // Métodos adicionales que podrías necesitar
    login: AuthService.login,
    logout: AuthService.logout
  };
}