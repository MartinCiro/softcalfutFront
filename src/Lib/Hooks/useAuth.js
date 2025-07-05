// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Este es un hook personalizado para manejar la autenticación
export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar autenticación al cargar (puedes usar localStorage, cookies, contexto, etc.)
  useEffect(() => {
    const checkAuth = () => {
      // Aquí verificas si el usuario está autenticado
      // Ejemplo básico con localStorage:
      const token = localStorage.getItem('authToken');
      const userIsAuthenticated = !!token; // Convierte a booleano
      
      setIsAuthenticated(userIsAuthenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    navigate('/dashboard'); // Redirige al dashboard después de login
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login'); // Redirige al login después de logout
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout
  };
}