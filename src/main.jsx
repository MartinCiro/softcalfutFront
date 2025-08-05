import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@src/index.css'
import App from '@src/App.jsx'
import axios from 'axios'
import AuthService from '@services/AuthService'
import { AuthProvider } from '@hooks/AuthContext';

// Importar estilos de Bootstrap y MDBootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Configurar interceptores globales para axios
axios.interceptors.request.use(
  config => {
    // Añadir token de autenticación a todas las solicitudes si existe
    const token = sessionStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const publicRoutes = ['/login', '/lcf/historia', '/lcf/mision-vision', '/nuestros-afiliados', '/torneos/futbol', '/torneos/futbol-sala', '/torneos/programacion'];
    const isPublicRoute = publicRoutes.some(route => window.location.pathname.includes(route));
    if (isPublicRoute) return Promise.reject(error);

    // Si el error es 401 (Unauthorized) y no es una solicitud de refresh token
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('refresh')) {
      
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const newToken = await AuthService.refreshToken();
        if (newToken) {
          // Actualizar el token en la solicitud original y reintentarla
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error al refrescar el token:', refreshError);
        // Si falla el refresh, redirigir al login
        AuthService.logout();
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </AuthProvider>,
)
