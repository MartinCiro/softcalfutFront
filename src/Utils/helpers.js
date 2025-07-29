import axios from 'axios';
import AuthService from "@services/AuthService";
import config from "@constants/config";

export const saveSession = ({ access, usuario }) => {
  sessionStorage.setItem("accessToken", access);
  sessionStorage.setItem("userData", JSON.stringify({ usuario }));
};

export const clearSession = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("userData");
};

export const extractResponseData = (data) => data?.result || data?.data || data || {};

export const getFriendlyErrorMessage = (error, msg="Error al iniciar sesión. Intente nuevamente más tarde.") => {
  if (!error.response && error.request) return "No se pudo conectar con el servidor. Verifique su conexión a internet o que el servidor esté en funcionamiento.";

  if (error.code === "ECONNABORTED") return "La conexión con el servidor ha tardado demasiado. Intente nuevamente.";
  
  return (
    error.response?.data?.mensaje ||
    error.response?.data?.message ||
    error.response.data.result ||
    msg
  );
};

export const getStatusConnection = () => {
  if (!navigator.onLine)
    throw new Error(
      "No hay conexión a internet. Por favor, verifique su conexión."
    );
};

export const getByEndpoint = async (endpoint, body = null, method = "get", isFormData = false) => {
  const API_URL = `http://${config.server}`;

  try {
    getStatusConnection();

    const lowerMethod = method.toLowerCase();
    const isBodyMethod = ["post", "put", "patch"].includes(lowerMethod);

    const config = {
      method: lowerMethod,
      url: `${API_URL}/${endpoint}/`,
      headers: {
        ...AuthService.getAuthHeader(),
        ...(isBodyMethod && !isFormData && { "Content-Type": "application/json" })
      },
      timeout: 90000,
      ...(isBodyMethod && body ? { data: body } : {}),
    };
    const response = await axios(config);

    if (response.data && response.data.result) {
      return response.data.result;
    } else {
      throw new Error("No se pudo obtener la información solicitada.");
    }
  } catch (error) {
    console.error("Error al obtener datos para el endpoint:", endpoint, "\nError:", error);
    throw error;
  }
};

// Función para formatear fecha desde cualquier formato
export const parseFecha = (fechaStr) => {
  let date;
  
  if (fechaStr.includes('/')) {
    // Formato dd/mm/yyyy
    const [dia, mes, ano] = fechaStr.split('/');
    return new Date(ano, mes - 1, dia);
  } else {
    // Formato ISO u otro válido para Date
    date = new Date(fechaStr);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getCurrentWeekDates = (empezarEnLunes = false) => {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const diff = empezarEnLunes 
        ? (diaSemana === 0 ? -6 : 1) - diaSemana // Si es domingo, retrocede 6 días
        : -diaSemana; // Empieza en domingo
    
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() + diff);
    
    return Array.from({ length: 7 }).map((_, i) => {
        const fecha = new Date(inicioSemana);
        fecha.setDate(inicioSemana.getDate() + i);
        return fecha;
    });
};

// Guarda un objeto en sessionStorage con un timestamp
export const cacheSession = (key, payload, ttl = 1000 * 60 * 5) => sessionStorage.setItem(key, JSON.stringify({ payload, ts: Date.now(), ttl }));

// Carga un objeto del sessionStorage, validando su TTL
export const loadSessionCache = (key) => {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;

  try {
    const { payload, ts, ttl } = JSON.parse(raw);
    if (Date.now() - ts > ttl) {
      sessionStorage.removeItem(key); // Expirado
      return null;
    }
    return payload;
  } catch {
    sessionStorage.removeItem(key); // Formato inválido
    return null;
  }
};

// Formatear el objeto de permisos a una lista para la tabla
export const dataFormated = (permisosObj) => {
    if (!permisosObj || typeof permisosObj !== "object") return [];
    return Object.entries(permisosObj).map(([entidad, acciones]) => ({
        entidad,
        permisos: acciones,
    }));
};

// Función para formatear fecha ISO a yyyy-MM-dd
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

export const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };