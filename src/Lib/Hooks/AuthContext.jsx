import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '@services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Función para actualizar el estado desde sessionStorage
  const updateAuthState = () => {
    const user = AuthService.getCurrentUser();
    const isAuthenticated = AuthService.isAuthenticated();
    
    setAuthState({
      user,
      isAuthenticated,
      isLoading: false
    });
  };

  // Sincronizar al montar y cuando cambia sessionStorage
  useEffect(() => {
    updateAuthState();
    const handleStorageChange = () => updateAuthState();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email, password, navigate) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const userData = await AuthService.login(email, password, navigate);
      updateAuthState();
      return userData;
    } catch (error) {
      updateAuthState(); 
      throw error;
    }
  };

  const logout = (navigate) => {
    AuthService.logout(navigate);
    updateAuthState();
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};