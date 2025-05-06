import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  saveSession,
  extractResponseData,
  getFriendlyErrorMessage,
  getStatusConnection,
  getByEndpoint
} from "@utils/Utils";

// Configuración de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Configuración de timeout para las solicitudes
axios.defaults.timeout = 10000; // 10 segundos de timeout

const AuthService = {
  login: async (correo, password) => {
    try {
      const data = await getByEndpoint(`usuarios/login`, {
        correo:   correo,
        passwd: password,
      }, "post");
      const {
        result,
        data: dataAlt,
        tokens,
        correo: userCorreo,
        permisos,
      } = extractResponseData(data);

      if (!tokens) throw new Error("Estructura de respuesta inválida");

      saveSession({
        access: tokens.access,
        refresh: tokens.refresh,
        correo: userCorreo,
        permisos,
      });
      return { tokens, correo: userCorreo, permisos };
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: () => {
    getStatusConnection(); // Verifica la conexión antes de proceder

    const token = localStorage.getItem("accessToken");

    // Si no hay token, no está autenticado
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // El tiempo actual en segundos

      // Si el token no tiene fecha de expiración, se asume que es válido
      if (!decodedToken.exp) {
        console.warn("Token no contiene fecha de expiración");
        return true; // Asumimos que es válido
      }

      // Si el token está por expirar (menos de 5 minutos), refrescarlo en segundo plano
      if (decodedToken.exp - currentTime < 300) {
        console.log(
          "Token a punto de expirar, intentando refrescar en segundo plano"
        );
        AuthService.refreshToken().catch((err) => {
          console.warn("Error al refrescar token en segundo plano:", err);
        });
      }

      // Si el token ha expirado, intentar refrescarlo inmediatamente
      if (decodedToken.exp <= currentTime) {
        console.log("Token expirado, intentando refrescar inmediatamente");
        try {
          const newToken = AuthService.refreshToken();
          return newToken ? true : false; // Si se pudo refrescar, acceder
        } catch (refreshError) {
          console.error("Error al refrescar token expirado:", refreshError);
          return false; // Denegar acceso si no se pudo refrescar
        }
      }

      return decodedToken.exp > currentTime; // Si no ha expirado, permitir acceso
    } catch (error) {
      console.warn("Error al decodificar token:", error);

      // Si no se puede decodificar, intentar refrescar el token
      try {
        const newToken = AuthService.refreshToken();
        return !!newToken; // Permitir acceso solo si se pudo refrescar
      } catch (refreshError) {
        console.error(
          "Error al refrescar token después de error de decodificación:",
          refreshError
        );
        return false; // Denegar acceso si hay error al refrescar
      }
    }
  },

  refreshToken: async () => {
    try {
      // Verificar conexión a internet
      if (!getStatusConnection()) {
        console.warn("No hay conexión a internet. Por favor, verifique su conexión.");
        return null;
      }
  
      const refreshToken = getRefreshToken();

      // Si no hay refresh token, no se puede refrescar
      if (!refreshToken) return null;
  
      // Validar si el refresh token ha expirado
      const decodedRefresh = decodeToken(refreshToken);
      const currentTime = Date.now() / 1000;
      if (decodedRefresh && decodedRefresh.exp && decodedRefresh.exp < currentTime) {
        console.warn("El refresh token ha expirado. Se requiere nuevo inicio de sesión.");
        AuthService.logout();
        return null;
      }
  
      // Hacer la solicitud para refrescar el token
      const response = await axios.post(
        `${API_URL}/usuarios/refresh-token/`,
        { refresh: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 8000,
          validateStatus: () => true, 
        }
      );
  
      if (response.status === 405) throw new Error("Error al refrescar el token: método no permitido");
  
      if (response.status >= 400) throw new Error(`Error al refrescar el token: ${response.data.detail || "Error desconocido"}`);
  
      // Extraer el token correctamente del response
      const responseData = response.data.result || response.data.data || response.data;
  
      if (responseData && responseData.access) {
        localStorage.setItem("accessToken", responseData.access);
        return responseData.access;
      } else if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        return response.data.access;
      } else {
        console.warn("Formato de respuesta inválido al refrescar token.");
        return null;
      }
    } catch (error) {
      console.error("Error al refrescar token:", error);
  
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          console.error("Timeout al refrescar token.");
        } else if (!error.response && error.request) {
          console.error("No se pudo conectar con el servidor al refrescar token.");
        } else if (error.response) {
          if (error.response.status === 401) {
            console.error("Refresh token inválido o expirado. Cerrando sesión.");
            AuthService.logout();
          } else {
            console.error(
              "Error del servidor al refrescar token:",
              error.response.data?.mensaje ||
                error.response.data?.message ||
                "Error desconocido"
            );
          }
        }
      }
  
      return null;
    }
  },

  getAuthHeader: () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default AuthService;
