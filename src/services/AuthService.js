import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  saveSession,
  extractResponseData,
  getFriendlyErrorMessage,
  getStatusConnection,
  getByEndpoint
} from "@utils/Utils";

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.timeout = 10000; // 10 segundos

const AuthService = {
  login: async () => {
    try {
      const dataF = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJkb2MiOiI0MTIzIiwibm9tYnJlIjoibWFydGluIGNpcm8iLCJpZF9yb2wiOjIsInBlcm1pc29zIjpbIkxlZSIsIkFjdHVhbGl6YSIsIkNyZWEiLCJFbGltaW5hIiwiSW5oYWJpbGl0YSJdfSwiaWF0IjoxNzQ2NTU5NzE4LCJleHAiOjE3NDY1NjMzMTh9.I3C6QjREYOgBkjRruTBB8znOjaEDLanAov6iXreFPD4",
        usuario: {
          doc: "4123",
          nombre: "martin ciro",
          rol: "Admin",
          estado: "Activo"
        }
      };

      const { token, usuario } = dataF;
      if (!token) throw new Error("Estructura de respuesta inválida");

      sessionStorage.setItem("accessToken", token);
      sessionStorage.setItem("userData", JSON.stringify(usuario));
      return { token, usuario };
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  logout: () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userData");
  },

  getCurrentUser: () => {
    const userData = sessionStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: () => {
    getStatusConnection();

    const token = sessionStorage.getItem("accessToken");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp ? decoded.exp > currentTime : true;
    } catch (e) {
      console.warn("Token inválido:", e);
      return false;
    }
  },

  getAuthHeader: () => {
    const token = sessionStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

export default AuthService;
