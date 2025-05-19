import AuthService from "@services/AuthService";
import axios from 'axios';

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
    msg
  );
};

export const getStatusConnection = () => {
  if (!navigator.onLine)
    throw new Error(
      "No hay conexión a internet. Por favor, verifique su conexión."
    );
};

export const getByEndpoint = async (endpoint, body = null, method = "get") => {
  const API_URL = import.meta.env.VITE_API_URL;

  try {
    getStatusConnection();

    const lowerMethod = method.toLowerCase();
    const isBodyMethod = ["post", "put", "patch"].includes(lowerMethod);

    const config = {
      method: lowerMethod,
      url: `${API_URL}/${endpoint}/`,
      headers: {
        ...AuthService.getAuthHeader(),
        ...(isBodyMethod && { "Content-Type": "application/json" }),
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
export const dateFormatter = (fechaInput) => {
  if (!fechaInput) return 'Sin fecha';

  const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  const formatISODate = (str) => {
    const [year, month, day] = str.split('-');
    return `${day}/${month}/${year}`;
  };

  let fechaStr = '';

  if (typeof fechaInput === 'object' && fechaInput !== null) {
    if (fechaInput.fecha) fechaStr = fechaInput.fecha;
    else if (fechaInput.uuid) return 'Fecha no disponible';
    else return 'Sin fecha';
  } else if (typeof fechaInput === 'string') {
    fechaStr = fechaInput;
  } else {
    return 'Sin fecha';
  }

  if (isUUID(fechaStr) || (fechaStr.includes('-') && fechaStr.length > 30)) return 'Fecha no disponible';
  if (/^\d{4}-\d{2}-\d{2}/.test(fechaStr)) return formatISODate(fechaStr);

  const fecha = new Date(fechaStr);
  if (!isNaN(fecha.getTime())) {
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  return fechaStr;
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
